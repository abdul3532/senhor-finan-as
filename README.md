# 🤖 Senhor Finanças (FinMate)

![Status](https://img.shields.io/badge/Status-MVP_Complete-green)
![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20Supabase-blue)
![AI](https://img.shields.io/badge/AI-OpenAI%20GPT--4o-purple)

**Senhor Finanças** is an AI-powered financial intelligence platform designed to democratize professional-grade portfolio analysis. By combining real-time market news, personalized portfolio context, and Large Language Model (LLM) reasoning, it transforms raw data into actionable insights for retail investors.

## 🌐 Live Demo

- **Frontend**: [https://senhor-financas.vercel.app](https://senhor-financas.vercel.app) *(deploying)*
- **Backend API**: [https://senhor-finan-as-o2yt.onrender.com](https://senhor-finan-as-o2yt.onrender.com)
- **API Docs**: [https://senhor-finan-as-o2yt.onrender.com/docs](https://senhor-finan-as-o2yt.onrender.com/docs)

---

## 🚀 Key Features

*   **📊 Smart Dashboard**: visualizes your portfolio's performance and "Impact Previsions" (how today's news affects *your* assets).
*   **📰 AI News Analyst**: Automatically fetches, filters, and analyzes financial news. Assigns sentiment scores and risk levels specifically tailored to your holdinngs.
*   **💬 Financial Assistant**: A conversational agent akin to a robust financial advisor. It can browse the web, check live stock prices, and analyze document uploads (PDFs) to answer complex investment queries.
*   **🔒 Enterprise-Grade Security**: Fully secured with Supabase Authentication (JWT) and Row Level Security (RLS) policies ensuring data privacy.
*   **👁️ Observability**: Integrated with **Langfuse** for full transparency into AI reasoning, latency, and costs.

---

## 🛠️ Technology Stack

*   **Frontend**: React, Vite, TailwindCSS, shadcn/ui
*   **Backend**: Python, FastAPI, Pydantic
*   **Database**: PostgreSQL (Supabase)
*   **AI Engine**: OpenAI GPT-4o
*   **Tools**: DuckDuckGo Search, Yahoo Finance (yfinance), PyPDF2

📄 **[Read the Architecture Documentation](docs/ARCHITECTURE.md)** for a deep dive into technical decisions.

---

## 📦 Getting Started

### Prerequisites
*   Node.js v18+
*   Python 3.10+
*   Supabase Account

### 1. Backend Setup

```bash
cd finmate-nextjs/backend
python -m venv venv
# Activate venv (Windows: .\venv\Scripts\Activate.ps1 | Mac/Linux: source venv/bin/activate)

pip install -r requirements.txt
```

Create a `.env` file in `backend/` with your keys:
```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=ey... (Service Role Key)
LANGFUSE_SECRET_KEY=...
LANGFUSE_PUBLIC_KEY=...
LANGFUSE_HOST=https://cloud.langfuse.com
```

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd finmate-nextjs/frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## ☁️ Deployment

*   **Frontend**: Recommended deployment on **Vercel** or **Netlify**.
*   **Backend**: Recommended deployment on **Render** or **Railway**.
*   **Database**: Managed by **Supabase**.

See `docs/ARCHITECTURE.md` for environmental configuration details.

---

## 👥 Team
**NOVA IMS Capstone Project 2025/2026**
*   Abdul Rehman
*   Yan Sidoryk
*   Henry Lewis

---
*Disclaimer: This application provides financial information, not professional financial advice.*
