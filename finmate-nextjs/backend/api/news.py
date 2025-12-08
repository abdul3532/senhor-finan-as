from fastapi import APIRouter, HTTPException
from typing import List
from models import NewsItem
from services import news_service, llm_service, portfolio_service
import uuid

router = APIRouter(prefix="/api/news", tags=["news"])

# In-memory cache for analyzed news
_news_cache: List[NewsItem] = []

@router.get("", response_model=List[NewsItem])
async def get_news():
    """Get cached analyzed news"""
    return _news_cache

@router.post("/refresh", response_model=List[NewsItem])
async def refresh_news():
    """Fetch fresh news and analyze against portfolio"""
    global _news_cache
    
    try:
        # Get portfolio
        portfolio = portfolio_service.load_portfolio()
        
        # Fetch raw news
        raw_news = news_service.fetch_news()
        
        # Analyze each news item
        analyzed_news = []
        for item in raw_news:
            analysis = llm_service.analyze_news(item, portfolio)
            
            # Combine raw news with analysis
            news_item = NewsItem(
                id=str(uuid.uuid4()),
                headline=analysis.get('headline', item['title']),
                summary=analysis.get('summary', item['summary']),
                sentiment_score=analysis.get('sentiment_score', 50),
                category=analysis.get('category', 'Unknown'),
                affected_tickers=analysis.get('affected_tickers', []),
                impact=analysis.get('impact', 'neutral'),
                impact_reason=analysis.get('impact_reason', ''),
                risk_level=analysis.get('risk_level', 'low'),
                link=item['link'],
                published=item.get('published')
            )
            analyzed_news.append(news_item)
        
        # Update cache
        _news_cache = analyzed_news
        
        return analyzed_news
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refresh news: {str(e)}")

@router.get("/{news_id}", response_model=NewsItem)
async def get_news_item(news_id: str):
    """Get a specific news item by ID"""
    for item in _news_cache:
        if item.id == news_id:
            return item
    raise HTTPException(status_code=404, detail="News item not found")
