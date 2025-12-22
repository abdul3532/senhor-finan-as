import logging
import os
import uuid
from dotenv import load_dotenv
from db.client import supabase

# Load env
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_schema():
    if not supabase:
        logger.error("Supabase not connected.")
        return

    logger.info("Attempting to insert test row with 'impact_reason' and 'related_sources'...")
    
    test_data = {
        "url": f"https://test-schema-{uuid.uuid4()}.com",
        "headline": "Schema Test",
        "summary": "Testing schema columns",
        "source": "Debug",
        "sentiment_score": 50,
        "risk_level": "low",
        "impact_level": "neutral",
        # New columns to test
        "impact_reason": "Testing column existence",
        "related_sources": ["http://test.com"]
    }
    
    try:
        res = supabase.table("news_articles").upsert(test_data, on_conflict="url").execute()
        logger.info("SUCCESS: Columns exist! Row inserted.")
        # Cleanup
        if res.data:
            id_ = res.data[0]['id']
            supabase.table("news_articles").delete().eq("id", id_).execute()
            logger.info("Cleanup complete.")
            
    except Exception as e:
        logger.error(f"FAILURE: Insert failed. Likely missing columns. Error: {e}")

if __name__ == "__main__":
    check_schema()
