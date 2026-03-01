import AdCardSkeleton from "./AdCardSkeleton";

export default function TrendingGridSkeleton() {
    return (
        <div>
            <div className="flex items-end justify-between px-1">
                <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <AdCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}