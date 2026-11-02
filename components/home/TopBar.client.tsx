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
import UserMenu from "@/components/shared/UserMenu";
import { useAuth } from "@/app/hooks/useAuth";
import Unreadmessages from "../shared/Unreadmessages";
import MobileNav from "../shared/MobileNav";
import { Loader2, PlusIcon, UserRound } from "lucide-react";
import HeroSearchBar from "./HeroSearchBar.client";

// Search parameters are exactly those accepted by the existing component.
// This way we keep its location, keyword, and ad search logic untouched.
type TopBarProps = {
    searchProps?: React.ComponentProps<typeof HeroSearchBar>;
};

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

export default function TopBar({ searchProps }: TopBarProps) {
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

    // Only the homepage displays the orange search/branding section.
    const isHomeRoute = pathname === "/";

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

            // Only the green status bar remains visible when the page scrolls.
            // Keep the existing variable for sticky rails and mobile back controls.
            document.documentElement.style.setProperty("--topbar-h", `${Math.ceil(h)}px`);
            document.documentElement.style.setProperty("--statusbar-h", `${Math.ceil(h)}px`);
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

    const utilityIconClass =
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/15 hover:text-white disabled:opacity-60 lg:h-12 lg:w-12";

    const openSell = () => {
        navigate(
            "sell",
            isLoggedIn
                ? "/create-ad"
                : "/auth?redirect_url=%2Fcreate-ad"
        );
    };

    // Reuse the existing user menu and mobile navigation instead of
    // replacing their account, chat, premium, or seller functionality.
    const openUserAds = () =>
        navigate("user-ads", isLoggedIn ? "/dashboard/ads" : "/auth");
    const openUserSettings = () =>
        navigate("user-settings", isLoggedIn ? "/settings" : "/auth");

    // Keep mobile navigation available on every route, including when the
    // large orange header is intentionally hidden.
    const mobileNavigation = (
        <MobileNav
            userstatus={userstatus}
            userId={resolvedUserId}
            popup={popup}
            user={appUser}
            handleOpenSell={() =>
                navigate("mobile-sell", isLoggedIn ? "/create-ad" : "/auth?redirect_url=%2Fcreate-ad")
            }
            handleOpenBook={() =>
                navigate("mobile-book", isLoggedIn ? "/favorites" : "/auth")
            }
            handleOpenPlan={() => navigate("mobile-plan", "/plan")}
            handleOpenChat={() =>
                navigate("mobile-chat", isLoggedIn ? "/profile-messages" : "/auth")
            }
            handleOpenShop={(item: any) => {
                const id = item?._id || item?.id || item || "";
                if (!id) return;
                navigate("mobile-shop", isLoggedIn ? `/seller/${id}` : `/profile/${id}`);
            }}
            handleOpenPerfomance={() => navigate("mobile-performance", "/performance")}
            handleOpenSettings={() => navigate("mobile-settings", isLoggedIn ? "/settings" : "/auth")}
            handleOpenAbout={() => navigate("mobile-about", "/about")}
            handleOpenTerms={() => navigate("mobile-terms", "/terms")}
            handleOpenPrivacy={() => navigate("mobile-privacy", "/privacy")}
            handleOpenSafety={() => navigate("mobile-safety", "/safety")}
            onClose={() => navigate("mobile-home", "/")}
        />
    );

    return (
        <header className="relative z-[50] w-full shadow-sm">
            {/* Fixed orange status bar with permanent branding. */}
            <div ref={ref} className="fixed inset-x-0 top-0 z-[50] bg-[#FF5108] text-white">
                <div className="mx-auto flex h-[62px] w-full max-w-[1600px] items-center justify-between gap-2 px-3 sm:h-[70px] sm:px-5 lg:h-[80px] xl:px-7">
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
                        {!isHomeRoute && (
                            <button
                                type="button"
                                aria-label="Go back"
                                title="Go back"
                                disabled={!!pendingAction}
                                onClick={handleGoBack}
                                className="inline-flex h-8 w-7 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-60 sm:w-8"
                            >
                                {pendingAction === "back" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
                                )}
                            </button>
                        )}
                        <Link
                            href="/"
                            prefetch
                            aria-label="Tadao Market home"
                            onClick={() => { if (!isHomeRoute) setPendingAction("home"); }}
                            className="flex min-w-0 items-center gap-2 sm:gap-3"
                        >
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-white sm:h-[54px] sm:w-[54px] lg:h-[60px] lg:w-[60px]">
                                <Image
                                    src="/logo.png"
                                    alt="Tadao Market logo"
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 60px, (min-width: 640px) 54px, 44px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="min-w-0">
                                <strong className="block truncate text-[16px] font-extrabold leading-tight tracking-tight sm:text-[22px] lg:text-[26px]">
                                    Tadao Market
                                </strong>
                                <span className="block truncate text-[10px] font-semibold leading-snug text-white/90 sm:text-[13px] lg:text-[15px]">
                                    Buy &amp; sell across Kenya
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                        {/* Keep all four desktop shortcuts, now in the status bar. */}
                        <nav aria-label="Quick links" className="hidden items-center gap-1 lg:flex">
                            <button
                                type="button"
                                title="Favorites"
                                aria-label="Favorites"
                                className={utilityIconClass}
                                disabled={!!pendingAction}
                                onClick={() => navigate("favorites", isLoggedIn ? "/favorites" : "/auth")}
                            >
                                <BookmarkIcon sx={{ fontSize: 24 }} />
                            </button>
                            <button
                                type="button"
                                title="Chats"
                                aria-label="Chats"
                                className={utilityIconClass}
                                disabled={!!pendingAction}
                                onClick={() => navigate("messages", isLoggedIn ? "/profile-messages" : "/auth")}
                            >
                                <MessageIcon sx={{ fontSize: 24 }} />
                                {resolvedUserId ? (
                                    <span className="absolute -right-1 -top-1">
                                        <Unreadmessages userId={resolvedUserId} />
                                    </span>
                                ) : null}
                            </button>
                            <button
                                type="button"
                                title="Premium Services"
                                aria-label="Premium Services"
                                className={utilityIconClass}
                                disabled={!!pendingAction}
                                onClick={() => navigate("plan", "/plan")}
                            >
                                <DiamondIcon sx={{ fontSize: 24 }} />
                            </button>
                            <button
                                type="button"
                                title="My Adverts"
                                aria-label="My Adverts"
                                className={utilityIconClass}
                                disabled={!!pendingAction}
                                onClick={() => navigate("ads", isLoggedIn ? "/dashboard/ads" : "/auth")}
                            >
                                <SellOutlinedIcon sx={{ fontSize: 24 }} />
                            </button>
                            {!isHomeRoute ? (
                                <button
                                    type="button"
                                    onClick={openSell}
                                    disabled={!!pendingAction}
                                    className="ml-2 inline-flex h-8 items-center gap-1 rounded-lg bg-white px-3 text-xs font-extrabold text-[#087D43] transition hover:bg-emerald-50 disabled:opacity-60"
                                >
                                    <PlusIcon className="h-3.5 w-3.5" /> Sell
                                </button>
                            ) : null}
                            <span className="mx-2 h-5 w-px bg-white/30" />
                        </nav>

                        {showUserLoading ? (
                            <span className="inline-flex h-7 w-28 animate-pulse rounded-md bg-white/20" />
                        ) : !isLoggedIn ? (
                            <button
                                type="button"
                                onClick={() => navigate("signin", "/auth")}
                                disabled={!!pendingAction}
                                className="inline-flex items-center gap-1 rounded-lg px-1.5 py-2 text-[11px] font-semibold text-white transition hover:bg-white/15 sm:gap-2 sm:px-3 sm:text-sm lg:text-base"
                            >
                                {pendingAction === "signin" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <UserRound className="h-4 w-4" />
                                )}
                                Login / Register
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="hidden max-w-[145px] truncate text-xs font-semibold text-white/95 sm:inline">
                                    {displayName}
                                </span>
                                <div className="rounded-full bg-white px-1 py-0.5 text-slate-900">
                                    <UserMenu
                                        userdata={appUser}
                                        handleOpenShop={openUserAds}
                                        handleOpenSettings={openUserSettings}
                                    />
                                </div>
                            </div>
                        )}
                        {!isHomeRoute ? (
                            <div className="lg:hidden [&_button]:!border-white/40">
                                {mobileNavigation}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Space for the fixed status bar, so the orange header starts below it. */}
            <div aria-hidden="true" className="h-[62px] sm:h-[70px] lg:h-[80px]" />

            {/* Homepage search header only; branding stays in the fixed status bar. */}
            {isHomeRoute ? (
                <div className="relative bg-[#FF5108] text-white">
                    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-center lg:gap-4 lg:py-6">
                        {/* One search instance, retaining its existing search behaviour. */}
                        {searchProps ? (
                            <div className="min-w-0 w-full text-slate-900 lg:max-w-[900px] lg:flex-1 [&>div]:min-w-0 [&>div]:w-full [&_form]:min-w-0 [&_form]:w-full [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400 [&_select]:text-slate-900">
                                <HeroSearchBar {...searchProps} />
                            </div>
                        ) : (
                            <div className="min-w-0 flex-1 text-center text-lg font-semibold text-white/90">
                                Explore listings from sellers across Kenya
                            </div>
                        )}

                        {/* Sell and mobile menu remain available on the homepage. */}
                        <div className="flex shrink-0 items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={openSell}
                                disabled={!!pendingAction}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 font-extrabold text-[#EF4B08] shadow-sm transition hover:bg-orange-50 hover:shadow-md active:scale-[.98] disabled:opacity-70 sm:h-[52px] lg:h-[58px] lg:w-[160px] lg:text-base"
                            >
                                {pendingAction === "sell" ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <PlusIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                                )}
                                Sell
                            </button>
                            <div className="lg:hidden [&_button]:!border-white/40">
                                {mobileNavigation}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </header>
    );
}
