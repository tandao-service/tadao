// components/home/HomeShell.client.tsx
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

    return (
        <div className="min-h-screen bg-white">
            {/* Fixed toolbar */}
            <TopBar />

            {/* Push content below fixed toolbar (TopBar sets --topbar-h) */}
            <div
                className="mx-auto max-w-6xl px-3 pb-10"
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
                    <aside className="hidden lg:block min-w-0">
                        <CategoryRail
                            tree={categoryTree}
                            footerRef={footerRef}
                            // keep a little gap under the topbar
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
                    <section className="space-y-5 min-w-0">
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
                        <RegionsGrid regions={regions} />
                    </section>
                </div>


            </div>

            {/* Footer (used as the “stop point” for the rail) */}
            <footer ref={footerRef}>
                <Footer />
            </footer>
        </div>
    );
}