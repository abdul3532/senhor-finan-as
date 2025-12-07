import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNews, useRefreshNews, usePortfolio, useGenerateReport } from "@/lib/api";
import { RefreshCw, Download, TrendingUp, TrendingDown, ArrowRight, ExternalLink, Clock } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    const { data: portfolio } = usePortfolio();
    const { data: news, isLoading: newsLoading } = useNews();
    const refreshNews = useRefreshNews();
    const generateReport = useGenerateReport();

    const handleRefreshNews = () => {
        refreshNews.mutate();
    };

    const handleGenerateReport = () => {
        if (news) {
            generateReport.mutate(news, {
                onSuccess: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'finmate_briefing.pdf';
                    a.click();
                }
            });
        }
    };

    const getImpactColor = (impact: string) => {
        if (impact === "positive") return "text-green-400";
        if (impact === "negative") return "text-red-400";
        return "text-blue-400";
    };

    const getImpactBg = (impact: string) => {
        if (impact === "positive") return "bg-green-500/10 border-green-500/20";
        if (impact === "negative") return "bg-red-500/10 border-red-500/20";
        return "bg-blue-500/10 border-blue-500/20";
    };

    // Mock data for portfolio cards to match the visual style if real data is missing details
    // In a real app, we'd fetch this detailed info
    const getCompanyDetails = (ticker: string) => {
        const details: Record<string, { name: string, icon: string }> = {
            "AAPL": { name: "Apple Inc.", icon: "🍎" },
            "MSFT": { name: "Microsoft Corp.", icon: "🪟" },
            "GOOGL": { name: "Alphabet Inc.", icon: "🔍" },
            "AMZN": { name: "Amazon.com", icon: "📦" },
            "TSLA": { name: "Tesla Inc.", icon: "🚗" },
            "META": { name: "Meta Platforms", icon: "♾️" },
            "NVDA": { name: "NVIDIA Corp.", icon: "🎮" },
        };
        return details[ticker] || { name: `${ticker} Corp`, icon: "🏢" };
    };

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your daily financial intelligence briefing
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={handleRefreshNews}
                        disabled={refreshNews.isPending}
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", refreshNews.isPending && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button
                        onClick={handleGenerateReport}
                        disabled={!news || news.length === 0 || generateReport.isPending}
                        className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/20"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Briefing PDF
                    </Button>
                </div>
            </div>

            {/* Portfolio Impact Section */}
            <section className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white">Portfolio - Today's Impact Previsions</h2>
                </div>

                {portfolio && portfolio.tickers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {portfolio.tickers.map((ticker) => {
                            const details = getCompanyDetails(ticker);
                            // Find news for this ticker to determine impact
                            const tickerNews = news?.filter(n => n.affected_tickers.includes(ticker)) || [];
                            const impactScore = tickerNews.reduce((acc, n) => {
                                if (n.impact === 'positive') return acc + 1;
                                if (n.impact === 'negative') return acc - 1;
                                return acc;
                            }, 0);

                            const isPositive = impactScore >= 0;

                            return (
                                <div
                                    key={ticker}
                                    className={cn(
                                        "relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] cursor-pointer group",
                                        isPositive
                                            ? "bg-gradient-to-br from-green-950/30 to-black border-green-500/20 hover:border-green-500/40"
                                            : "bg-gradient-to-br from-red-950/30 to-black border-red-500/20 hover:border-red-500/40"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl backdrop-blur-sm">
                                                {details.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg leading-none">{ticker}</h3>
                                                <p className="text-xs text-muted-foreground mt-1">{details.name}</p>
                                            </div>
                                        </div>
                                        {isPositive ? (
                                            <TrendingUp className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <Badge variant="outline" className="bg-black/20 border-white/10 text-xs font-normal">
                                            {tickerNews.length} news items
                                        </Badge>

                                        {/* Mini sparkline simulation */}
                                        <div className="flex gap-0.5 items-end h-6">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "w-1 rounded-t-sm",
                                                        isPositive ? "bg-green-500/40" : "bg-red-500/40"
                                                    )}
                                                    style={{ height: `${Math.random() * 100}%` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add New Ticker Card */}
                        <div className="rounded-2xl p-5 border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors cursor-pointer min-h-[140px]">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                <span className="text-xl">+</span>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">Add Asset</p>
                        </div>
                    </div>
                ) : (
                    <Card className="bg-white/5 border-white/10 p-8 text-center">
                        <p className="text-muted-foreground mb-4">No assets in your portfolio yet.</p>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            Add Your First Asset
                        </Button>
                    </Card>
                )}
            </section>

            {/* News Feed Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Today's Important Financial News</h2>

                {newsLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-muted-foreground animate-pulse">Analyzing global markets...</p>
                    </div>
                )}

                <div className="grid gap-4">
                    {news?.map((item: NewsItem, index) => (
                        <div
                            key={item.id || index}
                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:border-white/20"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                {/* Left Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-2 h-2 rounded-full",
                                            item.impact === 'positive' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                                                item.impact === 'negative' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" :
                                                    "bg-blue-500"
                                        )} />
                                        <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                                            {item.headline}
                                        </h3>
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed">
                                        {item.summary}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-400 font-normal">
                                            {item.category}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                                            <Clock className="w-3 h-3" />
                                            <span>{new Date().toLocaleTimeString()}</span>
                                        </div>
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-primary hover:underline ml-auto"
                                            >
                                                Read Source <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Right Stats Panel */}
                                <div className="md:w-64 flex flex-col justify-center gap-4 pl-6 md:border-l border-white/5">
                                    {/* Sentiment Meter */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-zinc-400">
                                            <span>Critical</span>
                                            <span>Great News</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                                            <div
                                                className={cn("absolute top-0 bottom-0 w-full transition-all duration-1000",
                                                    item.sentiment_score > 50 ? "bg-gradient-to-r from-transparent to-green-500" : "bg-gradient-to-r from-red-500 to-transparent"
                                                )}
                                                style={{
                                                    left: `${item.sentiment_score > 50 ? 0 : item.sentiment_score - 100}%`,
                                                    opacity: 0.5
                                                }}
                                            />
                                            <div
                                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"
                                                style={{ left: `${item.sentiment_score}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Impact Tags */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex -space-x-2">
                                            {item.affected_tickers.slice(0, 3).map((ticker, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white z-10">
                                                    {ticker.substring(0, 1)}
                                                </div>
                                            ))}
                                            {item.affected_tickers.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white z-0">
                                                    +{item.affected_tickers.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <Badge className={cn("ml-auto font-mono", getImpactBg(item.impact), getImpactColor(item.impact))}>
                                            {item.impact === 'positive' ? '+1' : item.impact === 'negative' ? '-1' : '0'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
