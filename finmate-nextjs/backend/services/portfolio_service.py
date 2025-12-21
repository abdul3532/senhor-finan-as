import json
import os
import logging
import yfinance as yf
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

DATA_DIR = "data"
PORTFOLIO_FILE = os.path.join(DATA_DIR, "portfolio.json")
PROFILES_FILE = os.path.join(DATA_DIR, "profiles.json")

def ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

# --- Portfolio Tickers ---

def load_portfolio() -> List[str]:
    ensure_data_dir()
    if not os.path.exists(PORTFOLIO_FILE):
        return []
    try:
        with open(PORTFOLIO_FILE, "r") as f:
            data = json.load(f)
            return data.get("tickers", [])
    except json.JSONDecodeError:
        return []

def save_portfolio(tickers: List[str]):
    ensure_data_dir()
    with open(PORTFOLIO_FILE, "w") as f:
        json.dump({"tickers": tickers}, f)

# --- Company Profiles ---

def load_profiles() -> Dict[str, Any]:
    ensure_data_dir()
    if not os.path.exists(PROFILES_FILE):
        return {}
    try:
        with open(PROFILES_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}

def save_profiles(profiles: Dict[str, Any]):
    ensure_data_dir()
    with open(PROFILES_FILE, "w") as f:
        json.dump(profiles, f)

def fetch_company_profile(ticker: str) -> Dict[str, Any]:
    """Fetch company details using yfinance"""
    try:
        logger.info(f"Fetching profile for {ticker}...")
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Extract relevant fields
        profile = {
            "name": info.get("longName", ticker),
            "sector": info.get("sector", "Unknown"),
            "industry": info.get("industry", "Unknown"),
            "summary": info.get("longBusinessSummary", "No summary available."),
            "currency": info.get("currency", "USD"),
            "website": info.get("website", "")
        }
        return profile
    except Exception as e:
        logger.error(f"Failed to fetch profile for {ticker}: {e}")
        return {
            "name": ticker,
            "sector": "Unknown",
            "industry": "Unknown",
            "summary": "Could not fetch profile data."
        }

# --- Actions ---

def add_ticker(ticker: str) -> List[str]:
    ticker = ticker.upper()
    tickers = load_portfolio()
    
    if ticker not in tickers:
        # 1. Add to list
        tickers.append(ticker)
        save_portfolio(tickers)
        
        # 2. Fetch and save profile
        profiles = load_profiles()
        profile_data = fetch_company_profile(ticker)
        profiles[ticker] = profile_data
        save_profiles(profiles)
        
    return tickers

def remove_ticker(ticker: str) -> List[str]:
    ticker = ticker.upper()
    tickers = load_portfolio()
    
    if ticker in tickers:
        # 1. Remove from list
        tickers.remove(ticker)
        save_portfolio(tickers)
        
        # 2. Remove profile (optional, but keeps clean)
        profiles = load_profiles()
        if ticker in profiles:
            del profiles[ticker]
            save_profiles(profiles)
            
    return tickers
