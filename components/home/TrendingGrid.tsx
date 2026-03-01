// components/home/TrendingGrid.tsx
import type { HomeAd } from "@/lib/home/home.data";
import AdCard from "./AdCard";

export default function TrendingGrid({ ads }: { ads: HomeAd[] }) {
    return (
        <div>
            <div className="flex items-end justify-between px-1">
                <h2 className="text-2xl font-extrabold">Trending Ads</h2>
                <a href="/trending" className="text-sm font-bold text-orange-600 hover:underline">
                    View more
                </a>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {ads.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                ))}
            </div>
        </div>
    );
}