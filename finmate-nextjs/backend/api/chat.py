from fastapi import APIRouter, HTTPException, UploadFile, File
from models import ChatRequest, ChatMessage
from services import llm_service, portfolio_service
from PyPDF2 import PdfReader
from io import BytesIO

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("", response_model=ChatMessage)
async def chat(request: ChatRequest):
    """Chat with the AI assistant"""
    try:
        # Build context
        context = ""
        
        # Add portfolio context
        if request.portfolio:
            context += f"Portfolio: {', '.join(request.portfolio)}\n\n"
        else:
            portfolio = portfolio_service.load_portfolio()
            if portfolio:
                context += f"Portfolio: {', '.join(portfolio)}\n\n"
        
        # Add news context
        if request.news_context:
            context += "Latest News Analysis:\n"
            for news in request.news_context:
                context += f"- {news.headline} (Impact: {news.impact}, Reason: {news.impact_reason})\n"
            context += "\n"
        
        # Add document context
        if request.document_context:
            context += f"Uploaded Document Context:\n{request.document_context}\n\n"
        
        # Get response from LLM
        response_text = llm_service.chat_with_data(request.query, context)
        
        return ChatMessage(role="assistant", content=response_text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """Upload and extract text from a PDF document"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read PDF
        contents = await file.read()
        pdf_reader = PdfReader(BytesIO(contents))
        
        # Extract text
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        # Limit context size
        limited_text = text[:10000]
        
        return {
            "filename": file.filename,
            "text": limited_text,
            "message": f"Successfully extracted {len(text)} characters from {file.filename}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
