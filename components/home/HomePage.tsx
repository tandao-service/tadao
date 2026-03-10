// components/home/HomePage.tsx
import { Suspense } from "react";
import type { HomeAd, HomeCategory, HomeRegion } from "@/lib/home/home.data";
import { HomeCategoryNode } from "@/lib/home/home.categories";
import HomeShell from "./HomeShell.client";


export default function HomePage({
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
    return (
        <HomeShell
            categories={categories}
            featured={featured}
            trending={trending}
            regions={regions}
            categoryTree={categoryTree}
        />
    );
}