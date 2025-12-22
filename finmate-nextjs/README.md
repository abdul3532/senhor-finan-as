# Senhor Finanças 🎩

**Advanced AI-Powered Financial Intelligence Platform**

> *Capstone Project 2025/2026 - NOVA IMS Bachelor’s Degree in Data Science*

## 📖 Project Overview
**Senhor Finanças** is an autonomous financial assistant designed to democratize professional-grade market intelligence. Unlike traditional portfolio trackers, it leverages **Agentic AI** to actively analyze news, verify facts across the web, and provide actionable insights for your specific portfolio holdings.

Users can interact with their financial data through natural language, generate professional PDF briefings, and receive real-time sentiment analysis on breaking news.

### Key Value Proposition
*   **Context-Aware AI:** The assistant knows your portfolio and tailors answers accordingly.
*   **Proactive Intelligence:** Autonomously scans news and flags impacts (Positive/Negative/Neutral).
*   **Trust & Verification:** Every AI claim is cross-referenced with live web search results.
*   **Professional Reporting:** One-click generation of executive-level PDF briefings.

---

## 🛠 Technology Stack

We chose a modern, scalable stack to ensure performance and maintainability:

### **Backend (Python / FastAPI)**
*   **Framework:** `FastAPI` for high-performance async endpoints.
*   **LLM Orchestration:** `OpenAI GPT-4o` managed via custom agent loops.
*   **Observability:** `Langfuse` for tracing agent thoughts and debugging costs.
*   **Data:** `Supabase` (PostgreSQL) for scalable persistence.
*   **PDF Generation:** `ReportLab` for programmatic document creation.

### **Frontend (React / TypeScript)**
*   **Framework:** `React` (Vite) for a responsive, client-side application.
*   **Styling:** `Tailwind CSS` + `Shadcn UI` for a premium, accessible design.
*   **State Management:** `TanStack Query` for robust server-state synchronization.

---

## 🚀 Key Features

1.  **Agentic Chat Interface**: Ask complex questions like *"How does the Apple news affect my tech stocks?"*. The AI will use tools to search the web, check stock prices, and analyze fundamentals before answering.
2.  **Smart News Feed**: A curated feed of financial news, automatically scored for sentiment and impact on *your* specific assets.
3.  **Interactive Dashboard**: Real-time view of your portfolio performance with AI-generated "Impact Previsions".
4.  **Executive Briefings**: Generate a downloadable PDF report summarizing the day's critical market movements tailored to you.

---

## 📦 Setup Instructions

### Prerequisites
*   Node.js v18+
*   Python 3.10+
*   Supabase Account
*   OpenAI API Key

### 1. Clone the Repository
```bash
git clone https://github.com/abdul3532/senhor-finan-as.git
cd senhor-finan-as/finmate-nextjs
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY
```

Run the server:
```bash
python main.py
```
*Backend runs on http://localhost:8000*

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Add VITE_API_URL=http://localhost:8000
```

Run the client:
```bash
npm run dev
```
*Frontend runs on http://localhost:5173*

---

## 🧪 AI Observability
We use **Langfuse** to monitor our AI Agent's performance. Traces include:
*   Tool usage (Web Search, Stock Price lookup).
*   LLM Latency and Token costs.
*   User feedback scores.

---

## 👥 Team
*   **Abdul** - Lead Developer & Architect
*   [Your Name] - [Your Role]

---
*Built with ❤️ for the NOVA IMS Data Science Capstone.*
