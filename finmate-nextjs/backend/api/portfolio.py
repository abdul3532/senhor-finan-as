from fastapi import APIRouter, HTTPException
from models import Portfolio, AddTickerRequest
from services import portfolio_service

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

@router.get("", response_model=Portfolio)
async def get_portfolio():
    """Get all tickers and profiles in the portfolio"""
    tickers = portfolio_service.load_portfolio()
    profiles = portfolio_service.load_profiles()
    return Portfolio(tickers=tickers, profiles=profiles)

@router.post("", response_model=Portfolio)
async def add_ticker(request: AddTickerRequest):
    """Add a ticker to the portfolio"""
    try:
        tickers, new_profile = portfolio_service.add_ticker(request.ticker)
        
        # Load existing profiles
        profiles = portfolio_service.load_profiles()
        
        # Ensure new profile is included (even if DB sync lagged)
        if new_profile:
            profiles[request.ticker.upper()] = new_profile
            
        return Portfolio(tickers=tickers, profiles=profiles)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{ticker}", response_model=Portfolio)
async def remove_ticker(ticker: str):
    """Remove a ticker from the portfolio"""
    try:
        portfolio_service.remove_ticker(ticker)
        # Reload full state
        tickers = portfolio_service.load_portfolio()
        profiles = portfolio_service.load_profiles()
        return Portfolio(tickers=tickers, profiles=profiles)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
