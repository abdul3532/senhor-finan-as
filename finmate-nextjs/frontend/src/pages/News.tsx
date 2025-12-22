import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { Filter, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNews, useRefreshNews } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

export default function NewsPage() {
    // UI Filters State
    const [filters, setFilters] = useState({
        usEquity: false,
        euEquity: false,
        chEquity: false, // China/Switzerland? Assuming CH is Swiss given CHF in screenshot
        ukEquity: false,
        jpEquity: false,
        emEquity: false,
        government: false,
        corporate: false,
        usd: false,
        chf: false
    });

    const toggleFilter = (key: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Fetch News using hook
    const { data: news = [], isLoading, isRefetching } = useNews();
    const refreshMutation = useRefreshNews();

    // Filter Logic
    const filteredNews = news.filter((item: NewsItem) => {
        // Intelligent Filters (Mock Logic - in real app, check item.tags or item.asset_class)
        // Here we try to match based on text content if filters are active
        const activeFilters = Object.entries(filters).filter(([_, val]) => val);
        if (activeFilters.length > 0) {
            let matches = false;
            const content = (item.headline + " " + item.summary + " " + item.affected_tickers.join(" ")).toLowerCase();

            if (filters.usEquity && (content.includes("us") || content.includes("usa") || content.includes("nasdaq") || content.includes("nyse"))) matches = true;
            if (filters.euEquity && (content.includes("eu") || content.includes("europe") || content.includes("ecb"))) matches = true;
            if (filters.chEquity && (content.includes("swiss") || content.includes("chf") || content.includes("china"))) matches = true;
            // ... add more logic as needed for MVP

            // If no intelligent match found but filters are active, maybe show all? 
            // For now, let's just return true if no specific match logic is better implemented, 
            // OR strictly filter. Let's strictly filter if they selected something.
            if (!matches) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-transparent p-6 md:p-12 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight mb-2 text-foreground">Financial News</h1>
                    <p className="text-muted-foreground max-w-xl text-lg">
                        Real-time market signals with AI-powered analysis
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar Filters */}
                <div className="hidden lg:block lg:col-span-3 space-y-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="w-5 h-5 text-muted-foreground" />
                        <span className="font-semibold text-lg">Portfolio Filters</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <SlidersHorizontal className="w-4 h-4" />
                            Asset Classes
                        </div>
                        <div className="space-y-3 pl-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="us" checked={filters.usEquity} onCheckedChange={() => toggleFilter('usEquity')} />
                                <label htmlFor="us" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    US Equity
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="eu" checked={filters.euEquity} onCheckedChange={() => toggleFilter('euEquity')} />
                                <label htmlFor="eu" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    EU Equity
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="ch" checked={filters.chEquity} onCheckedChange={() => toggleFilter('chEquity')} />
                                <label htmlFor="ch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    CH Equity
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="uk" checked={filters.ukEquity} onCheckedChange={() => toggleFilter('ukEquity')} />
                                <label htmlFor="uk" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    UK Equity
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="jp" checked={filters.jpEquity} onCheckedChange={() => toggleFilter('jpEquity')} />
                                <label htmlFor="jp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    JP Equity
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="em" checked={filters.emEquity} onCheckedChange={() => toggleFilter('emEquity')} />
                                <label htmlFor="em" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    EM Equity
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <span className="text-lg font-mono">$</span>
                            Fixed Income
                        </div>
                        <div className="space-y-3 pl-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="gov" checked={filters.government} onCheckedChange={() => toggleFilter('government')} />
                                <label htmlFor="gov" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Government
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="corp" checked={filters.corporate} onCheckedChange={() => toggleFilter('corporate')} />
                                <label htmlFor="corp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Corporate
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <RefreshCw className="w-4 h-4" />
                            Currencies
                        </div>
                        <div className="space-y-3 pl-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="usd" checked={filters.usd} onCheckedChange={() => toggleFilter('usd')} />
                                <label htmlFor="usd" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    USD
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="chf" checked={filters.chf} onCheckedChange={() => toggleFilter('chf')} />
                                <label htmlFor="chf" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    CHF
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Feed */}
                <div className="col-span-1 lg:col-span-9 space-y-6">
                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-48 bg-zinc-900/10 dark:bg-zinc-800/50 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNews.map((item: NewsItem) => (
                                <NewsCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => { }}
                                />
                            ))}

                            {filteredNews.length === 0 && (
                                <div className="py-20 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                                    No news found matching your filters.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
