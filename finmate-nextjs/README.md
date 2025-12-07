# FinMate Next.js Migration

This is an **experimental** migration of FinMate from Streamlit to a modern Next.js + TypeScript + Tailwind CSS stack.

> **Note:** This is a separate project and does not affect your original Streamlit application in the parent directory.

## Project Structure

```
finmate-nextjs/
├── backend/          # FastAPI backend
│   ├── api/          # API route handlers
│   ├── services/     # Business logic (migrated from original app)
│   ├── models/       # Pydantic models
│   ├── data/         # Local data storage
│   ├── main.py       # FastAPI app entry point
│   └── requirements.txt
│
└── frontend/         # Vite + React + TypeScript
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── lib/
    │   └── App.tsx
    ├── tailwind.config.js
    └── package.json
```

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy your .env file with API keys
# Make sure it has: GEMINI_API_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_PUBLIC_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Features

### ✅ Migrated from Original App
- Portfolio management (add/remove tickers)
- News scraping from CNBC RSS
- AI-powered news analysis with Gemini
- Semantic ticker matching
- PDF briefing generation
- AI chat assistant
- Document upload and analysis

### ✨ New in Next.js Version
- Modern, responsive UI with Tailwind CSS
- Real-time updates with TanStack Query
- Better error handling and loading states
- Improved navigation with React Router
- Type-safe API with TypeScript
- Component-based architecture

## Comparison with Original

| Feature | Streamlit (Original) | Next.js (New) |
|---------|---------------------|---------------|
| **UI Framework** | Streamlit | React + Tailwind CSS |
| **Language** | Python | TypeScript + Python (backend) |
| **State Management** | Session state | TanStack Query |
| **Routing** | Tabs | React Router |
| **API** | Embedded | Separate FastAPI |
| **Styling** | Streamlit defaults | Custom Tailwind theme |
| **Performance** | Page reloads | SPA with caching |

## Testing the Migration

1. **Start both servers** (backend on :8000, frontend on :5173)
2. **Add tickers** in Portfolio page
3. **Refresh news** in Dashboard
4. **Chat with AI** in AI Assistant page
5. **Upload documents** for analysis
6. **Generate PDF** briefing

## API Endpoints

- `GET /api/portfolio` - Get portfolio tickers
- `POST /api/portfolio` - Add ticker
- `DELETE /api/portfolio/{ticker}` - Remove ticker
- `GET /api/news` - Get cached news
- `POST /api/news/refresh` - Fetch fresh news
- `POST /api/chat` - Chat with AI
- `POST /api/chat/upload-document` - Upload PDF
- `POST /api/reports/generate` - Generate PDF report

## Next Steps

If you like this version:
1. Test all features thoroughly
2. Compare performance with Streamlit version
3. Decide whether to switch or keep both
4. Consider deploying (Vercel for frontend, Railway/Render for backend)

If you prefer the original:
- This directory can be safely deleted
- Your original app is untouched in the parent directory

## Troubleshooting

**Backend won't start:**
- Check if port 8000 is available
- Verify .env file has all required API keys
- Make sure virtual environment is activated

**Frontend won't start:**
- Check if port 5173 is available
- Run `npm install` again
- Clear node_modules and reinstall if needed

**API connection errors:**
- Ensure backend is running on port 8000
- Check CORS settings in backend/main.py
- Verify API_BASE URL in frontend/src/lib/api.ts

## License

Same as original FinMate project.
