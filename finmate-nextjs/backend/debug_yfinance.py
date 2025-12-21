import yfinance as yf
import logging

logging.basicConfig(level=logging.INFO)

def test_fetch_pltr():
    ticker = "PLTR"
    print(f"Testing yfinance for {ticker}...")
    try:
        stock = yf.Ticker(ticker)
        # Force fetch
        info = stock.info
        print("\n--- INFO KEYS ---")
        print(list(info.keys()))
        print("\n--- NAME ---")
        print(info.get('longName'))
        print("\n--- SUMMARY ---")
        print(info.get('longBusinessSummary')[:100] if info.get('longBusinessSummary') else "None")
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")

if __name__ == "__main__":
    test_fetch_pltr()
