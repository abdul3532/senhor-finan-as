import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PieChart, MessageSquare, Newspaper, Moon, Sun } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    const navItems = [
        { name: "Home", path: "/", icon: LayoutDashboard },
        { name: "Portfolio", path: "/portfolio", icon: PieChart },
        { name: "News", path: "/news", icon: Newspaper }, // Assuming a separate news page or section
        { name: "Assistant", path: "/chat", icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-6 px-6 pointer-events-none">
                <div className="flex items-center justify-between w-full max-w-7xl pointer-events-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src="/senhor-logo.png" alt="Senhor Finanças" className="w-10 h-10 rounded-xl shadow-lg shadow-green-500/20" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 hidden sm:block">
                            Senhor Finanças
                        </span>
                    </div>

                    {/* Centered Pill Navigation */}
                    <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                        isActive
                                            ? "bg-white/10 text-white shadow-inner border border-white/5"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all text-zinc-400 hover:text-white">
                            <Moon className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center shadow-lg">
                            <span className="text-sm font-medium text-white">US</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Nav (optional, but good for responsiveness) */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex justify-around shadow-2xl">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "p-3 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-primary/20 text-primary"
                                    : "text-zinc-400 hover:text-white"
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                        </Link>
                    );
                })}
            </nav>

            {/* Main Content */}
            <main className="pt-32 px-6 pb-24 max-w-7xl mx-auto animate-fade-in">
                {children}
            </main>
        </div>
    );
}
