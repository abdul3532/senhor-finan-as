from fastapi import APIRouter, HTTPException
import yfinance as yf
import logging

router = APIRouter(prefix="/api/quote", tags=["quote"])
logger = logging.getLogger(__name__)

@router.get("/{ticker}")
async def get_quote(ticker: str):
    """Get real-time quote for a ticker"""
    try:
        ticker = ticker.upper()
        stock = yf.Ticker(ticker)
        
        # Helper to get value from fast_info safely (supports both attr and dict access)
        def get_fast_val(key_attr, key_dict=None):
            val = None
            try:
                val = getattr(stock.fast_info, key_attr, None)
            except:
                pass
            if val is None and key_dict:
                val = stock.fast_info.get(key_dict)
            return val

        # 1. Get Price
        price = get_fast_val('last_price', 'last_price')
        
        # Fallback to regular info
        if not price:
            info = stock.info
            price = info.get('currentPrice') or info.get('regularMarketPrice')

        if not price:
             raise HTTPException(status_code=404, detail="Price not found")

        change = 0.0
        change_percent = 0.0
        
        # 2. Get Previous Close
        prev_close = get_fast_val('previous_close', 'previous_close')
        if not prev_close:
             prev_close = get_fast_val('previousClose', 'previousClose')
        
        # Fallback to regular info for prev close
        if not prev_close:
             info = stock.info # Access only if needed to avoid overhead if possible
             prev_close = info.get('regularMarketPreviousClose') or info.get('previousClose')

        if prev_close:
            change = price - prev_close
            change_percent = (change / prev_close) * 100

        return {
            "ticker": ticker,
            "price": price,
            "change": change,
            "change_percent": change_percent,
            "currency": stock.fast_info.get('currency', 'USD')
        }
    except Exception as e:
        logger.error(f"Error fetching quote for {ticker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
