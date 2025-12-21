
import os
import json
import logging
from typing import List, Dict, Any
from openai import OpenAI
# Removed native tool import as we are using OpenAI Builtin or Fallback

logger = logging.getLogger(__name__)

# Configure OpenAI
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

MODEL_NAME = "gpt-4o" 

def analyze_news(news_item: Dict, portfolio: List[str]) -> Dict[str, Any]:
    """
    Analyzes a news item against the user's portfolio using OpenAI.
    Attempts to use the native 'web_search' tool via client.responses.
    Falls back to standard chat completion if unavailable.
    """
    logger.info(f"Analyzing news with model: {MODEL_NAME}")

    prompt = f"""
    You are a financial analyst. Analyze the following news article and determine its impact on the user's portfolio.
    
    Portfolio Tickers: {', '.join(portfolio)}
    
    News Title: {news_item.get('title')}
    News Summary: {news_item.get('summary')}
    News Link: {news_item.get('link')}
    
    CRITICAL INSTRUCTION:
    - You must infer if the news affects a company in the portfolio even if the ticker is not explicitly mentioned.
    - If the news is about a competitor or the sector, it may also be relevant.
    
    Return a JSON object with the following schema:
    {{
        "headline": "Short, punchy headline",
        "summary": "Concise summary of the event",
        "sentiment_score": 0-10 (integer, 0=catastrophic, 5=neutral, 10=euphoric),
        "category": "Markets | Macro | Equities | Energy | Tech",
        "affected_tickers": ["TICKER1", "TICKER2"],
        "impact": "positive | neutral | negative",
        "impact_reason": "Explanation of why it impacts the portfolio or specific tickers",
        "risk_level": "low | medium | high",
        "related_sources": ["url1", "url2"]
    }}
    
    CRITICAL SCORING INSTRUCTION:
    - BE CRITICAL. Use full 0-10 range.
    """

    # 1. Try Native Responses API (Web Search)
    try:
        # Check if attribute exists dynamically to avoid runtime crash on older SDKs
        if hasattr(client, 'responses'):
            logger.info("Attempting OpenAI Built-in Web Search...")
            response = client.responses.create(
                model=MODEL_NAME,
                input=[
                    {"role": "system", "content": "You are a helpful financial analyst. Use web_search to verify news."},
                    {"role": "user", "content": prompt}
                ],
                tools=[{"type": "web_search"}],
                response_format={"type": "json_object"},
                temperature=0.2
            )
            # The Responses API returns .output_text instead of choices
            return json.loads(response.output_text)

    except Exception as e:
        logger.warning(f"Native Web Search failed or unavailable: {e}. Falling back to standard model.")
    
    # 2. Fallback: Standard Chat Completion (No Web Search)
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful financial analyst. You always respond in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        logger.error(f"LLM Analysis failed: {e}")
        # Fallback to keyword matching
        found_tickers = []
        text_content = (news_item.get('title', '') + " " + news_item.get('summary', '')).upper()
        for ticker in portfolio:
            if ticker.upper() in text_content: found_tickers.append(ticker)
        
        return {
            "headline": news_item.get('title'),
            "summary": f"AI Analysis Unavailable. Content: {news_item.get('summary')[:100]}...",
            "sentiment_score": 5, "category": "General", "affected_tickers": found_tickers,
            "impact": "neutral", "impact_reason": "AI analysis failed.", "risk_level": "low", "related_sources": []
        }

def chat_with_data(query: str, context: str) -> str:
    """
    Chat with the AI using provided context (news + portfolio + documents).
    Attempts to use Native Search if requested.
    """
    prompt = f"""
    You are Senhor Finanças, an expert financial assistant.
    
    Context (News, Portfolio, Documents):
    {context}
    
    User Query: {query}
    
    Instructions:
    - Answer the user's question based on context.
    - If the user asks for current info not in context (e.g. stock price, latest news), USE THE web_search TOOL.
    - Be concise, professional, and helpful.
    """
    
    # 1. Try Native Responses API (Web Search)
    try:
        if hasattr(client, 'responses'):
            response = client.responses.create(
                model=MODEL_NAME,
                input=[
                    {"role": "system", "content": "You are a helpful financial assistant."},
                    {"role": "user", "content": prompt}
                ],
                tools=[{"type": "web_search"}],
                temperature=0.5
            )
            return response.output_text

    except Exception as e:
        logger.warning(f"Chat Native Web Search failed: {e}")

    # 2. Fallback to Standard Chat
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
        return f"I encountered an error while communicating with the AI service. \n\nError details: {str(e)}"

