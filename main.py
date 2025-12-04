import streamlit as st
import pandas as pd
from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader
from app import portfolio, scraper, llm_service, reporting, utils

# Load environment variables
load_dotenv()
utils.setup_logging()

st.set_page_config(
    page_title="FinMate",
    page_icon="📈",
    layout="wide"
)

# Initialize Session State
if "news_data" not in st.session_state:
    st.session_state.news_data = []
if "analyzed_news" not in st.session_state:
    st.session_state.analyzed_news = []
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "document_context" not in st.session_state:
    st.session_state.document_context = ""

st.title("FinMate — AI-Powered Portfolio News Intelligence")

# --- Sidebar: Portfolio & Tools ---
with st.sidebar:
    st.header("💼 Portfolio Manager")
    new_ticker = st.text_input("Add Ticker (e.g., AAPL, EDP)")
    if st.button("Add"):
        if new_ticker:
            portfolio.add_ticker(new_ticker.upper())
            st.rerun()

    current_portfolio = portfolio.load_portfolio()
    st.subheader("Your Holdings")
    for ticker in current_portfolio:
        col1, col2 = st.columns([3, 1])
        col1.write(ticker)
        if col2.button("❌", key=f"del_{ticker}"):
            portfolio.remove_ticker(ticker)
            st.rerun()
            
    st.divider()
    st.header("📄 Document Upload")
    uploaded_file = st.file_uploader("Upload PDF (Earnings, Research)", type="pdf")
    if uploaded_file:
        if st.button("Analyze & Add to Context"):
            with st.spinner("Processing Document..."):
                try:
                    reader = PdfReader(uploaded_file)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text()
                    
                    # Store in session state for chat context
                    st.session_state.document_context = f"Document '{uploaded_file.name}' Content:\n{text[:10000]}..." # Limit context
                    
                    # Also analyze as a news item
                    doc_item = {
                        "title": uploaded_file.name,
                        "summary": text[:5000],
                        "link": "Uploaded Document"
                    }
                    analysis = llm_service.analyze_news(doc_item, current_portfolio)
                    st.success("Document added to Assistant context!")
                    with st.expander("Document Analysis"):
                        st.json(analysis)
                except Exception as e:
                    st.error(f"Error reading PDF: {e}")

# --- Main Tabs ---
tab1, tab2 = st.tabs(["📰 News Dashboard", "🤖 AI Assistant"])

# --- Tab 1: News Dashboard ---
with tab1:
    col1, col2 = st.columns([1, 5])
    if col1.button("🔄 Refresh News"):
        with st.spinner("Fetching CNBC News..."):
            raw_news = scraper.fetch_news()
            analyzed = []
            progress_bar = st.progress(0)
            for i, item in enumerate(raw_news):
                analysis = llm_service.analyze_news(item, current_portfolio)
                full_item = {**item, **analysis}
                analyzed.append(full_item)
                progress_bar.progress((i + 1) / len(raw_news))
            
            st.session_state.analyzed_news = analyzed
            st.success(f"Analyzed {len(analyzed)} articles.")

    if st.session_state.analyzed_news:
        if col2.button("📄 Generate Daily Briefing (PDF)"):
            pdf_bytes = reporting.generate_briefing(st.session_state.analyzed_news, current_portfolio)
            st.download_button(
                label="Download PDF",
                data=pdf_bytes,
                file_name="finmate_briefing.pdf",
                mime="application/pdf"
            )

        # Display News
        for item in st.session_state.analyzed_news:
            with st.expander(f"{item.get('headline')} ({item.get('sentiment_score')}/100)"):
                c1, c2 = st.columns([3, 1])
                with c1:
                    st.write(f"**Summary:** {item.get('summary')}")
                    st.write(f"**Impact:** {item.get('impact_reason')}")
                    st.caption(f"Source: {item.get('link')}")
                with c2:
                    st.metric("Sentiment", item.get('sentiment_score'))
                    st.metric("Risk Level", item.get('risk_level').upper())
                    if item.get('affected_tickers'):
                        st.write(f"**Affected:** {', '.join(item.get('affected_tickers'))}")

# --- Tab 2: AI Assistant (Unified) ---
with tab2:
    st.header("Financial Assistant")
    st.caption("Ask about your portfolio, market news, or uploaded documents.")
    
    # Display chat messages
    for message in st.session_state.chat_history:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Ask FinMate..."):
        # Add user message
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                # Prepare context
                context = f"Portfolio: {current_portfolio}\n\n"
                
                if st.session_state.analyzed_news:
                    context += "Latest News Analysis:\n"
                    for n in st.session_state.analyzed_news:
                        context += f"- {n.get('headline')} (Impact: {n.get('impact')}, Reason: {n.get('impact_reason')})\n"
                
                if st.session_state.document_context:
                    context += f"\nUploaded Document Context:\n{st.session_state.document_context}\n"
                
                response = llm_service.chat_with_data(prompt, context)
                st.markdown(response)
        
        # Add assistant response
        st.session_state.chat_history.append({"role": "assistant", "content": response})
