// components/home/FeaturedRow.tsx
import type { HomeAd } from "@/lib/home/home.data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SmartPropertyCard from "./SmartPropertyCard";

export default function FeaturedRow({ ads }: { ads: HomeAd[] }) {
    if (!ads?.length) return null;

    return (
        <div className="rounded-2xl border bg-white p-4 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Featured</h2>
                <a href="/featured" className="text-sm font-bold text-orange-600 hover:underline">
                    See all
                </a>
            </div>

            <ScrollArea className="mt-3 w-full">
                <div className="flex w-max gap-3 pb-2 pr-2">
                    {ads.map((ad: any) => {
                        const key = String(ad?._id || ad?.id || "");
                        return (
                            <div key={key} className="w-[240px] shrink-0">
                                <SmartPropertyCard ad={ad} />
                            </div>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </div>
    );
}