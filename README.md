# TextMate

A modern content assistant web app for uploading PDF, JPG, or PNG files, extracting text, analyzing metrics, and generating AI-powered summaries.

## Features
- Upload PDF, JPG, or PNG files
- Extract and preview text
- Analyze content metrics (word count, sentiment, etc.)
- Generate short, medium, and long AI summaries
- Copy, download, and share results
- History of recent uploads
- Responsive, beautiful UI with dark mode
- Full error handling and validation

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
1. Clone the repo:
   ```sh
   git clone <your-repo-url>
   cd SOCIAL MEDIA CONTENT ANALYZER
   ```
2. Install dependencies for both client and server:
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```

### Running Locally
1. Start the backend:
   ```sh
   cd server
   npm start
   ```
2. Start the frontend:
   ```sh
   cd ../client
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
```
hello/
  client/      # React frontend
  server/      # Node.js backend
```

## API Endpoints
- `POST /api/analyze` — Upload and analyze a file
- `GET /health` — Health check

## Environment Variables
- `VITE_API_URL` in client/.env
- `GEMINI_API_KEY` in server/.env

## License
MIT
