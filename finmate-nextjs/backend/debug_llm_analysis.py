import logging
import os
from dotenv import load_dotenv

# Load env before imports
load_dotenv()

from services import llm_service

# Setup logging
logging.basicConfig(level=logging.INFO)

# Fake news item
news_item = {
    "title": "Canada's GDP Growth Boosts Market Sentiment",
    "summary": "Canada's GDP rebound in the third quarter signals economic recovery...",
    "link": "https://example.com/news",
    "source": "Yahoo Finance"
}
portfolio = ["AAPL", "MSFT", "TSLA"]

print("--- Starting Debug Analysis ---")
try:
    result = llm_service.analyze_news(news_item, portfolio)
    print("\n--- Analysis Result ---")
    print(result)
except Exception as e:
    print(f"\n--- CRITICAL FAILURE ---")
    print(e)
