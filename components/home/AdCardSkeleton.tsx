export default function AdCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-white">
            {/* Image */}
            <div className="h-[160px] w-full animate-pulse bg-slate-200" />

            {/* Content */}
            <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
            </div>
        </div>
    );
}