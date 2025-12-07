from fastapi import APIRouter, HTTPException
from models import Portfolio, AddTickerRequest
from services import portfolio_service

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

@router.get("", response_model=Portfolio)
async def get_portfolio():
    """Get all tickers in the portfolio"""
    tickers = portfolio_service.load_portfolio()
    return Portfolio(tickers=tickers)

@router.post("", response_model=Portfolio)
async def add_ticker(request: AddTickerRequest):
    """Add a ticker to the portfolio"""
    try:
        tickers = portfolio_service.add_ticker(request.ticker)
        return Portfolio(tickers=tickers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{ticker}", response_model=Portfolio)
async def remove_ticker(ticker: str):
    """Remove a ticker from the portfolio"""
    try:
        tickers = portfolio_service.remove_ticker(ticker)
        return Portfolio(tickers=tickers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
