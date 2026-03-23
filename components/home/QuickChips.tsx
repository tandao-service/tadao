"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { DrawerDemo } from "@/components/shared/DrawerDemo";

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
    verified?: { accountverified: boolean; verifieddate: string | Date }[];
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
    const { user } = useAuth() as { user: AppUser | null };

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<QuickItem | null>(null);

    const items: QuickItem[] = [
        {
            label: "Post Ad",
            href: "/create-ad",
            icon: "🏷️",
            mode: "direct",
            tone: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
        },
        {
            label: "Donated Items",
            icon: "💚",
            mode: "drawer",
            category: "Donations",
            subcategory: "Donated Items",
            viewHref: "/donations",
            tone: "from-green-50 to-green-100 border-green-200 text-green-700",
        },
        {
            label: "Auction",
            icon: "⚖️",
            mode: "drawer",
            category: "auction",
            subcategory: "bids",
            viewHref: "/auction",
            tone: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
        },
        {
            label: "Lost & Found",
            icon: "🔎",
            mode: "drawer",
            category: "Lost and Found",
            subcategory: "Lost and Found Items",
            viewHref: "/lost-and-found",
            tone: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
        },
    ];

    const handleDirectClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        if (!user) {
            e.preventDefault();
            router.push(`/auth?redirect_url=${encodeURIComponent(href)}`);
        }
    };

    const openDrawer = (item: QuickItem) => {
        setSelectedItem(item);
        setDrawerOpen(true);
    };

    const handleOpenSell = (category?: string, subcategory?: string) => {
        const href =
            category && subcategory
                ? `/create-ad?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
                : "/create-ad";

        if (!user) {
            router.push(`/auth?redirect_url=${encodeURIComponent(href)}`);
            return;
        }

        router.push(href);
    };

    const handleSubCategory = () => {
        if (!selectedItem?.viewHref) return;
        router.push(selectedItem.viewHref);
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {items.map((x) =>
                    x.mode === "direct" ? (
                        <Link
                            key={x.label}
                            href={x.href!}
                            onClick={(e) => handleDirectClick(e, x.href!)}
                            className={`rounded-2xl border bg-gradient-to-br ${x.tone} p-4 transition hover:shadow-md`}
                        >
                            <div className="text-2xl">{x.icon}</div>
                            <div className="mt-2 text-sm font-extrabold">{x.label}</div>
                            <div className="text-xs opacity-70">Quick action</div>
                        </Link>
                    ) : (
                        <button
                            key={x.label}
                            type="button"
                            onClick={() => openDrawer(x)}
                            className={`rounded-2xl border bg-gradient-to-br ${x.tone} p-4 text-left transition hover:shadow-md`}
                        >
                            <div className="text-2xl">{x.icon}</div>
                            <div className="mt-2 text-sm font-extrabold">{x.label}</div>
                            <div className="text-xs opacity-70">Choose action</div>
                        </button>
                    )
                )}
            </div>

            {selectedItem && (
                <DrawerDemo
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    handleOpenSell={handleOpenSell}
                    handleSubCategory={handleSubCategory}
                    handlePayNow={(id: string) => router.push(`/pay/${id}`)}
                    userId={user?._id || user?.clerkId || ""}
                    user={user}
                    category={selectedItem.category || ""}
                    subcategory={selectedItem.subcategory || ""}
                    packagesList={packagesList}
                // viewHref={selectedItem.viewHref || ""}
                />
            )}
        </>
    );
}