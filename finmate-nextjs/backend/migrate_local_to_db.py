import json
import os
import asyncio
from db.client import supabase
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_DIR = "data"
PORTFOLIO_FILE = os.path.join(DATA_DIR, "portfolio.json")
PROFILES_FILE = os.path.join(DATA_DIR, "profiles.json")

def load_json(filepath):
    if not os.path.exists(filepath):
        return {}
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading {filepath}: {e}")
        return {}

def migrate_portfolio():
    if not supabase:
        logger.error("Supabase client not initialized. Aborting.")
        return

    logger.info("Starting Portfolio Migration...")
    
    # 1. ensure a default portfolio exists
    res = supabase.table("portfolios").select("*").eq("name", "My Portfolio").execute()
    if not res.data:
        logger.info("Creating default portfolio...")
        res = supabase.table("portfolios").insert({"name": "My Portfolio"}).execute()
        portfolio_id = res.data[0]['id']
    else:
        logger.info("Default portfolio exists.")
        portfolio_id = res.data[0]['id']
    
    # 2. Load local tickers
    data = load_json(PORTFOLIO_FILE)
    tickers = data.get("tickers", [])
    
    if not tickers:
        logger.info("No local tickers to migrate.")
        return

    logger.info(f"Found tickers: {tickers}")
    
    # 3. Insert into portfolio_items
    for ticker in tickers:
        try:
            # Check if exists to avoid dupes (could use upsert if we had proper composite key handling on insert, but explicit check implies better logging)
            # Actually, we rely on the unique constraint in schema.sql (portfolio_id, ticker)
            # We will use upsert safely
            item = {
                "portfolio_id": portfolio_id,
                "ticker": ticker
            }
            supabase.table("portfolio_items").upsert(item, on_conflict="portfolio_id,ticker").execute()
            logger.info(f"Migrated ticker: {ticker}")
        except Exception as e:
            logger.error(f"Failed to migrate {ticker}: {e}")

    logger.info("Portfolio Migration Complete.")

def migrate_profiles():
    if not supabase:
        return

    logger.info("Starting Profile Migration...")
    profiles = load_json(PROFILES_FILE)
    
    if not profiles:
        logger.info("No local profiles to migrate.")
        return
        
    for ticker, data in profiles.items():
        try:
            # Map JSON fields to DB columns
            # JSON: { "name": ..., "sector": ..., "industry": ..., "summary": ..., "currency": ..., "website": ... }
            # DB: ticker, name, sector, industry, summary, website, currency
            
            row = {
                "ticker": ticker,
                "name": data.get("name"),
                "sector": data.get("sector"),
                "industry": data.get("industry"),
                "summary": data.get("summary"),
                "website": data.get("website"),
                "currency": data.get("currency")
            }
            
            supabase.table("company_profiles").upsert(row).execute()
            logger.info(f"Migrated profile for: {ticker}")
            
        except Exception as e:
            logger.error(f"Failed to migrate profile {ticker}: {e}")

    logger.info("Profile Migration Complete.")

if __name__ == "__main__":
    migrate_portfolio()
    migrate_profiles()
