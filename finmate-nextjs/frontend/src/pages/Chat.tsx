import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePortfolio, useNews, useChat, useUploadDocument } from "@/lib/api";
import { Send, Upload, FileText, Bot, User, Sparkles, Paperclip, X } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [documentContext, setDocumentContext] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: portfolio } = usePortfolio();
    const { data: news } = useNews();
    const chat = useChat();
    const uploadDocument = useUploadDocument();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            role: "user",
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");

        chat.mutate({
            query: input,
            portfolio: portfolio?.tickers,
            news_context: news,
            document_context: documentContext
        }, {
            onSuccess: (response) => {
                setMessages(prev => [...prev, response]);
            }
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        uploadDocument.mutate(file, {
            onSuccess: (response) => {
                setDocumentContext(response.text);
                setUploadedFile(response.filename);
            }
        });
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-fade-in">
            {/* Sidebar - Context */}
            <div className="md:w-80 flex flex-col gap-4">
                <Card className="glass-card p-5 border-white/10 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Sparkles className="w-5 h-5" />
                        <h2 className="font-semibold text-white">Context</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Portfolio Context */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Portfolio</h3>
                            {portfolio && portfolio.tickers.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {portfolio.tickers.map((ticker) => (
                                        <Badge key={ticker} variant="secondary" className="bg-white/5 hover:bg-white/10 border-white/10">
                                            {ticker}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500 italic">No active portfolio</p>
                            )}
                        </div>

                        {/* News Context */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Market Intel</h3>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                <p className="text-xs text-zinc-400">
                                    {news ? (
                                        <span className="text-green-400 flex items-center gap-1">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            {news.length} live articles analyzed
                                        </span>
                                    ) : (
                                        "No market data loaded"
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</h3>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {!uploadedFile ? (
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    variant="outline"
                                    className="w-full border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white h-20 flex flex-col gap-2"
                                    disabled={uploadDocument.isPending}
                                >
                                    <Upload className="h-5 w-5" />
                                    <span className="text-xs">Upload PDF Report</span>
                                </Button>
                            ) : (
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between group">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                        <span className="text-xs text-white truncate">{uploadedFile}</span>
                                    </div>
                                    <button
                                        onClick={() => { setUploadedFile(""); setDocumentContext(""); }}
                                        className="text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-0">
                <Card className="glass-card border-white/10 flex-1 flex flex-col overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="AI" className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20" />
                            <div>
                                <h2 className="font-semibold text-white">Senhor Finanças AI</h2>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    Online & Ready
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                <Bot className="w-16 h-16 text-white/20 mb-4" />
                                <h3 className="text-xl font-medium text-white mb-2">How can I help you today?</h3>
                                <p className="text-sm text-zinc-400 max-w-md">
                                    I can analyze your portfolio risks, summarize recent market news, or extract insights from your uploaded financial documents.
                                </p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-4 max-w-[85%]",
                                    message.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                    message.role === "user" ? "bg-zinc-700" : "bg-primary/20 text-primary"
                                )}>
                                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed shadow-md",
                                    message.role === "user"
                                        ? "bg-zinc-800 text-white rounded-tr-sm"
                                        : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm backdrop-blur-sm"
                                )}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {chat.isPending && (
                            <div className="flex gap-4 max-w-[85%] animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <div className="relative flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-zinc-400 hover:text-white hover:bg-white/10"
                            >
                                <Paperclip className="w-5 h-5" />
                            </Button>

                            <Input
                                placeholder="Ask about market trends, portfolio risks..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                disabled={chat.isPending}
                                className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-zinc-600 rounded-full py-6 pl-6 pr-12"
                            />

                            <Button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || chat.isPending}
                                size="icon"
                                className="absolute right-1.5 top-1.5 bottom-1.5 w-9 h-9 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-zinc-600 mt-2">
                            AI can make mistakes. Please verify important financial information.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
