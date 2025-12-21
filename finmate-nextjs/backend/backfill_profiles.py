from services import portfolio_service
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_backfill():
    print("Starting profile backfill...")
    tickers = portfolio_service.load_portfolio()
    print(f"Found tickers: {tickers}")
    
    profiles = portfolio_service.load_profiles()
    
    for ticker in tickers:
        print(f"Fetching profile for {ticker}...")
        # Handle the APPLE case manually if needed, or let yfinance try
        # Note: APPLE ticker usually doesn't exist, it's AAPL. 
        # But for now we just try to fetch what is there.
        
        data = portfolio_service.fetch_company_profile(ticker)
        profiles[ticker] = data
        print(f"Saved {ticker}: {data.get('name')}")
        
    portfolio_service.save_profiles(profiles)
    print("Backfill complete. Data saved to profiles.json")

if __name__ == "__main__":
    run_backfill()
