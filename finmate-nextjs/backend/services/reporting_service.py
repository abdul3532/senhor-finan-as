from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from typing import List, Dict
import datetime

def generate_briefing(news_data: List[Dict], portfolio: List[str]) -> bytes:
    """
    Generates a PDF briefing.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = styles['Title']
    story.append(Paragraph(f"Senhor Finanças Daily Briefing - {datetime.date.today()}", title_style))
    story.append(Spacer(1, 12))

    # Portfolio Summary
    story.append(Paragraph("Portfolio Overview", styles['Heading2']))
    story.append(Paragraph(f"Tracking: {', '.join(portfolio)}", styles['Normal']))
    story.append(Spacer(1, 12))

    # News Analysis
    story.append(Paragraph("Market Insights", styles['Heading2']))
    
    for item in news_data:
        # Headline
        story.append(Paragraph(f"<b>{item.get('headline', 'No Title')}</b>", styles['Heading3']))
        
        # Details
        impact_color = "black"
        if item.get('impact') == 'positive':
            impact_color = "green"
        elif item.get('impact') == 'negative':
            impact_color = "red"
            
        details = f"""
        <b>Impact:</b> <font color='{impact_color}'>{item.get('impact', 'neutral').upper()}</font><br/>
        <b>Score:</b> {item.get('sentiment_score', 50)}/100<br/>
        <b>Reason:</b> {item.get('impact_reason', 'N/A')}
        """
        story.append(Paragraph(details, styles['Normal']))
        story.append(Spacer(1, 6))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
