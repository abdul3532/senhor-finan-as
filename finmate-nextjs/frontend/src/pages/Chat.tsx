import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePortfolio, useNews, useChat, useUploadDocument, useChatHistory, useChatMessages } from "@/lib/api";
import { Send, Upload, FileText, Bot, User, Sparkles, Paperclip, X, MessageSquare, History, Plus } from "lucide-react";
import type { ChatMessage, Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function Chat() {
    const queryClient = useQueryClient();

    // State
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [documentContext, setDocumentContext] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<string>("");
    const [sidebarView, setSidebarView] = useState<"history" | "context">("history");

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Queries
    const { data: portfolio } = usePortfolio();
    const { data: news } = useNews();
    const { data: history = [] } = useChatHistory();
    const { data: serverMessages } = useChatMessages(conversationId);

    // Mutations
    const chat = useChat();
    const uploadDocument = useUploadDocument();

    // Effects
    useEffect(() => {
        if (serverMessages) {
            setMessages(serverMessages);
        }
    }, [serverMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handlers
    const handleNewChat = () => {
        setConversationId(null);
        setMessages([]);
        setInput("");
        setSidebarView("context"); // Switch to context for setup
    };

    const handleLoadChat = (id: string) => {
        setConversationId(id);
        // Messages will load via useEffect -> serverMessages
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            role: "user",
            content: input
        };

        // Optimistic update
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        chat.mutate({
            query: input,
            conversation_id: conversationId || undefined,
            portfolio: portfolio?.tickers,
            news_context: news,
            document_context: documentContext
        }, {
            onSuccess: (response) => {
                // Determine Conversation ID from response if it was new
                if (!conversationId && response.conversation_id) {
                    setConversationId(response.conversation_id);
                    queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
                }

                // Append assistant message
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
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-fade-in text-zinc-100">
            {/* Sidebar */}
            <div className="md:w-80 flex flex-col gap-4">
                <Card className="glass-card p-0 border-white/10 flex-1 flex flex-col overflow-hidden">
                    {/* Sidebar Toggle */}
                    <div className="grid grid-cols-2 border-b border-white/10">
                        <button
                            onClick={() => setSidebarView("history")}
                            className={cn(
                                "flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors",
                                sidebarView === "history"
                                    ? "bg-white/10 text-white border-b-2 border-primary"
                                    : "hover:bg-white/5 text-zinc-400"
                            )}
                        >
                            <History className="w-4 h-4" />
                            History
                        </button>
                        <button
                            onClick={() => setSidebarView("context")}
                            className={cn(
                                "flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors",
                                sidebarView === "context"
                                    ? "bg-white/10 text-white border-b-2 border-primary"
                                    : "hover:bg-white/5 text-zinc-400"
                            )}
                        >
                            <Sparkles className="w-4 h-4" />
                            Context
                        </button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        {sidebarView === "history" ? (
                            <div className="space-y-3">
                                <Button
                                    onClick={handleNewChat}
                                    className="w-full justify-start gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 mb-4"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Chat
                                </Button>

                                {history.length === 0 ? (
                                    <p className="text-center text-xs text-zinc-500 py-4">No recent chats</p>
                                ) : (
                                    <div className="space-y-1">
                                        {history.map((conv: Conversation) => (
                                            <button
                                                key={conv.id}
                                                onClick={() => handleLoadChat(conv.id)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all truncate",
                                                    conversationId === conv.id
                                                        ? "bg-white/10 text-white font-medium"
                                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                {conv.title || "Untitled Chat"}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Context View (Existing)
                            <div className="space-y-6">
                                {/* Portfolio */}
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

                                {/* News */}
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
                                                    {news.length} live articles
                                                </span>
                                            ) : "No data"}
                                        </p>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="space-y-2">
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</h3>
                                    <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />

                                    {!uploadedFile ? (
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            variant="outline"
                                            className="w-full border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white h-20 flex flex-col gap-2"
                                            disabled={uploadDocument.isPending}
                                        >
                                            <Upload className="h-5 w-5" />
                                            <span className="text-xs">Upload PDF</span>
                                        </Button>
                                    ) : (
                                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="h-4 w-4 text-primary shrink-0" />
                                                <span className="text-xs text-white truncate">{uploadedFile}</span>
                                            </div>
                                            <button onClick={() => { setUploadedFile(""); setDocumentContext(""); }} className="text-zinc-500 hover:text-white">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
                                    {conversationId ? "History Validated" : "New Conversation"}
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
                                    Ready to analyze your portfolio or discuss market trends.
                                </p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex gap-4 max-w-[85%]", message.role === "user" ? "ml-auto flex-row-reverse" : "")}>
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1", message.role === "user" ? "bg-zinc-700" : "bg-primary/20 text-primary")}>
                                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={cn("p-4 rounded-2xl text-sm leading-relaxed shadow-md", message.role === "user" ? "bg-zinc-800 text-white rounded-tr-sm" : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm backdrop-blur-sm")}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {chat.isPending && (
                            <div className="flex gap-4 max-w-[85%] animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-1"><Bot className="w-4 h-4" /></div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <div className="relative flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-zinc-400 hover:text-white hover:bg-white/10">
                                <Paperclip className="w-5 h-5" />
                            </Button>
                            <Input
                                placeholder="Ask about market trends..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                disabled={chat.isPending}
                                className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-zinc-600 rounded-full py-6 pl-6 pr-12"
                            />
                            <Button onClick={handleSendMessage} disabled={!input.trim() || chat.isPending} size="icon" className="absolute right-1.5 top-1.5 bottom-1.5 w-9 h-9 rounded-full bg-primary hover:bg-primary/90">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
