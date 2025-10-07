# 🚀 PostMate – Social Media Post Analyzer

**PostMate** is an AI-powered web app that helps creators, marketers, and professionals analyze their social media posts **before publishing**.  
Just upload a **PDF or Image (JPG/PNG)** — PostMate will extract the text, analyze it for **sentiment, readability, and engagement**, and even **suggest improvements** to boost your reach.  

---

## 📸 Demo Preview

<p align="center">
  <img src="./screenshot.png" alt="PostMate App Screenshot" width="800"/>
</p>

> 🖼️ *Above: PostMate’s clean dark UI with instant analysis preview.*

---

## ✨ Features

### 💡 For All Users
- 📤 **Smart Uploads** – Drag & drop support for PDF, JPG, and PNG files  
- 🤖 **AI-Powered Analysis** – Extracts text and generates deep insights  
- 📊 **Multiple Levels of Analysis** – Quick, Overview, and Deep Dive  
- 💬 **Suggestions Engine** – Actionable tips to improve post performance  
- 📈 **Engagement Insights** – Sentiment, tone, and readability metrics  
- 🌓 **Dark Mode UI** – Sleek, modern, and distraction-free interface  
- 🕓 **History Tracking** – View and compare past analysis reports  
- 🔗 **Copy, Download & Share** – Easily share insights across platforms  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite), Axios, Custom CSS |
| **Backend** | Node.js, Express.js |
| **AI / Analysis** | LLM-powered custom API |
| **Deployment** | Vercel / Render |

---


## 🧭 API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/analyze` | Upload and analyze a file |
| `GET` | `/health` | Server health check |

---

## ⚙️ Environment Variables

Create `.env` files in both client and server directories:

### 🖥️ `client/.env`

### 🧠 `server/.env`


---

## 🗺️ Roadmap / Future Scope

- 🌐 Multi-language support  
- 📊 Advanced analytics dashboard (charts & graphs)  
- 🔍 Enhanced OCR for better image text extraction  
- ⏰ Post scheduling & social media integration  
- 📑 Export analysis as PDF/CSV  

---

## 🧪 Run Locally

### 1️⃣ Clone the repository

git clone https://github.com/Akritiknp1907/PostMate.git
cd PostMate
cd client
npm install

# Server
cd ../server
npm install

# Run backend
npm run server

# Run frontend
npm run dev
