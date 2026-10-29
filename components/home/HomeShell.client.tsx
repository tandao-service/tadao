"use client";

import * as React from "react";
import type { HomeAd, HomeCategory, HomeRegion } from "@/lib/home/home.data";
import type { HomeCategoryNode } from "@/lib/home/home.categories";

import TopBar from "./TopBar.client";
import CategoryRail from "./CategoryRail";
import QuickChips from "./QuickChips";
import FeaturedRow from "./FeaturedRow";
import TrendingGrid from "./TrendingGrid";
import Footer from "./Footer.client";
import FeaturedRowSkeleton from "./FeaturedRowSkeleton";
import TrendingGridSkeleton from "./TrendingGridSkeleton";
import BottomNav from "@/components/home/BottomNav.client";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { useAuth } from "@/app/hooks/useAuth";

function slugify(input: string) {
    return String(input || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function stripIntent(name: string) {
    return String(name || "")
        .replace(/\s+for\s+sale\s*$/i, "")
        .replace(/\s+for\s+rent\s*$/i, "")
        .trim();
}

function detectMode(name: string): "sale" | "rent" {
    const n = String(name || "").toLowerCase();
    if (/\bfor\s+rent\b/.test(n) || /\brent\b/.test(n)) return "rent";
    if (/\bfor\s+sale\b/.test(n) || /\bsale\b/.test(n)) return "sale";
    return "sale";
}

function toListingSlugFromName(name: string) {
    const mode = detectMode(name);
    const base = stripIntent(name);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";
    return `${slugify(base)}-${suffix}`;
}

function getDefaultListingSlugFromTree(tree: any[]) {
    const first = tree?.[0];
    const name = first?.subcategories?.length ? first.subcategories[0]?.name : first?.name;
    return toListingSlugFromName(String(name || "")) || "cars-for-sale";
}

export default function HomeShell({
    categories,
    featured,
    trending,
    regions,
    categoryTree,
}: {
    categories: HomeCategory[];
    featured: HomeAd[];
    trending: HomeAd[];
    regions: HomeRegion[];
    categoryTree: HomeCategoryNode[];
}) {
    const footerRef = React.useRef<HTMLElement | null>(null);
    const { appUserId } = useAuth();
    const defaultListingSlug = React.useMemo(
        () => getDefaultListingSlugFromTree(categoryTree as any[]),
        [categoryTree]
    );
    const [packagesList, setPackagesList] = React.useState<any[]>([]);

    React.useEffect(() => {
        let mounted = true;
        const loadPackages = async () => {
            try {
                const data = (await getAllPackages()) || [];
                if (mounted) setPackagesList(data);
            } catch (error) {
                // Keep the rest of the homepage functional when packages cannot load.
                console.error("Could not load packages", error);
            }
        };
        void loadPackages();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#EBEEF2]">
            {/* Green status bar stays fixed; orange header takes its normal flow height. */}
            <TopBar
                searchProps={{
                    regions,
                    listingSlug: defaultListingSlug,
                    featured,
                    trending,
                }}
            />

            <div
                className="mx-auto w-full max-w-[1600px] bg-[#EBEEF2] px-3 pb-[calc(var(--bottomnav-h,72px)+12px)] pt-2 sm:px-5 md:pb-10 xl:px-7"

            >
                {/* The old orange hero/title has been removed: it is now the header. */}
                <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-5">
                    <aside className="hidden min-w-0 lg:block">
                        <CategoryRail
                            tree={categoryTree}
                            footerRef={footerRef}
                            topOffsetCssVar="--topbar-h"
                            topGap={12}
                            bottomGap={12}
                        />
                    </aside>

                    <div className="min-w-0 lg:hidden">
                        <CategoryRail tree={categoryTree} compact />
                    </div>

                    <section className="min-w-0 space-y-5">
                        <QuickChips packagesList={packagesList} />

                        {featured === undefined ? (
                            <FeaturedRowSkeleton />
                        ) : featured.length ? (
                            <FeaturedRow ads={featured} />
                        ) : null}

                        {trending?.length ? (
                            <TrendingGrid ads={trending} currentUserId={appUserId || ""} />
                        ) : (
                            <TrendingGridSkeleton />
                        )}
                    </section>
                </div>
            </div>

            <footer ref={footerRef} className="hidden md:block">
                <Footer />
            </footer>
            <BottomNav />
        </div>
    );
}
