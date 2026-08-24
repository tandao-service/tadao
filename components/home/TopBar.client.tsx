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

import {
    Loader2,
    PlusIcon,
} from "lucide-react";

function getDisplayName(
    appUser?: any,
    authUser?: any
) {
    if (
        appUser?.firstName ||
        appUser?.lastName
    ) {
        return `${appUser?.firstName ?? ""} ${appUser?.lastName ?? ""
            }`.trim();
    }

    if (appUser?.name) {
        return appUser.name;
    }

    if (appUser?.username) {
        return appUser.username;
    }

    if (authUser?.displayName) {
        return authUser.displayName;
    }

    if (authUser?.email) {
        return authUser.email.split("@")[0];
    }

    return "Account";
}

export default function TopBar() {
    const ref =
        React.useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();

    const {
        authUser,
        user: appUser,
        appUserId,
        loading,
        profileLoading,
    } = useAuth();

    const [pendingAction, setPendingAction] =
        React.useState<string | null>(
            null
        );

    const isLoggedIn = !!authUser;

    const resolvedUserId =
        appUserId || "";

    const displayName =
        getDisplayName(
            appUser,
            authUser
        );

    const showBackButton =
        pathname !== "/";

    /*
    |--------------------------------------------------------------------------
    | Popup title
    |--------------------------------------------------------------------------
    */
    const popup = React.useMemo(() => {
        if (
            pathname.startsWith(
                "/create-ad"
            )
        ) {
            return "Sell";
        }

        if (
            pathname.startsWith(
                "/bookmarks"
            ) ||
            pathname.startsWith(
                "/favorites"
            )
        ) {
            return "Bookmark";
        }

        if (
            pathname.startsWith(
                "/profile-messages"
            )
        ) {
            return "Chat";
        }

        if (
            pathname.startsWith(
                "/plan"
            )
        ) {
            return "Plan";
        }

        if (
            pathname.startsWith(
                "/settings"
            )
        ) {
            return "Profile";
        }

        if (
            pathname.startsWith(
                "/performance"
            )
        ) {
            return "Performance";
        }

        if (
            pathname.startsWith(
                "/profile"
            )
        ) {
            return "My Shop";
        }

        if (
            pathname.startsWith(
                "/admin"
            )
        ) {
            return "Admin";
        }

        return "Home";
    }, [pathname]);

    const userstatus =
        appUser?.status || "User";

    /*
    |--------------------------------------------------------------------------
    | Clear pending state once pathname changes
    |--------------------------------------------------------------------------
    */
    React.useEffect(() => {
        setPendingAction(null);
    }, [pathname]);

    /*
    |--------------------------------------------------------------------------
    | Also clear when browser restores a page
    |--------------------------------------------------------------------------
    */
    React.useEffect(() => {
        const clearPending = () => {
            setPendingAction(null);
        };

        window.addEventListener(
            "pageshow",
            clearPending
        );

        return () => {
            window.removeEventListener(
                "pageshow",
                clearPending
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Shared navigation helper
    |--------------------------------------------------------------------------
    */
    const navigate = React.useCallback(
        (
            action: string,
            href: string
        ) => {
            if (pendingAction) {
                return;
            }

            setPendingAction(action);

            router.push(href);
        },
        [
            router,
            pendingAction,
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */
    const handleGoBack =
        React.useCallback(() => {
            if (pendingAction) {
                return;
            }

            setPendingAction("back");

            if (
                typeof window !==
                "undefined" &&
                window.history.length > 1
            ) {
                router.back();
                return;
            }

            router.push("/");
        }, [
            router,
            pendingAction,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Update --topbar-h
    |--------------------------------------------------------------------------
    */
    React.useEffect(() => {
        const el = ref.current;

        if (!el) return;

        const apply = () => {
            const h =
                el.getBoundingClientRect()
                    .height;

            document.documentElement.style.setProperty(
                "--topbar-h",
                `${Math.ceil(h)}px`
            );
        };

        apply();

        const ro =
            new ResizeObserver(() =>
                apply()
            );

        ro.observe(el);

        window.addEventListener(
            "resize",
            apply
        );

        return () => {
            ro.disconnect();

            window.removeEventListener(
                "resize",
                apply
            );
        };
    }, []);

    const showUserLoading =
        loading ||
        (isLoggedIn &&
            profileLoading);

    const iconButtonClass =
        "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95 disabled:pointer-events-none disabled:opacity-70 dark:border-slate-700 dark:bg-[#1B2327] dark:text-slate-200 dark:hover:border-orange-500/30 dark:hover:bg-[#222C31] dark:hover:text-orange-300";

    return (
        <div
            ref={ref}
            className="fixed inset-x-0 top-0 z-[50] border-b border-orange-100 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#131B1E]/95"
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-4">
                {/* Left */}
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    {showBackButton ? (
                        <button
                            type="button"
                            onClick={
                                handleGoBack
                            }
                            disabled={
                                pendingAction ===
                                "back"
                            }
                            className={
                                iconButtonClass
                            }
                            aria-label="Go back"
                            title="Go back"
                        >
                            {pendingAction ===
                                "back" ? (
                                <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                            ) : (
                                <ArrowBackIosNewIcon
                                    sx={{
                                        fontSize: 18,
                                    }}
                                />
                            )}
                        </button>
                    ) : null}

                    <Link
                        href="/"
                        prefetch
                        onClick={() =>
                            setPendingAction(
                                "home"
                            )
                        }
                        className="flex min-w-0 items-center gap-2.5"
                    >
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-orange-100 bg-white shadow-sm ring-1 ring-orange-50">
                            {pendingAction ===
                                "home" ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90">
                                    <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                </div>
                            ) : null}

                            <Image
                                src="/logo.png"
                                alt="Tadao Market"
                                fill
                                className="object-contain"
                                priority
                                unoptimized
                            />
                        </div>

                        <div>
                            <div className="truncate text-sm font-extrabold leading-tight text-slate-900 dark:text-white">
                                Tadao Market
                            </div>

                            <div className="-mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                Buy & sell across
                                Kenya
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden items-center gap-2 lg:flex">
                        {/* Favorites */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <button
                                        type="button"
                                        disabled={
                                            pendingAction ===
                                            "favorites"
                                        }
                                        onClick={() => {
                                            if (
                                                authUser
                                            ) {
                                                navigate(
                                                    "favorites",
                                                    "/favorites"
                                                );
                                            } else {
                                                navigate(
                                                    "favorites",
                                                    "/auth"
                                                );
                                            }
                                        }}
                                        className={
                                            iconButtonClass
                                        }
                                    >
                                        {pendingAction ===
                                            "favorites" ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                        ) : (
                                            <BookmarkIcon fontSize="small" />
                                        )}
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent>
                                    <p>
                                        Favorites
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Messages */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <button
                                        type="button"
                                        disabled={
                                            pendingAction ===
                                            "messages"
                                        }
                                        onClick={() => {
                                            if (
                                                authUser
                                            ) {
                                                navigate(
                                                    "messages",
                                                    "/profile-messages"
                                                );
                                            } else {
                                                navigate(
                                                    "messages",
                                                    "/auth"
                                                );
                                            }
                                        }}
                                        className={`relative ${iconButtonClass}`}
                                    >
                                        {pendingAction ===
                                            "messages" ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                        ) : (
                                            <>
                                                <MessageIcon fontSize="small" />

                                                {resolvedUserId ? (
                                                    <span className="absolute -right-1 -top-1">
                                                        <Unreadmessages
                                                            userId={
                                                                resolvedUserId
                                                            }
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent>
                                    <div className="flex items-center gap-2">
                                        Chats

                                        {resolvedUserId ? (
                                            <Unreadmessages
                                                userId={
                                                    resolvedUserId
                                                }
                                            />
                                        ) : null}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Plan */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <button
                                        type="button"
                                        disabled={
                                            pendingAction ===
                                            "plan"
                                        }
                                        onClick={() =>
                                            navigate(
                                                "plan",
                                                "/plan"
                                            )
                                        }
                                        className={
                                            iconButtonClass
                                        }
                                    >
                                        {pendingAction ===
                                            "plan" ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                        ) : (
                                            <DiamondIcon fontSize="small" />
                                        )}
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent>
                                    <p>
                                        Premium
                                        Services
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* My adverts */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                >
                                    <button
                                        type="button"
                                        disabled={
                                            pendingAction ===
                                            "ads"
                                        }
                                        onClick={() =>
                                            navigate(
                                                "ads",
                                                "/dashboard/ads"
                                            )
                                        }
                                        className={
                                            iconButtonClass
                                        }
                                    >
                                        {pendingAction ===
                                            "ads" ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                        ) : (
                                            <SellOutlinedIcon />
                                        )}
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent>
                                    <p>
                                        My Adverts
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Sell */}
                        <button
                            type="button"
                            disabled={
                                pendingAction ===
                                "sell"
                            }
                            onClick={() => {
                                if (authUser) {
                                    navigate(
                                        "sell",
                                        "/create-ad"
                                    );
                                } else {
                                    navigate(
                                        "sell",
                                        "/auth?redirect_url=%2Fcreate-ad"
                                    );
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600 hover:shadow active:scale-95 disabled:pointer-events-none disabled:opacity-75"
                        >
                            {pendingAction ===
                                "sell" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <PlusIcon className="h-5 w-5" />
                            )}

                            <span>
                                {pendingAction ===
                                    "sell"
                                    ? "Opening..."
                                    : "Sell"}
                            </span>
                        </button>
                    </div>

                    {/* User loading */}
                    {showUserLoading ? (
                        <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                    ) : !isLoggedIn ? (
                        <>
                            <button
                                type="button"
                                disabled={
                                    pendingAction ===
                                    "signin"
                                }
                                onClick={() =>
                                    navigate(
                                        "signin",
                                        "/auth"
                                    )
                                }
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95 disabled:pointer-events-none disabled:opacity-70 dark:border-slate-700 dark:bg-[#1B2327] dark:text-white dark:hover:border-orange-500/30 dark:hover:bg-[#222C31]"
                            >
                                {pendingAction ===
                                    "signin" ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                        Opening...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>

                            <MobileNav
                                userstatus={
                                    userstatus
                                }
                                userId={
                                    resolvedUserId
                                }
                                popup={popup}
                                user={appUser}
                                handleOpenSell={() =>
                                    navigate(
                                        "mobile-sell",
                                        "/create-ad"
                                    )
                                }
                                handleOpenBook={() =>
                                    navigate(
                                        "mobile-book",
                                        "/bookmarks"
                                    )
                                }
                                handleOpenPlan={() =>
                                    navigate(
                                        "mobile-plan",
                                        "/plan"
                                    )
                                }
                                handleOpenChat={() =>
                                    navigate(
                                        "mobile-chat",
                                        "/profile-messages"
                                    )
                                }
                                handleOpenShop={(
                                    shopId: any
                                ) => {
                                    const id =
                                        shopId?._id ||
                                        shopId?.id ||
                                        shopId ||
                                        "";

                                    if (!id) return;

                                    navigate(
                                        "mobile-shop",
                                        `/profile/${id}`
                                    );
                                }}
                                handleOpenPerfomance={() =>
                                    navigate(
                                        "mobile-performance",
                                        "/performance"
                                    )
                                }
                                handleOpenSettings={() =>
                                    navigate(
                                        "mobile-settings",
                                        "/settings"
                                    )
                                }
                                handleOpenAbout={() =>
                                    navigate(
                                        "mobile-about",
                                        "/about"
                                    )
                                }
                                handleOpenTerms={() =>
                                    navigate(
                                        "mobile-terms",
                                        "/terms"
                                    )
                                }
                                handleOpenPrivacy={() =>
                                    navigate(
                                        "mobile-privacy",
                                        "/privacy"
                                    )
                                }
                                handleOpenSafety={() =>
                                    navigate(
                                        "mobile-safety",
                                        "/safety"
                                    )
                                }
                                onClose={() =>
                                    navigate(
                                        "mobile-home",
                                        "/"
                                    )
                                }
                            />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* Desktop user menu */}
                            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/50 dark:border-slate-700 dark:bg-[#1B2327] dark:hover:border-orange-500/30 dark:hover:bg-[#222C31] md:flex">
                                <div className="max-w-[120px] text-left">
                                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                        {
                                            displayName
                                        }
                                    </div>
                                </div>

                                <UserMenu
                                    userdata={
                                        appUser
                                    }
                                    handleOpenShop={() => {
                                        if (
                                            authUser
                                        ) {
                                            navigate(
                                                "user-ads",
                                                "/dashboard/ads"
                                            );
                                        } else {
                                            navigate(
                                                "user-auth",
                                                "/auth"
                                            );
                                        }
                                    }}
                                    handleOpenSettings={() => {
                                        if (
                                            authUser
                                        ) {
                                            navigate(
                                                "user-settings",
                                                "/settings"
                                            );
                                        } else {
                                            navigate(
                                                "user-auth",
                                                "/auth"
                                            );
                                        }
                                    }}
                                />
                            </div>

                            {/* Mobile user menu */}
                            <div className="md:hidden">
                                <UserMenu
                                    userdata={
                                        appUser
                                    }
                                    handleOpenShop={() => {
                                        if (
                                            authUser
                                        ) {
                                            navigate(
                                                "user-ads",
                                                "/dashboard/ads"
                                            );
                                        } else {
                                            navigate(
                                                "user-auth",
                                                "/auth"
                                            );
                                        }
                                    }}
                                    handleOpenSettings={() => {
                                        if (
                                            authUser
                                        ) {
                                            navigate(
                                                "user-settings",
                                                "/settings"
                                            );
                                        } else {
                                            navigate(
                                                "user-auth",
                                                "/auth"
                                            );
                                        }
                                    }}
                                />
                            </div>

                            <MobileNav
                                userstatus={
                                    userstatus
                                }
                                userId={
                                    resolvedUserId
                                }
                                popup={popup}
                                user={appUser}
                                handleOpenSell={() =>
                                    navigate(
                                        "mobile-sell",
                                        "/create-ad"
                                    )
                                }
                                handleOpenBook={() =>
                                    navigate(
                                        "mobile-book",
                                        "/favorites"
                                    )
                                }
                                handleOpenPlan={() =>
                                    navigate(
                                        "mobile-plan",
                                        "/plan"
                                    )
                                }
                                handleOpenChat={() =>
                                    navigate(
                                        "mobile-chat",
                                        "/profile-messages"
                                    )
                                }
                                handleOpenShop={(
                                    user: any
                                ) => {
                                    const id =
                                        user?._id;

                                    if (!id) return;

                                    navigate(
                                        "mobile-shop",
                                        `/seller/${id}`
                                    );
                                }}
                                handleOpenPerfomance={() =>
                                    navigate(
                                        "mobile-performance",
                                        "/dashboard/ads"
                                    )
                                }
                                handleOpenSettings={() =>
                                    navigate(
                                        "mobile-settings",
                                        "/settings"
                                    )
                                }
                                handleOpenAbout={() =>
                                    navigate(
                                        "mobile-about",
                                        "/about"
                                    )
                                }
                                handleOpenTerms={() =>
                                    navigate(
                                        "mobile-terms",
                                        "/terms"
                                    )
                                }
                                handleOpenPrivacy={() =>
                                    navigate(
                                        "mobile-privacy",
                                        "/privacy"
                                    )
                                }
                                handleOpenSafety={() =>
                                    navigate(
                                        "mobile-safety",
                                        "/safety"
                                    )
                                }
                                onClose={() =>
                                    navigate(
                                        "mobile-home",
                                        "/"
                                    )
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}