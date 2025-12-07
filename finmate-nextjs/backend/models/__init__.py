# Backend Models
from pydantic import BaseModel
from typing import List, Optional

class Portfolio(BaseModel):
    tickers: List[str]

class AddTickerRequest(BaseModel):
    ticker: str

class NewsItem(BaseModel):
    id: Optional[str] = None
    headline: str
    summary: str
    sentiment_score: int
    category: str
    affected_tickers: List[str]
    impact: str  # "positive" | "neutral" | "negative"
    impact_reason: str
    risk_level: str  # "low" | "medium" | "high"
    link: str
    published: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    query: str
    portfolio: Optional[List[str]] = None
    news_context: Optional[List[NewsItem]] = None
    document_context: Optional[str] = None
