"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
=======
import { usePathname, useRouter } from "next/navigation";
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409

import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
<<<<<<< HEAD

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
=======
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import Unreadmessages from "@/components/shared/Unreadmessages";
import UserMenu from "@/components/shared/UserMenu";
import { useAuth } from "@/app/hooks/useAuth";

function getDisplayName(appUser?: any, authUser?: any) {
    if (appUser?.firstName || appUser?.lastName) {
        return `${appUser?.firstName ?? ""} ${appUser?.lastName ?? ""}`.trim();
    }
    if (appUser?.name) return appUser.name;
    if (appUser?.username) return appUser.username;
    if (authUser?.displayName) return authUser.displayName;
    if (authUser?.email) return authUser.email.split("@")[0];
    return "Account";
}

function getPhoto(appUser?: any, authUser?: any) {
    return appUser?.photo || appUser?.imageUrl || appUser?.avatar || authUser?.photoURL || "";
}

export default function TopBar() {
    const ref = React.useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    //const { authUser, user: appUser, appUserId, loading, profileLoading } = useAuth();
    const { user, loading } = useAuth();
    const authUser = "";
    const appUserId = "";
    const appUser: any = [];
    const isLoggedIn = !!authUser;
    const resolvedUserId = appUserId || "";
    const displayName = getDisplayName(appUser, authUser);
    const displayPhoto = getPhoto(appUser, authUser);
    const showBackButton = pathname !== "/";

    const requireAuth = React.useCallback(
        (path: string) => {
            if (!authUser) {
                router.push(`/auth?next=${encodeURIComponent(path)}`);
                return false;
            }
            return true;
        },
        [authUser, router]
    );

    const handleGoBack = React.useCallback(() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409

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

<<<<<<< HEAD
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
                            className="object-contain p-0"
                            priority
                            unoptimized
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
=======
    // const showUserLoading = loading || (isLoggedIn && profileLoading);
    const showUserLoading = loading;

    return (
        <div
            ref={ref}
            className="fixed inset-x-0 top-0 z-[500] border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#131B1E]/90"
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3">
                <div className="flex min-w-0 items-center gap-2">
                    {showBackButton ? (
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1B2327] dark:text-slate-200 dark:hover:bg-[#222C31]"
                            aria-label="Go back"
                            title="Go back"
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                        </button>
                    ) : null}

                    <Link href="/" className="flex min-w-0 items-center gap-2">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border bg-white">
                            <Image
                                src="/logo.png"
                                alt="Tadao Market"
                                fill
                                className="object-contain"
                                priority
                                unoptimized
                            />
                        </div>

                        <div className="hidden min-w-0 sm:block">
                            <div className="truncate text-sm font-extrabold leading-tight text-slate-900 dark:text-white">
                                Tadao Market
                            </div>
                            <div className="-mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                Buy & sell across Kenya
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 lg:flex">
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => {
<<<<<<< HEAD
                                            if (!requireAuth()) return;
                                            onOpenBookmark?.();
                                            // fallback route if handler not provided
                                            if (!onOpenBookmark) router.push("/bookmarks");
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
=======

                                            if (authUser) {
                                                router.push("/bookmarks");
                                            } else {
                                                router.push("/auth");
                                            }
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1B2327] dark:text-slate-200 dark:hover:bg-[#222C31]"
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                                    >
                                        <BookmarkIcon fontSize="small" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
<<<<<<< HEAD
                                    <p>Bookmark</p>
=======
                                    <p>Bookmarks</p>
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

<<<<<<< HEAD
                        {/* Chat */}
=======
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => {
<<<<<<< HEAD
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
=======
                                            if (authUser) {
                                                router.push("/chat");
                                            } else {
                                                router.push("/auth");
                                            }
                                        }}
                                        className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1B2327] dark:text-slate-200 dark:hover:bg-[#222C31]"
                                    >
                                        <MessageIcon fontSize="small" />
                                        {resolvedUserId ? (
                                            <span className="absolute -right-1 -top-1">
                                                <Unreadmessages userId={resolvedUserId} />
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                                            </span>
                                        ) : null}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                                        Chats {userId ? <Unreadmessages userId={userId} /> : null}
=======
                                        Chats {resolvedUserId ? <Unreadmessages userId={resolvedUserId} /> : null}
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

<<<<<<< HEAD
                        {/* Premium */}
=======
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
<<<<<<< HEAD
                                        onClick={() => {
                                            onOpenPlan?.();
                                            if (!onOpenPlan) router.push("/pricing");
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
=======
                                        onClick={() => router.push("/pricing")}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1B2327] dark:text-slate-200 dark:hover:bg-[#222C31]"
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
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

<<<<<<< HEAD
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
=======
                    <button
                        type="button"
                        onClick={() => {
                            if (authUser) {
                                router.push("/sell");
                            } else {
                                router.push("/auth");
                            }
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-orange-600"
                    >
                        <SellOutlinedIcon sx={{ fontSize: 18 }} />
                        <span className="hidden sm:inline">Sell</span>
                    </button>

                    {showUserLoading ? (
                        <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                    ) : !isLoggedIn ? (
                        <button
                            type="button"
                            onClick={() => router.push("/auth")}
                            className="rounded-full border px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-[#1B2327]"
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                        >
                            Sign in
                        </button>
                    ) : (
<<<<<<< HEAD
                        // User menu (when logged in)
                        <UserMenu userdata={user} handleOpenShop={() => router.push("/profile")} handleOpenSettings={() => router.push("/settings")} />
=======
                        <div className="flex items-center gap-2">
                            <div className="hidden items-center gap-2 rounded-full border bg-white px-2 py-1.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1B2327] dark:hover:bg-[#222C31] md:flex">
                                <div className="max-w-[120px] text-left">
                                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                        {displayName}
                                    </div>
                                </div>

                                <UserMenu
                                    userdata={appUser}
                                    handleOpenShop={(shopId) => {
                                        if (authUser) {
                                            router.push(`/profile/${shopId}`);
                                        } else {
                                            router.push("/auth");
                                        }
                                    }}
                                    handleOpenSettings={() => {

                                        if (authUser) {
                                            router.push(`/settings`);
                                        } else {
                                            router.push("/auth");
                                        }
                                    }
                                    }
                                />
                            </div>

                            <div className="md:hidden">
                                <UserMenu
                                    userdata={appUser}
                                    handleOpenShop={(shopId) => {
                                        if (authUser) {
                                            router.push(`/profile/${shopId}`);
                                        } else {
                                            router.push("/auth");
                                        }
                                    }}
                                    handleOpenSettings={() => {

                                        if (authUser) {
                                            router.push(`/settings`);
                                        } else {
                                            router.push("/auth");
                                        }
                                    }}
                                />
                            </div>
                        </div>
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                    )}
                </div>
            </div>
        </div>
    );
}