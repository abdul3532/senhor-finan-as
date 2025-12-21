import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

interface NewsCardProps {
    item: NewsItem;
    onClick: () => void;
}

export function NewsCard({ item, onClick }: NewsCardProps) {
    // Determine styles based on impact/sentiment
    const isNegative = item.impact === 'negative' || item.sentiment_score < 4;

    // Default neutral/great colors
    let accentColor = "bg-green-500";
    let borderColor = "border-green-500/20";
    let bgHover = "hover:border-green-500/40";
    let scoreBadgeClass = "text-green-500 border-green-500/20 bg-green-500/10";

    if (isNegative) {
        accentColor = "bg-red-500";
        borderColor = "border-red-500/20";
        bgHover = "hover:border-red-500/40";
        scoreBadgeClass = "text-red-500 border-red-500/20 bg-red-500/10";
    }

    // Determine impact scale visual (+3, +1, -2 etc)
    const impactVal = item.sentiment_score > 7 ? "+3" : item.sentiment_score > 5 ? "+1" : "-1";

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative rounded-xl border bg-background p-6 transition-all hover:shadow-lg cursor-pointer",
                borderColor,
                bgHover
            )}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                {/* Status Dot */}
                <div className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full", accentColor)} />

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <h3 className="font-serif text-lg font-medium leading-tight text-foreground group-hover:underline decoration-zinc-500 underline-offset-4">
                        {item.headline}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.summary}
                    </p>
                </div>

                {/* Right Side Metrics */}
                <div className="flex w-full flex-row items-center justify-between gap-4 md:w-auto md:flex-col md:items-end md:justify-start">

                    {/* Sentiment Slider Visual */}
                    <div className="flex flex-col items-end gap-1 w-32">
                        <div className="flex w-full justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                            <span>Critical</span>
                            <span>Great News</span>
                        </div>
                        <div className="relative h-1.5 w-full rounded-full bg-zinc-800">
                            {/* Gradient bar */}
                            <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-80" />
                            {/* Indicator dot */}
                            <div
                                className="absolute top-1/2 -ml-1.5 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-background bg-white shadow-sm"
                                style={{ left: `${item.sentiment_score * 10}%` }}
                            />
                        </div>
                    </div>

                    {/* Footer Tags */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center text-xs text-muted-foreground font-medium z-10">
                            {item.link ? (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary hover:underline transition-colors"
                                    onClick={(e) => e.stopPropagation()} // Prevent card click
                                >
                                    {item.source}
                                </a>
                            ) : (
                                <span>{item.source}</span>
                            )}
                            <span className="mx-2">•</span>
                            <span className="flex items-center gap-1">
                                {item.affected_tickers.length > 0 ? (
                                    <>
                                        <span>{item.affected_tickers[0]}</span>
                                        {item.affected_tickers.length > 1 && (
                                            <span className="text-muted-foreground/70">
                                                +{item.affected_tickers.length - 1}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span>General</span>
                                )}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{item.published || new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
