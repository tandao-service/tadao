"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import UserMenu from "@/components/shared/UserMenu";
import { useAuth } from "@/app/hooks/useAuth";
import Unreadmessages from "../shared/Unreadmessages";
import MobileNav from "../shared/MobileNav";

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

export default function TopBar() {
    const ref = React.useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const {
        authUser,
        user: appUser,
        appUserId,
        loading,
        profileLoading,
    } = useAuth();

    const isLoggedIn = !!authUser;
    const resolvedUserId = appUserId || "";
    const displayName = getDisplayName(appUser, authUser);
    const showBackButton = pathname !== "/";

    const popup = React.useMemo(() => {
        if (pathname.startsWith("/create-ad")) return "Sell";
        if (pathname.startsWith("/bookmarks")) return "Bookmark";
        if (pathname.startsWith("/profile-messages")) return "Chat";
        if (pathname.startsWith("/plan")) return "Plan";
        if (pathname.startsWith("/settings")) return "Profile";
        if (pathname.startsWith("/performance")) return "Performance";
        if (pathname.startsWith("/profile")) return "My Shop";
        if (pathname.startsWith("/home")) return "Admin";
        return "Home";
    }, [pathname]);

    const userstatus = appUser?.status || "User";

    const handleGoBack = React.useCallback(() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const apply = () => {
            const h = el.getBoundingClientRect().height;
            document.documentElement.style.setProperty(
                "--topbar-h",
                `${Math.ceil(h)}px`
            );
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

    const showUserLoading = loading || (isLoggedIn && profileLoading);

    const iconButtonClass =
        "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-[#1B2327] dark:text-slate-200 dark:hover:border-orange-500/30 dark:hover:bg-[#222C31] dark:hover:text-orange-300";

    return (
        <div
            ref={ref}
            className="fixed inset-x-0 top-0 z-[50] border-b border-orange-100 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#131B1E]/95"
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    {showBackButton ? (
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className={iconButtonClass}
                            aria-label="Go back"
                            title="Go back"
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                        </button>
                    ) : null}

                    <Link href="/" className="flex min-w-0 items-center gap-2.5">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-orange-100 bg-white shadow-sm ring-1 ring-orange-50">
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

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden items-center gap-2 lg:flex">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (authUser) {
                                                router.push("/bookmarks");
                                            } else {
                                                router.push("/auth");
                                            }
                                        }}
                                        className={iconButtonClass}
                                    >
                                        <BookmarkIcon fontSize="small" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Bookmarks</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (authUser) {
                                                router.push("/profile-messages");
                                            } else {
                                                router.push("/auth");
                                            }
                                        }}
                                        className={`relative ${iconButtonClass}`}
                                    >
                                        <MessageIcon fontSize="small" />
                                        {resolvedUserId ? (
                                            <span className="absolute -right-1 -top-1">
                                                <Unreadmessages userId={resolvedUserId} />
                                            </span>
                                        ) : null}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex items-center gap-2">
                                        Chats{" "}
                                        {resolvedUserId ? (
                                            <Unreadmessages userId={resolvedUserId} />
                                        ) : null}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/plan")}
                                        className={iconButtonClass}
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

                    <button
                        type="button"
                        onClick={() => {
                            if (authUser) {
                                router.push("/create-ad");
                            } else {
                                router.push("/auth");
                            }
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600 hover:shadow md:px-4"
                    >
                        <SellOutlinedIcon sx={{ fontSize: 18 }} />
                        <span className="hidden sm:inline">Sell</span>
                    </button>

                    {showUserLoading ? (
                        <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                    ) : !isLoggedIn ? (
                        <>
                            <button
                                type="button"
                                onClick={() => router.push("/auth")}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-[#1B2327] dark:text-white dark:hover:border-orange-500/30 dark:hover:bg-[#222C31]"
                            >
                                Sign in
                            </button>


                            <MobileNav
                                userstatus={userstatus}
                                userId={resolvedUserId}
                                popup={popup}
                                user={appUser}
                                handleOpenSell={() => router.push("/create-ad")}
                                handleOpenBook={() => router.push("/bookmarks")}
                                handleOpenPlan={() => router.push("/plan")}
                                handleOpenChat={() => router.push("/profile-messages")}
                                handleOpenShop={(shopId: any) => {
                                    const id = shopId?._id || shopId?.id || shopId || "";
                                    if (!id) return;
                                    router.push(`/profile/${id}`);
                                }}
                                handleOpenPerfomance={() => router.push("/performance")}
                                handleOpenSettings={() => router.push("/settings")}
                                handleOpenAbout={() => router.push("/about")}
                                handleOpenTerms={() => router.push("/terms")}
                                handleOpenPrivacy={() => router.push("/privacy")}
                                handleOpenSafety={() => router.push("/safety")}
                                onClose={() => router.push("/")}
                            />

                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/50 dark:border-slate-700 dark:bg-[#1B2327] dark:hover:border-orange-500/30 dark:hover:bg-[#222C31] md:flex">
                                <div className="max-w-[120px] text-left">
                                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                        {displayName}
                                    </div>
                                </div>

                                <UserMenu
                                    userdata={appUser}
                                    handleOpenShop={(shopId) => {
                                        if (authUser) {
                                            router.push(`/dashboard/ads`);
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

                            <div className="md:hidden">
                                <UserMenu
                                    userdata={appUser}
                                    handleOpenShop={(shopId) => {
                                        if (authUser) {
                                            router.push(`/dashboard/ads`);
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


                            <MobileNav
                                userstatus={userstatus}
                                userId={resolvedUserId}
                                popup={popup}
                                user={appUser}
                                handleOpenSell={() => router.push("/create-ad")}
                                handleOpenBook={() => router.push("/bookmarks")}
                                handleOpenPlan={() => router.push("/plan")}
                                handleOpenChat={() => router.push("/profile-messages")}
                                handleOpenShop={(user: any) => {
                                    router.push(`/seller/${user._id}`);
                                }}
                                handleOpenPerfomance={() => { alert("YES"); router.push("/dashboard/ads"); }}
                                handleOpenSettings={() => router.push("/settings")}
                                handleOpenAbout={() => router.push("/about")}
                                handleOpenTerms={() => router.push("/terms")}
                                handleOpenPrivacy={() => router.push("/privacy")}
                                handleOpenSafety={() => router.push("/safety")}
                                onClose={() => router.push("/")}
                            />

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}