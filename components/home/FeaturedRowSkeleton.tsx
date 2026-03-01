import AdCardSkeleton from "./AdCardSkeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function FeaturedRowSkeleton() {
    return (
        <div className="rounded-2xl border bg-white p-4 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
            </div>

            <ScrollArea className="mt-3 w-full">
                <div className="flex w-max gap-3 pb-2 pr-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-[240px] shrink-0">
                            <AdCardSkeleton />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </div>
    );
}