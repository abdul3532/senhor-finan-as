// API Types
export interface Portfolio {
    tickers: string[];
}

export interface NewsItem {
    id: string;
    headline: string;
    summary: string;
    sentiment_score: number;
    category: string;
    affected_tickers: string[];
    impact: "positive" | "neutral" | "negative";
    impact_reason: string;
    risk_level: "low" | "medium" | "high";
    link: string;
    published?: string;
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export interface ChatRequest {
    query: string;
    portfolio?: string[];
    news_context?: NewsItem[];
    document_context?: string;
}

export interface DocumentUploadResponse {
    filename: string;
    text: string;
    message: string;
}
