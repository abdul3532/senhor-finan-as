import feedparser
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

RSS_URL = "https://www.cnbc.com/id/15839069/device/rss/rss.html"

def fetch_news() -> List[Dict]:
    """
    Fetches news from the configured RSS feed.
    Returns a list of dictionaries with title, link, summary, published.
    """
    try:
        feed = feedparser.parse(RSS_URL)
        news_items = []
        
        if feed.bozo:
            logger.warning(f"Error parsing feed: {feed.bozo_exception}")
        
        for entry in feed.entries[:20]: # Limit to 20 items
            item = {
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "summary": entry.get("summary", "") or entry.get("description", ""),
                "published": entry.get("published", "") or entry.get("updated", "")
            }
            news_items.append(item)
            
        return news_items
    except Exception as e:
        logger.error(f"Failed to fetch news: {e}")
        return []
