PostMate – Social Media Post Analyzer

PostMate is an AI-powered assistant that helps you analyze your social media posts before publishing.
Just upload a PDF or Image (JPG/PNG) and let PostMate:

Extract the text
Analyze sentiment & readability
Suggest improvements for better engagement
Keep track of your past analyses with history

📸 Demo Preview

Features

- Smart Uploads – Supports PDF, JPG, PNG with drag & drop

- AI-Powered Analysis – Extracts text & generates insights

- Multiple Levels of Analysis – Quick, Overview, Deep Dive

- Suggestions Engine – Actionable improvements for better reach

- Engagement Insights – Sentiment & readability metrics

- Dark Mode – Clean and modern UI

- History Tracking – Access past results anytime

- Copy, Download & Share – Share insights directly

Tech Stack

Frontend: React (Vite), Axios, Custom CSS 
Backend: Node.js + Express
AI/Analysis: LLM-powered custom API
Deployment: Vercel / Render

Project Structure
postmate/
│
├── src/
│   ├── components/     # Reusable components (FileUpload, ResultCard, etc.)
│   ├── App.jsx         # Main app logic
│   ├── App.css         # Styles (light/dark modes, responsiveness)
│   └── ...
│
├── server/             # Backend (Express + analysis API)
│   ├── server.js
│   └── ...
│
├── public/             # Static assets
├── README.md           # Documentation
└── package.json

Roadmap / Future Scope

(a) Multi-language support

(b) Advanced analytics dashboard (charts & graphs)

(c) Enhanced OCR for better image text extraction

(d) Post scheduling & social media integration

(e) Export analysis as PDF/CSV

## API Endpoints
- `POST /api/analyze` — Upload and analyze a file
- `GET /health` — Health check

## Environment Variables
- `VITE_API_URL` in client/.env
- `GEMINI_API_KEY` in server/.env

## License
MIT
