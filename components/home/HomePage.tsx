// components/home/HomePage.tsx
<<<<<<< HEAD
=======
import { Suspense } from "react";
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
import type { HomeAd, HomeCategory, HomeRegion } from "@/lib/home/home.data";
import { HomeCategoryNode } from "@/lib/home/home.categories";
import HomeShell from "./HomeShell.client";

<<<<<<< HEAD
=======
function HomeShellFallback() {
    return <div>Loading...</div>;
}
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409

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
<<<<<<< HEAD
        <HomeShell
            categories={categories}
            featured={featured}
            trending={trending}
            regions={regions}
            categoryTree={categoryTree}
        />
=======
        <Suspense fallback={<HomeShellFallback />}>
            <HomeShell
                categories={categories}
                featured={featured}
                trending={trending}
                regions={regions}
                categoryTree={categoryTree}
            />
        </Suspense>
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
    );
}