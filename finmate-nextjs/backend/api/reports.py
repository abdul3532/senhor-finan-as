from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from typing import List
from models import NewsItem
from services import reporting_service, portfolio_service

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.post("/generate")
async def generate_report(news_items: List[NewsItem]):
    """Generate a PDF briefing report"""
    try:
        portfolio = portfolio_service.load_portfolio()
        
        # Convert NewsItem models to dicts for reporting service
        news_dicts = [item.dict() for item in news_items]
        
        # Generate PDF
        pdf_bytes = reporting_service.generate_briefing(news_dicts, portfolio)
        
        # Return PDF as response
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=senhor_financas_briefing.pdf"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")
