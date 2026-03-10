"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";

type Item = {
    href: string;
    label: string;
    icon: React.ReactNode;
};

export default function BottomNav() {
    const pathname = usePathname();

    const ref = React.useRef<HTMLElement | null>(null);

    // ✅ expose nav height to the page so we pad correctly (no big gap)
    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const apply = () => {
            const h = el.getBoundingClientRect().height || 72;
            document.documentElement.style.setProperty("--bottomnav-h", `${Math.ceil(h)}px`);
        };

        apply();
        const ro = new ResizeObserver(() => apply());
        ro.observe(el);

        window.addEventListener("resize", apply);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", apply);
        };
    }, []);

    // show/hide on scroll direction
    const [hidden, setHidden] = React.useState(false);
    const lastYRef = React.useRef(0);
    const tickingRef = React.useRef(false);

    React.useEffect(() => {
        lastYRef.current = window.scrollY;

        const onScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;

            window.requestAnimationFrame(() => {
                const y = window.scrollY;
                const last = lastYRef.current;
                const delta = y - last;

                // ignore tiny moves
                if (Math.abs(delta) > 8) {
                    // down => hide, up => show
                    setHidden(delta > 0);
                    lastYRef.current = y;
                }

                tickingRef.current = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const items: Item[] = [
        { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
        { href: "/search", label: "Search", icon: <Search className="h-5 w-5" /> },
        { href: "/sell", label: "Sell", icon: <PlusCircle className="h-6 w-6" /> },
        { href: "/chat", label: "Chat", icon: <MessageCircle className="h-5 w-5" /> },
        { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <nav
            ref={ref}
            className={cn(
                "md:hidden fixed inset-x-0 bottom-0 z-[600]",
                "border-t bg-white/95 backdrop-blur",
                "transition-transform duration-200",
                hidden ? "translate-y-full" : "translate-y-0"
            )}
            style={{ paddingBottom: 0 }}
            aria-label="Bottom navigation"
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-0">
                {items.map((it) => {
                    const active = isActive(it.href);

                    return (
                        <Link
                            key={it.href}
                            href={it.href}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-0",
                                "text-[11px] font-bold",
                                active ? "text-orange-600" : "text-slate-600 hover:text-orange-600"
                            )}
                        >
                            <span
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-full",
                                    active ? "bg-orange-50" : "bg-transparent"
                                )}
                            >
                                {it.icon}
                            </span>
                            <span>{it.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}