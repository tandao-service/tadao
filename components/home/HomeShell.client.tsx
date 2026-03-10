"use client";

import * as React from "react";
import type { HomeAd, HomeCategory, HomeRegion } from "@/lib/home/home.data";
import { HomeCategoryNode } from "@/lib/home/home.categories";

import TopBar from "./TopBar.client";
import HeroSearchBar from "./HeroSearchBar.client";
import CategoryRail from "./CategoryRail";
import QuickChips from "./QuickChips";
import FeaturedRow from "./FeaturedRow";
import TrendingGrid from "./TrendingGrid";
import RegionsGrid from "./RegionsGrid";
import Footer from "./Footer.client";
import FeaturedRowSkeleton from "./FeaturedRowSkeleton";
import TrendingGridSkeleton from "./TrendingGridSkeleton";

import BottomNav from "@/components/home/BottomNav.client";
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
    const name =
        first?.subcategories?.length ? first.subcategories[0]?.name : first?.name;

    const computed = toListingSlugFromName(String(name || ""));
    // safe fallback if tree is empty
    return computed || "cars-for-sale";
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
    const defaultListingSlug = React.useMemo(
        () => getDefaultListingSlugFromTree(categoryTree as any[]),
        [categoryTree]
    );
    return (
        <div className="min-h-screen bg-white">
            {/* Fixed toolbar */}
            <TopBar />

            {/* Push content below fixed toolbar (TopBar sets --topbar-h) */}
            <div
                className="mx-auto max-w-6xl px-3 pb-[calc(var(--bottomnav-h,72px)+12px)] md:pb-10"
                style={{ paddingTop: "var(--topbar-h, 64px)" }}
            >
                {/* HERO */}
                <div className="relative mt-3 overflow-hidden rounded-2xl border bg-gradient-to-r from-orange-500 via-orange-500 to-orange-400">
                    <div className="absolute inset-0 opacity-25">
                        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,.35),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,.25),transparent_45%)]" />
                    </div>

                    <div className="relative p-5 sm:p-8">
                        <div className="text-white">
                            <div className="text-sm font-semibold opacity-95">Tadao Market</div>
                            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                What are you looking for?
                            </h1>
                            <p className="mt-1 text-sm opacity-90">
                                Buy & sell across Kenya — promoted ads first, then trending.
                            </p>
                        </div>

                        <div className="mt-5">
                            <HeroSearchBar />
                        </div>
                    </div>
                </div>

                {/* GRID */}
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
                    {/* LEFT (desktop) */}
                    <aside className="hidden min-w-0 lg:block">
                        <CategoryRail
                            tree={categoryTree}
                            footerRef={footerRef}
                            topOffsetCssVar="--topbar-h"
                            topGap={12}
                            bottomGap={12}
                        />
                    </aside>

                    {/* Mobile categories */}
                    <div className="mt-4 lg:hidden">
                        <CategoryRail tree={categoryTree} compact />
                    </div>

                    {/* MAIN */}
                    <section className="min-w-0 space-y-5">
                        <QuickChips />

                        {featured === undefined ? (
                            <FeaturedRowSkeleton />
                        ) : featured.length ? (
                            <FeaturedRow ads={featured} />
                        ) : null}

                        {/* Trending */}
                        {trending?.length ? (
                            <TrendingGrid ads={trending} />
                        ) : (
                            <TrendingGridSkeleton />
                        )}

                        <RegionsGrid regions={regions} listingSlug={defaultListingSlug} />
                    </section>
                </div>
            </div>

            {/* Footer: hide on mobile, show on md+ (also keeps rail stop point on desktop) */}
            <footer ref={footerRef} className="hidden md:block">
                <Footer />
            </footer>

            {/* ✅ Mobile-only bottom tabs */}
            <BottomNav />
        </div>
    );
}