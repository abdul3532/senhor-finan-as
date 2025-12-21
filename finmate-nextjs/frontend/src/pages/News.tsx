import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { Calendar, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNews, useRefreshNews } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

export default function NewsPage() {
    const [sort, setSort] = useState("date_desc");
    const [filterSource, setFilterSource] = useState("all");

    // Fetch News using hook
    const { data: news = [], isLoading, isRefetching } = useNews();

    // Refresh Mutation using hook
    const refreshMutation = useRefreshNews();

    // Filter Logic (Client-side for MVP)
    const filteredNews = news.filter((item: NewsItem) => {
        if (filterSource !== "all" && item.source !== filterSource) return false;
        return true;
    }).sort((a: NewsItem, b: NewsItem) => {
        if (sort === "date_desc") {
            return (new Date(b.published || "").getTime() || 0) - (new Date(a.published || "").getTime() || 0);
        }
        if (sort === "impact_high") {
            // Priority: High > Medium > Low
            const map = { high: 3, medium: 2, low: 1 };
            return (map[b.risk_level] || 0) - (map[a.risk_level] || 0);
        }
        return 0;
    });

    // Derived Sources for Filter
    const sources = Array.from(new Set(news.map((n: NewsItem) => n.source || "Unknown"))).sort();

    return (
        <div className="min-h-screen bg-black/95 text-white p-6 md:p-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Market Intelligence</h1>
                    <p className="text-zinc-400 max-w-xl text-lg">
                        Real-time AI analysis of global financial news affecting your portfolio.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => refreshMutation.mutate()}
                        disabled={refreshMutation.isPending || isRefetching}
                        className={cn("gap-2 min-w-[140px]", refreshMutation.isPending && "animate-pulse")}
                        variant="outline"
                    >
                        <RefreshCw className={cn("h-4 w-4", (refreshMutation.isPending || isRefetching) && "animate-spin")} />
                        {refreshMutation.isPending ? "Analyzing..." : "Refresh Feed"}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 py-2">
                <div className="flex items-center gap-2 text-sm text-zinc-500 font-mono uppercase tracking-wider">
                    <Filter className="h-4 w-4" />
                    Filters
                </div>

                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
                        <Calendar className="mr-2 h-4 w-4 text-zinc-500" />
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date_desc">Newest First</SelectItem>
                        <SelectItem value="impact_high">Highest Impact</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterSource} onValueChange={setFilterSource}>
                    <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {sources.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-zinc-900/50 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((item: NewsItem) => (
                        <NewsCard
                            key={item.id}
                            item={item}
                            onClick={() => { }}
                        />
                    ))}

                    {filteredNews.length === 0 && (
                        <div className="col-span-full py-20 text-center text-zinc-500">
                            No news found matching your filters.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
