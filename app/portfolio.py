import json
import os
from typing import List

DATA_DIR = "data"
PORTFOLIO_FILE = os.path.join(DATA_DIR, "portfolio.json")

def ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

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

def add_ticker(ticker: str):
    tickers = load_portfolio()
    if ticker not in tickers:
        tickers.append(ticker)
        save_portfolio(tickers)

def remove_ticker(ticker: str):
    tickers = load_portfolio()
    if ticker in tickers:
        tickers.remove(ticker)
        save_portfolio(tickers)
