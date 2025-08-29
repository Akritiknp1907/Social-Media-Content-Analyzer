/**
 * @api 
 * @desc 
 * @param {file} file
 * @returns {Object} 

/**
 * @api GET /health
 * @desc 
 * @returns {Object} 
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const Sentiment = require("sentiment");
const { GoogleGenerativeAI } = require("@google/generative-ai");



const app = express();
// app.use(cors({
//   origin: [
//     "http://localhost:5173", // local dev
//     // "https://social-media-content-analyzer.vercel.app", 
//     // "https://social-media-content-analyzer-sage.vercel.app" 
//     "https://social-media-content-analyzer-8xo5.onrender.com"
//   ],
//   methods: ["GET", "POST"],    
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(cors({
  origin: "*",         // allow from anywhere
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only PDF/PNG/JPG allowed"));
  }
});


const sentiment = new Sentiment();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text || "";
}




async function extractTextFromImage(buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return data?.text || "";
}



function basicAnalyze(text) {
  const words = (text.match(/\b\w+\b/g) || []);
  const sentences = (text.split(/[.!?]+/).filter(s => s.trim().length > 0));
  const score = sentiment.analyze(text).score;

  return {
    metrics: {
      charCount: text.length,
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgWordsPerSentence: sentences.length ? Math.round(words.length / sentences.length) : words.length,
      sentimentScore: score
    }
  };
}


async function generateSummaries(text) {
  try {
    const input = text.slice(0, 2000);

    const [shortRes, mediumRes, longRes] = await Promise.all([
      model.generateContent(`Summarize this text in 2–3 sentences: ${input}`),
      model.generateContent(`Summarize this text in 5–6 sentences: ${input}`),
      model.generateContent(`Give me a long detailed summary of this text: ${input}`)
    ]);

    return {
      short: shortRes.response.text(),
      medium: mediumRes.response.text(),
      long: longRes.response.text()
    };
  } catch (err) {
    console.error("Summarization error:", err);
    return { error: "Summarization failed. This may be due to reaching the daily quota or limits of the Gemini API. The code is working, but the API may be temporarily unavailable. Please try again later or check API usage/quota." };
  }
}


app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please upload PDF, JPG, or PNG." });
    }

    const { mimetype, buffer, originalname } = req.file;
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(mimetype)) {
      return res.status(400).json({ error: "File type not supported. Please upload PDF, JPG, or PNG." });
    }

    let text = "";
    if (mimetype === "application/pdf") {
      text = await extractTextFromPdf(buffer);
    } else {
      text = await extractTextFromImage(buffer);
    }

    text = text.trim();
    if (!text) return res.status(422).json({ error: "No text extracted. Try clearer image or selectable PDF." });

    const analysis = basicAnalyze(text);
    const summaries = await generateSummaries(text);

    res.json({
      filename: originalname,
      mimetype,
      extractedText: text,
      analysis,
      summaries
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
