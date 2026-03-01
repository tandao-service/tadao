"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// use your existing components
import Unreadmessages from "@/components/shared/Unreadmessages";
import UserMenu from "@/components/shared/UserMenu";

// If you have your auth hook, you can keep it.
// If not, remove this and rely on "user" prop only.
// import { useAuth } from "@/app/hooks/useAuth";

type TopBarProps = {
    user?: any; // your user doc
    userId?: string; // your app user id
    onOpenBookmark?: () => void;
    onOpenChat?: () => void;
    onOpenPlan?: () => void;
    onOpenSell?: () => void;
};

export default function TopBar({
    user,
    userId,
    onOpenBookmark,
    onOpenChat,
    onOpenPlan,
    onOpenSell,
}: TopBarProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const router = useRouter();

    // 🔒 simple auth guard (same behavior as old: redirect to /auth)
    const requireAuth = React.useCallback(() => {
        if (!user?._id && !userId) {
            router.push("/auth");
            return false;
        }
        return true;
    }, [router, user?._id, userId]);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const apply = () => {
            const h = el.getBoundingClientRect().height;
            document.documentElement.style.setProperty("--topbar-h", `${Math.ceil(h)}px`);
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

    return (
        <div ref={ref} className="fixed inset-x-0 top-0 z-[500] border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3">
                {/* LEFT: Logo + Brand */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border bg-white">
                        <Image
                            src="/logo.png"
                            alt="Tadao Market"
                            fill
                            className="object-contain p-1"
                            priority
                        />
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-sm font-extrabold leading-tight">Tadao Market</div>
                        <div className="text-[11px] font-semibold text-slate-500 -mt-0.5">Buy & sell across Kenya</div>
                    </div>
                </Link>

                {/* RIGHT: actions */}
                <div className="flex items-center gap-2">
                    {/* Desktop icon actions (like old navbar) */}
                    <div className="hidden lg:flex items-center gap-2">
                        {/* Bookmark */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!requireAuth()) return;
                                            onOpenBookmark?.();
                                            // fallback route if handler not provided
                                            if (!onOpenBookmark) router.push("/bookmarks");
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
                                    >
                                        <BookmarkIcon fontSize="small" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Bookmark</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Chat */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!requireAuth()) return;
                                            onOpenChat?.();
                                            if (!onOpenChat) router.push("/chat");
                                        }}
                                        className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
                                    >
                                        <MessageIcon fontSize="small" />
                                        {/* unread badge */}
                                        {userId ? (
                                            <span className="absolute -right-1 -top-1">
                                                <Unreadmessages userId={userId} />
                                            </span>
                                        ) : null}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex items-center gap-2">
                                        Chats {userId ? <Unreadmessages userId={userId} /> : null}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Premium */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onOpenPlan?.();
                                            if (!onOpenPlan) router.push("/pricing");
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
                                    >
                                        <DiamondIcon fontSize="small" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Premium Services</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Sell button */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!requireAuth()) return;
                            onOpenSell?.();
                            if (!onOpenSell) router.push("/sell");
                        }}
                        className="rounded-full bg-orange-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-orange-600"
                    >
                        Sell
                    </button>

                    {/* Sign in (only when logged out) */}
                    {!user?._id && !userId ? (
                        <button
                            type="button"
                            onClick={() => router.push("/auth")}
                            className="rounded-full border px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
                        >
                            Sign in
                        </button>
                    ) : (
                        // User menu (when logged in)
                        <UserMenu userdata={user} handleOpenShop={() => router.push("/profile")} handleOpenSettings={() => router.push("/settings")} />
                    )}
                </div>
            </div>
        </div>
    );
}