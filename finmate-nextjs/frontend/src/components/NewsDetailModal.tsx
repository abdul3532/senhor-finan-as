import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { NewsItem } from "@/lib/types";

interface NewsDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    newsItem: NewsItem | null;
}

export function NewsDetailModal({ isOpen, onClose, newsItem }: NewsDetailModalProps) {
    if (!newsItem) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-0 text-left">
                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            <DialogTitle className="text-xl font-serif font-bold leading-tight pr-8">
                                {newsItem.headline}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>
                <div className="p-6 space-y-6 pt-2">
                    <DialogDescription className="sr-only">
                        Detailed view of the news article including summary, impact, and sources.
                    </DialogDescription>

                    <div className="space-y-4">
                        {/* Related Sources Section */}
                        {newsItem.related_sources && newsItem.related_sources.length > 0 && (
                            <div className="space-y-3 pt-2 border-t border-border/50">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    Related Coverage ({newsItem.related_sources.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {newsItem.related_sources.map((source, idx) => (
                                        <a
                                            key={idx}
                                            href={source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-secondary/50 hover:bg-secondary px-2 py-1 rounded-md text-foreground/80 transition-colors truncate max-w-[200px] flex items-center gap-1"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            {new URL(source).hostname.replace('www.', '')}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Sentiment Bar Visualization */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold text-zinc-400">Sentiment Analysis</h3>
                                <span className="text-sm font-mono text-zinc-300">{newsItem.sentiment_score}/10</span>
                            </div>
                            <div className="relative h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-80" />
                                <div
                                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                    style={{ left: `${newsItem.sentiment_score * 10}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                <span>Critical</span>
                                <span>Neutral</span>
                                <span>Great</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-zinc-400 mb-2">Summary</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                {newsItem.summary}
                            </p>
                        </div>

                        {/* Read Full News Button */}
                        {newsItem.link && (
                            <Button
                                variant="outline"
                                className="rounded-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800 h-8 text-xs gap-2"
                                onClick={() => window.open(newsItem.link, '_blank')}
                            >
                                <ExternalLink className="w-3 h-3" />
                                Read full news
                            </Button>
                        )}

                        <div>
                            <h3 className="text-sm font-semibold text-zinc-400 mb-2">Overall Impact</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                                {newsItem.impact_reason}
                            </p>

                            {/* Tags: Green for positive, Red for negative */}
                            <div className="flex flex-wrap gap-2">
                                {newsItem.affected_tickers.map((ticker) => {
                                    // Heuristic: if item is "negative", assume all tickers are negatively affected unless we parse improved per-ticker sentiment.
                                    // For now, using item.impact
                                    const isNegative = newsItem.impact === 'negative' || newsItem.sentiment_score < 4;
                                    const variantStyles = isNegative
                                        ? "bg-red-900/30 text-red-400 border-red-900/50 hover:bg-red-900/50"
                                        : "bg-green-900/30 text-green-400 border-green-900/50 hover:bg-green-900/50";
                                    const sign = isNegative ? "(-)" : "(+)";

                                    return (
                                        <Badge key={ticker} variant="outline" className={variantStyles}>
                                            {ticker} {sign}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
