"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/app/hooks/useAuth";
import { DrawerDemo } from "@/components/shared/DrawerDemo";
import { cn } from "@/lib/utils";

type QuickItem = {
    label: string;
    icon: string;
    tone: string;
    mode: "direct" | "drawer";
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
            href: "/create-ad",
            icon: "🏷️",
            mode: "direct",
            tone:
                "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
        },
        {
            label: "Donated Items",
            icon: "💚",
            mode: "drawer",
            category: "Donations",
            subcategory: "Donated Items",
            viewHref: "/donations",
            tone:
                "from-green-50 to-green-100 border-green-200 text-green-700",
        },
        {
            label: "Auction",
            icon: "⚖️",
            mode: "drawer",
            category: "auction",
            subcategory: "bids",
            viewHref: "/auction",
            tone:
                "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
        },
        {
            label: "Lost & Found",
            icon: "🔎",
            mode: "drawer",
            category: "Lost and Found",
            subcategory: "Lost and Found Items",
            viewHref: "/lost-and-found",
            tone:
                "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {items.map((x) => {
                    const isLoading =
                        pendingAction ===
                        x.label;

                    if (
                        x.mode ===
                        "direct"
                    ) {
                        return (
                            <Link
                                key={
                                    x.label
                                }
                                href={
                                    x.href!
                                }
                                prefetch
                                aria-busy={
                                    isLoading
                                }
                                onClick={(
                                    e
                                ) =>
                                    handleDirectClick(
                                        e,
                                        x
                                    )
                                }
                                className={cn(
                                    `relative rounded-2xl border bg-gradient-to-br ${x.tone} p-4 transition hover:shadow-md`,
                                    "active:scale-[0.98]",
                                    isLoading &&
                                    "pointer-events-none ring-2 ring-orange-300"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="text-2xl">
                                        {
                                            x.icon
                                        }
                                    </div>

                                    {isLoading && (
                                        <Loader2 className="h-5 w-5 animate-spin opacity-80" />
                                    )}
                                </div>

                                <div className="mt-2 text-sm font-extrabold">
                                    {isLoading
                                        ? "Opening..."
                                        : x.label}
                                </div>

                                <div className="text-xs opacity-70">
                                    {isLoading
                                        ? "Please wait"
                                        : "Quick action"}
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={
                                x.label
                            }
                            type="button"
                            onClick={() =>
                                openDrawer(
                                    x
                                )
                            }
                            className={cn(
                                `rounded-2xl border bg-gradient-to-br ${x.tone} p-4 text-left transition hover:shadow-md`,
                                "active:scale-[0.98]"
                            )}
                        >
                            <div className="text-2xl">
                                {x.icon}
                            </div>

                            <div className="mt-2 text-sm font-extrabold">
                                {
                                    x.label
                                }
                            </div>

                            <div className="text-xs opacity-70">
                                Choose action
                            </div>
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