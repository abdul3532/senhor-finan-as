import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Banknote, Activity } from "lucide-react";
import type { CompanyProfile } from "@/lib/types";

interface CompanyDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticker: string | null;
    profile: CompanyProfile | null;
}

export function CompanyDetailModal({ isOpen, onClose, ticker, profile }: CompanyDetailModalProps) {
    if (!ticker) return null;

    // Fallback if profile is missing (e.g. old data)
    const displayProfile = profile || {
        name: `${ticker} Corp`,
        sector: "Unknown",
        industry: "Unknown",
        summary: "No detailed profile information available.",
        currency: "USD",
        website: ""
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden gap-0 max-h-[85vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-zinc-900/50 flex-shrink-0">
                    <div className="flex items-start justify-between pr-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700/50">
                                <span className="text-xl font-bold">
                                    {displayProfile.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold font-serif leading-tight mb-1">
                                    {displayProfile.name}
                                </DialogTitle>
                                <div className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
                                    <span>{ticker}</span>
                                    {displayProfile.website && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                            <a
                                                href={displayProfile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors group"
                                            >
                                                <Globe className="h-3 w-3 group-hover:scale-110 transition-transform" />
                                                <span className="underline decoration-blue-400/30 underline-offset-2 group-hover:decoration-blue-400/80">
                                                    Visit Website
                                                </span>
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                    <DialogDescription className="sr-only">
                        Company details for {ticker}
                    </DialogDescription>

                    {/* Key Metrics / Tags */}
                    <div className="flex flex-wrap gap-2">
                        {displayProfile.sector && (
                            <Badge variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 gap-1.5">
                                <Building2 className="h-3 w-3" />
                                {displayProfile.sector}
                            </Badge>
                        )}
                        {displayProfile.industry && (
                            <Badge variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 gap-1.5">
                                <Activity className="h-3 w-3" />
                                {displayProfile.industry}
                            </Badge>
                        )}
                        {displayProfile.currency && (
                            <Badge variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 gap-1.5">
                                <Banknote className="h-3 w-3" />
                                {displayProfile.currency}
                            </Badge>
                        )}
                    </div>

                    {/* About Section */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">About</h3>
                        <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                                {displayProfile.summary}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
