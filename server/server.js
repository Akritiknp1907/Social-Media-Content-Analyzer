/**
 * @api 
 * @desc 
 * @param {file} file
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
const emojiRegex = require("emoji-regex");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only PDF/PNG/JPG allowed"));
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
  const hashtagCount = (text.match(/#[\w]+/g) || []).length;
  const mentionCount = (text.match(/@\w+/g) || []).length;
  const linkCount = (text.match(/https?:\/\/[^\s]+/g) || []).length;

  const re = emojiRegex();
  let emojiCount = (text.match(re) || []).length;


  const fallbackEmojiLike = (text.match(/([�□?]){2,}/g) || []).length;


  emojiCount = emojiCount + fallbackEmojiLike;


  const sentimentResult = sentiment.analyze(text);

  return {
    metrics: {
      hashtagCount,
      emojiCount,
      mentionCount,
      linkCount,
      sentimentScore: sentimentResult.score
    }
  };
}

async function generateAnalysis(text) {
  try {
    const input = text.slice(0, 2000);

    const [shortRes, mediumRes, longRes] = await Promise.all([
      model.generateContent(`You are a social media expert. Analyze the following post. 

                              First, provide your analysis in about 150 words. 
                              Then write three '-' symbols. 
                              After that, suggest 3-5 specific improvements to increase engagement 
                              (e.g., clarity, hashtags, call-to-action, tone, formatting, etc).

                              Important:
                              - Give improvements ONLY as a clean numbered list (1., 2., 3., etc).
                              - Do not write any introductory text like "Here are improvements" or "Suggestions are".
                              - Each improvement should have a short heading in bold (**...**) followed by a clear explanation.
                              - Follow this format exactly: ${input}`),

      model.generateContent(`You are a social media expert. Analyze the following post. 

                              First, provide your analysis in about 250 words. 
                              Then write three '-' symbols. 
                              After that, suggest 5-7 specific improvements to increase engagement 
                              (e.g., clarity, hashtags, call-to-action, tone, formatting, etc).

                              Important:
                              - Give improvements ONLY as a clean numbered list (1., 2., 3., etc).
                              - Do not write any introductory text like "Here are improvements" or "Suggestions are".
                              - Each improvement should have a short heading in bold (**...**) followed by a clear explanation.
                              - Follow this format exactly: ${input}`),

      model.generateContent(`You are a social media expert. Analyze the following post. 

                                First, provide your analysis in about 350 words. 
                                Then write three '-' symbols. 
                                After that, suggest 7-9 specific improvements to increase engagement 
                                (e.g., clarity, hashtags, call-to-action, tone, formatting, etc).

                                Important:
                                - Give improvements ONLY as a clean numbered list (1., 2., 3., etc).
                                - Do not write any introductory text like "Here are improvements" or "Suggestions are".
                                - Each improvement should have a short heading in bold (**...**) followed by a clear explanation.
                                - Follow this format exactly: ${input}`)
    ]);

    return {
      short: shortRes.response.text(),
      medium: mediumRes.response.text(),
      long: longRes.response.text()
    };
  } catch (err) {
    console.error("Analysis error:", err);
    return { error: "Analysis failed. Possibly Gemini API quota issue." };
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
    const postInsights = await generateAnalysis(text);  // ✅ renamed here

    res.json({
      filename: originalname,
      mimetype,
      extractedText: text,
      analysis,
      postInsights   // ✅ renamed here
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
