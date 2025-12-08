import os
import json
import google.generativeai as genai
# from langfuse.decorators import observe  # Temporarily disabled
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Generation Config for JSON output
generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=generation_config,
)

chat_model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
)

# @observe()  # Temporarily disabled
def analyze_news(news_item: Dict, portfolio: List[str]) -> Dict[str, Any]:
    """
    Analyzes a news item against the user's portfolio.
    """
    logger.info(f"Analyzing news with model: {model.model_name}")

    prompt = f"""
    You are a financial analyst. Analyze the following news article and determine its impact on the user's portfolio.
    
    Portfolio Tickers: {', '.join(portfolio)}
    
    News Title: {news_item.get('title')}
    News Summary: {news_item.get('summary')}
    News Link: {news_item.get('link')}
    
    CRITICAL INSTRUCTION:
    - You must infer if the news affects a company in the portfolio even if the ticker is not explicitly mentioned (e.g., "Apple" -> "AAPL", "Google" -> "GOOGL").
    - If the news is about a competitor or the sector, it may also be relevant.
    
    Return a JSON object with the following schema:
    {{
        "headline": "Short, punchy headline",
        "summary": "Concise summary of the event",
        "sentiment_score": 0-100 (integer, 0=very negative, 100=very positive),
        "category": "Markets | Macro | Equities | Energy | Tech",
        "affected_tickers": ["TICKER1", "TICKER2"],
        "impact": "positive | neutral | negative",
        "impact_reason": "Explanation of why it impacts the portfolio or specific tickers",
        "risk_level": "low | medium | high"
    }}
    
    If no specific tickers from the portfolio are affected, but it's a general market event, note that.
    """
    
    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"LLM Analysis failed: {e}")
        
        # Fallback: Simple keyword matching
        found_tickers = []
        text_content = (news_item.get('title', '') + " " + news_item.get('summary', '')).upper()
        
        for ticker in portfolio:
            if ticker.upper() in text_content:
                found_tickers.append(ticker)
        
        return {
            "headline": news_item.get('title'),
            "summary": f"AI Analysis Unavailable (Rate Limit). Content: {news_item.get('summary')[:100]}...",
            "sentiment_score": 50,
            "category": "General",
            "affected_tickers": found_tickers,
            "impact": "neutral",
            "impact_reason": "AI rate limit exceeded - basic keyword match only.",
            "risk_level": "low"
        }

# @observe()  # Temporarily disabled
def chat_with_data(query: str, context: str) -> str:
    """
    Chat with the AI using provided context (news + portfolio + documents).
    """
    prompt = f"""
    You are Senhor Finanças, an expert financial assistant.
    
    Context (News, Portfolio, Documents):
    {context}
    
    User Query: {query}
    
    Instructions:
    - Answer the user's question based strictly on the context provided.
    - If the context contains news or document analysis, cite it.
    - Be concise, professional, and helpful.
    - If the answer is not in the context, say so, but offer general financial knowledge if appropriate (with a disclaimer).
    """
    
    try:
        response = chat_model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        return f"I encountered an error while communicating with the AI service. \n\nError details: {str(e)}\n\nThis is likely due to the Gemini API free tier rate limits. Please wait a minute and try again."
