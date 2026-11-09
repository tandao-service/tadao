"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Gavel, HandHeart, Landmark, Loader2, SearchCheck, Tag, type LucideIcon } from "lucide-react";

import { useAuth } from "@/app/hooks/useAuth";
import { DrawerDemo } from "@/components/shared/DrawerDemo";
import { cn } from "@/lib/utils";

type QuickItem = {
    label: string;
    description: string;
    icon: LucideIcon;
    mode: "direct" | "drawer";
    iconBox: string;
    iconColor: string;
    cardClass: string;
    href?: string;
    category?: string;
    subcategory?: string;
    viewHref?: string;
};

type PackagePrice = {
    amount: number | string;
    period: number | string;
};

type PackageFeature = {
    title?: string;
};

type Package = {
    imageUrl?: string;
    name: string;
    _id: string;
    description?: string;
    price: PackagePrice[];
    price2?: PackagePrice[];
    features: PackageFeature[];
    color?: string;
    priority?: number;
};

type AppUser = {
    _id?: string;
    clerkId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    imageUrl?: string;
    status?: string;
    fee?: string | number;
    phone?: string;

    verified?: {
        accountverified: boolean;
        verifieddate: string | Date;
    }[];

    subscription?: {
        planId?: string | null;
        planName?: string;
        active?: boolean;
        expiresAt?: string | Date | null;
        remainingAds?: number;

        entitlements?: {
            maxListings?: number;
            priority?: number;
            topDays?: number;
            featuredDays?: number;
            autoRenewHours?: number | null;
        };
    };

    [key: string]: any;
};

export default function QuickChips({
    packagesList = [],
}: {
    packagesList?: Package[];
}) {
    const router = useRouter();

    const { user } = useAuth() as {
        user: AppUser | null;
    };

    const [drawerOpen, setDrawerOpen] =
        React.useState(false);

    const [selectedItem, setSelectedItem] =
        React.useState<QuickItem | null>(null);

    const [pendingAction, setPendingAction] =
        React.useState<string | null>(null);

    const items: QuickItem[] = [
        {
            label: "Post Ad",
            description: "Sell something today",
            icon: Tag,
            mode: "direct",
            href: "/create-ad",
            iconBox: "bg-white/20 ring-1 ring-white/25",
            iconColor: "text-white",
            cardClass: "border-orange-500 bg-gradient-to-br from-[#ff690a] via-[#ff5100] to-[#e74000] text-white shadow-orange-200/50",
        },
        {
            label: "Donated Items",
            description: "Give or find support",
            icon: HandHeart,
            mode: "drawer",
            category: "Donations",
            subcategory: "Donated Items",
            viewHref: "/donations",
            iconBox: "bg-white/20 ring-1 ring-white/25",
            iconColor: "text-white",
            cardClass: "border-emerald-500 bg-gradient-to-br from-[#20bf83] via-[#0fa86f] to-[#078451] text-white shadow-emerald-200/50",
        },
        {
            label: "Asset Financing",
            description: "Explore financing options",
            icon: Landmark,
            mode: "drawer",
            category: "Financing",
            subcategory: "Assets financing",
            // Matches toListingSlugFromName("Assets financing") in app/_ad/ad-url.ts.
            viewHref: "/financing",
            iconBox: "bg-white/20 ring-1 ring-white/25",
            iconColor: "text-white",
            cardClass: "border-cyan-500 bg-gradient-to-br from-[#19b8d5] via-[#079bc1] to-[#087b9e] text-white shadow-cyan-200/50",
        },
        {
            label: "Auction",
            description: "Browse and place bids",
            icon: Gavel,
            mode: "drawer",
            category: "auction",
            subcategory: "bids",
            viewHref: "/auction",
            iconBox: "bg-white/20 ring-1 ring-white/25",
            iconColor: "text-white",
            cardClass: "border-blue-500 bg-gradient-to-br from-[#518cf9] via-[#316be7] to-[#234ec6] text-white shadow-blue-200/50",
        },
        {
            label: "Lost & Found",
            description: "Find what matters",
            icon: SearchCheck,
            mode: "drawer",
            category: "Lost and Found",
            subcategory: "Lost and Found Items",
            viewHref: "/lost-and-found",
            iconBox: "bg-white/20 ring-1 ring-white/25",
            iconColor: "text-white",
            cardClass: "border-violet-500 bg-gradient-to-br from-[#ac70ef] via-[#8b4cd9] to-[#6e30b9] text-white shadow-violet-200/50",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Clear pending state when page becomes active again
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
    | Direct navigation
    |--------------------------------------------------------------------------
    */
    const handleDirectClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        item: QuickItem
    ) => {
        const href = item.href;

        if (!href) return;

        setPendingAction(item.label);

        if (!user) {
            e.preventDefault();

            router.push(
                `/auth?redirect_url=${encodeURIComponent(
                    href
                )}`
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Open drawer
    |--------------------------------------------------------------------------
    */
    const openDrawer = (
        item: QuickItem
    ) => {
        setPendingAction(null);
        setSelectedItem(item);
        setDrawerOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Sell / create ad
    |--------------------------------------------------------------------------
    */
    const handleOpenSell = (
        category?: string,
        subcategory?: string
    ) => {
        const href =
            category && subcategory
                ? `/create-ad?category=${encodeURIComponent(
                    category
                )}&subcategory=${encodeURIComponent(
                    subcategory
                )}`
                : "/create-ad";

        setPendingAction("drawer-sell");

        if (!user) {
            router.push(
                `/auth?redirect_url=${encodeURIComponent(
                    href
                )}`
            );

            return;
        }

        router.push(href);
    };

    /*
    |--------------------------------------------------------------------------
    | View category
    |--------------------------------------------------------------------------
    */
    const handleSubCategory = () => {
        if (!selectedItem?.viewHref) {
            return;
        }

        setPendingAction(
            "drawer-view"
        );

        router.push(
            selectedItem.viewHref
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */
    const handlePayNow = (
        id: string
    ) => {
        setPendingAction(
            `pay-${id}`
        );

        router.push(`/pay/${id}`);
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 xl:gap-4">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isLoading = pendingAction === item.label;
                    const isPrimary = item.mode === "direct";

                    const cardContents = (
                        <>
                            <div className="flex w-full items-start justify-between gap-2">
                                <span className={cn(
                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105",
                                    item.iconBox
                                )}>
                                    <Icon className={cn("h-6 w-6", item.iconColor)} strokeWidth={2} aria-hidden="true" />
                                </span>
                                <span className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                                    "bg-white/15 text-white group-hover:bg-white/25"
                                )}>
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ArrowUpRight className="h-4 w-4" />
                                    )}
                                </span>
                            </div>

                            <div className="mt-5 min-w-0">
                                <span className={cn(
                                    "block text-[15px] font-extrabold leading-5 tracking-tight sm:text-base",
                                    "text-white"
                                )}>
                                    {isLoading ? "Opening..." : item.label}
                                </span>
                                <span className={cn(
                                    "mt-1.5 block text-xs leading-5",
                                    "text-white/85"
                                )}>
                                    {isLoading ? "Please wait" : item.description}
                                </span>
                            </div>
                        </>
                    );

                    const cardClasses = cn(
                        "group relative flex min-h-[154px] w-full flex-col justify-between overflow-hidden rounded-[22px] border p-4 text-left shadow-sm transition-all duration-200",
                        "hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.99]",
                        "sm:min-h-[170px] sm:p-5",
                        item.cardClass,
                        isLoading && "pointer-events-none opacity-75"
                    );

                    if (isPrimary) {
                        return (
                            <Link
                                key={item.label}
                                href={item.href!}
                                prefetch
                                aria-busy={isLoading}
                                onClick={(e) => handleDirectClick(e, item)}
                                className={cardClasses}
                            >
                                {cardContents}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => openDrawer(item)}
                            className={cardClasses}
                        >
                            {cardContents}
                        </button>
                    );
                })}
            </div>

            {selectedItem && (
                <DrawerDemo
                    isOpen={
                        drawerOpen
                    }
                    onClose={() => {
                        setDrawerOpen(
                            false
                        );

                        setPendingAction(
                            null
                        );
                    }}
                    handleOpenSell={
                        handleOpenSell
                    }
                    handleSubCategory={
                        handleSubCategory
                    }
                    handlePayNow={
                        handlePayNow
                    }
                    userId={
                        user?._id ||
                        user?.clerkId ||
                        ""
                    }
                    user={user}
                    category={
                        selectedItem.category ||
                        ""
                    }
                    subcategory={
                        selectedItem.subcategory ||
                        ""
                    }
                    packagesList={
                        packagesList
                    }
                />
            )}

            {pendingAction &&
                pendingAction.startsWith(
                    "drawer-"
                ) && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                        <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-xl">
                            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />

                            <div>
                                <div className="text-sm font-bold text-slate-900">
                                    Opening...
                                </div>

                                <div className="text-xs text-slate-500">
                                    Please
                                    wait
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}