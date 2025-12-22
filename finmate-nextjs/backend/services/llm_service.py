import os
import json
import logging
from typing import List, Dict, Any
from openai import OpenAI
from duckduckgo_search import DDGS

logger = logging.getLogger(__name__)

# Configure OpenAI
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

MODEL_NAME = "gpt-4o" 

def search_web(query: str, max_results: int = 3) -> str:
    """Perform a web search to verify news or get context"""
    try:
        logger.info(f"Searching web for: {query}")
        # Use simple text search which is often more robust for verification queries
        with DDGS() as ddgs:
            # Try/except specific to DDG library quirk
            try:
                results = list(ddgs.news(query, max_results=max_results))
            except Exception as inner_e:
                logger.warning(f"DDGS News search error: {inner_e}. Retrying with text search.")
                results = list(ddgs.text(query, max_results=max_results))

        if not results:
            return "No search results found to verify this news."
            
        formatted_results = "Search Results for Verification:\n"
        for i, r in enumerate(results, 1):
            # Handle different key names between news/text results
            link = r.get('url') or r.get('href', 'No link')
            snippet = r.get('body') or r.get('snippet', '')
            formatted_results += f"{i}. {r.get('title')} ({link})\n   {snippet}\n"
        return formatted_results
    except Exception as e:
        logger.warning(f"Web search failed: {e}")
        return "Web search verification unavailable due to technical error."

def analyze_news(news_item: Dict, portfolio: List[str]) -> Dict[str, Any]:
    """
    Analyzes a news item against the user's portfolio using OpenAI.
    Performs a real-time web search to cross-reference and verify the news.
    """
    logger.info(f"Analyzing news: {news_item.get('title')}")

    # 1. Cross-Reference / Verify with Web Search
    # Search for the specific title to find other sources
    search_context = search_web(news_item.get('title', ''), max_results=3)

    prompt = f"""
    You are a financial analyst. Analyze the following news article and determine its impact on the user's portfolio.
    
    Portfolio Tickers: {', '.join(portfolio)}
    
    Target News Item:
    Title: {news_item.get('title')}
    Summary: {news_item.get('summary')}
    Source: {news_item.get('source')}
    Link: {news_item.get('link')}
    
    {search_context}
    
    CRITICAL INSTRUCTION:
    - Use the 'Search Results' to verify the news and find 'related_sources'.
    - If the search results show this is old news, note that (though we try to fetch fresh).
    - Infer impact on portfolio tickers even if not explicitly named.
    
    Return a JSON object with the following schema:
    {{
        "headline": "Short, punchy headline",
        "summary": "Concise summary of the event (incorporating verification details if useful)",
        "sentiment_score": 0-10 (integer, 0=catastrophic, 5=neutral, 10=euphoric),
        "category": "Markets | Macro | Equities | Energy | Tech",
        "affected_tickers": ["TICKER1", "TICKER2"],
        "impact": "positive | neutral | negative",
        "impact_reason": "Explanation of why it impacts the portfolio or specific tickers",
        "risk_level": "low | medium | high",
        "related_sources": ["url1", "url2"] (URLs found in search results that corroborate the story)
    }}
    """

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful financial analyst. Responds in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        logger.error(f"LLM Analysis failed: {e}")
        # Fallback
        found_tickers = []
        text_content = (news_item.get('title', '') + " " + news_item.get('summary', '')).upper()
        for ticker in portfolio:
            if ticker.upper() in text_content: found_tickers.append(ticker)
        
        return {
            "headline": news_item.get('title'),
            "summary": f"AI Analysis Unavailable. Content: {news_item.get('summary')[:100]}...",
            "sentiment_score": 5, "category": "General", "affected_tickers": found_tickers,
            "impact": "neutral", "impact_reason": "AI analysis failed.", "risk_level": "low", 
            "related_sources": []
        }

def chat_with_data(query: str, context: str) -> str:
    """
    Chat with the AI. Includes web search capability if needed.
    """
    
    # Simple keyword check to see if we should search
    # (In a real agent, we'd look for function calling, but keeping it simple here)
    use_search = any(kw in query.lower() for kw in ['latest', 'current', 'today', 'price', 'news', 'search'])
    
    search_results = ""
    if use_search:
        search_results = search_web(query, max_results=3)
    
    prompt = f"""
    You are Senhor Finanças, an expert financial assistant.
    
    Context (News, Portfolio, Documents):
    {context}
    
    {search_results}
    
    User Query: {query}
    
    Instructions:
    - Answer the user's question.
    - If search results are provided, prioritize them for "latest" info.
    - Be concise, professional, and helpful.
    """
    
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        return response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        return f"I encountered an error. Details: {str(e)}"
