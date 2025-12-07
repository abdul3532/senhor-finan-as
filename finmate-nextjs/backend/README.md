# FinMate Backend API

FastAPI backend for FinMate - AI-Powered Portfolio News Intelligence

## Setup

1. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables:**
```bash
# Copy .env.example to .env and fill in your API keys
copy .env.example .env
```

4. **Run the server:**
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Portfolio
- `GET /api/portfolio` - Get all tickers
- `POST /api/portfolio` - Add a ticker
- `DELETE /api/portfolio/{ticker}` - Remove a ticker

### News
- `GET /api/news` - Get cached analyzed news
- `POST /api/news/refresh` - Fetch and analyze fresh news

### Chat
- `POST /api/chat` - Chat with AI assistant
- `POST /api/chat/upload-document` - Upload PDF document

### Reports
- `POST /api/reports/generate` - Generate PDF briefing

## Development

The backend is structured as follows:
```
backend/
├── main.py              # FastAPI app entry point
├── api/                 # API route handlers
├── services/            # Business logic
├── models/              # Pydantic models
└── data/                # Local data storage
```
