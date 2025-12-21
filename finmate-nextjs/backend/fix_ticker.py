from services import portfolio_service
import logging

logging.basicConfig(level=logging.INFO)

def fix_apple_ticker():
    print("Fixing APPLE -> AAPL...")
    portfolio = portfolio_service.load_portfolio()
    
    if "APPLE" in portfolio:
        # Remove APPLE
        portfolio.remove("APPLE")
        # Add AAPL
        if "AAPL" not in portfolio:
            portfolio.append("AAPL")
        
        portfolio_service.save_portfolio(portfolio)
        print("Updated portfolio.json: Replaced APPLE with AAPL")
        
        # Now fetch profile for AAPL
        profiles = portfolio_service.load_profiles()
        if "APPLE" in profiles:
            del profiles["APPLE"]
            
        print("Fetching profile for AAPL...")
        profile = portfolio_service.fetch_company_profile("AAPL")
        profiles["AAPL"] = profile
        
        portfolio_service.save_profiles(profiles)
        print("Updated profiles.json with AAPL data")
        
    else:
        print("APPLE ticker not found in portfolio.")

if __name__ == "__main__":
    fix_apple_ticker()
