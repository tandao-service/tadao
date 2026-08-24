// app/[listingSlug]/loading.tsx

function SkeletonBox({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-slate-200 ${className}`}
        />
    );
}

function ListingCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* image */}
            <div className="aspect-[4/3] w-full animate-pulse bg-slate-200" />

            <div className="space-y-3 p-3">
                {/* title */}
                <SkeletonBox className="h-4 w-[88%]" />

                {/* location */}
                <SkeletonBox className="h-3 w-[62%]" />

                {/* price */}
                <SkeletonBox className="h-5 w-[48%]" />

                <div className="flex items-center justify-between pt-1">
                    <SkeletonBox className="h-3 w-16" />
                    <SkeletonBox className="h-7 w-7 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <aside className="hidden md:block">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* category */}
                <div className="border-b border-slate-100 p-4">
                    <SkeletonBox className="h-4 w-24" />

                    <div className="mt-4">
                        <SkeletonBox className="h-12 w-full" />
                    </div>
                </div>

                {/* subcategories */}
                <div className="border-b border-slate-100 p-4">
                    <SkeletonBox className="h-4 w-32" />

                    <div className="mt-4 space-y-3">
                        {Array.from({
                            length: 7,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <SkeletonBox className="h-3 w-[65%]" />
                                <SkeletonBox className="h-3 w-8" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* filters */}
                <div className="p-4">
                    <SkeletonBox className="h-4 w-20" />

                    <div className="mt-4 space-y-3">
                        <SkeletonBox className="h-11 w-full" />
                        <SkeletonBox className="h-11 w-full" />
                        <SkeletonBox className="h-11 w-full" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <SkeletonBox className="h-11 w-full" />
                        <SkeletonBox className="h-11 w-full" />
                    </div>
                </div>
            </div>
        </aside>
    );
}

function ListingHeaderSkeleton() {
    return (
        <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="px-5 py-5 sm:px-6">
                {/* heading */}
                <SkeletonBox className="h-8 w-[55%] max-w-[420px]" />

                <div className="mt-3 flex items-center gap-2">
                    <SkeletonBox className="h-3 w-24" />
                    <SkeletonBox className="h-3 w-16" />
                </div>

                {/* search */}
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_140px]">
                    <SkeletonBox className="h-14 w-full" />

                    <SkeletonBox className="h-14 w-full" />

                    <SkeletonBox className="h-14 w-full" />
                </div>

                {/* price chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {Array.from({
                        length: 5,
                    }).map((_, index) => (
                        <SkeletonBox
                            key={index}
                            className="h-9 w-24"
                        />
                    ))}
                </div>

                {/* quick category chips */}
                <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-7">
                    {Array.from({
                        length: 7,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white"
                        >
                            <SkeletonBox className="h-9 w-9 rounded-full" />

                            <SkeletonBox className="h-3 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* =====================================================
                TOP BAR PLACEHOLDER

                Keeps the top of the page occupied instead of
                showing an empty white screen while Next loads.
            ===================================================== */}
            <div className="fixed inset-x-0 top-0 z-50 h-[64px] border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
                    <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200" />

                    <div className="hidden items-center gap-3 md:flex">
                        <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
                        <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
                        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                    </div>
                </div>
            </div>

            {/* =====================================================
                PAGE
            ===================================================== */}
            <div className="pt-[calc(var(--topbar-h,64px)+12px)]">
                <main className="mx-auto max-w-[1440px] px-3 pb-8 sm:px-4 lg:px-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)]">
                        {/* sidebar */}
                        <SidebarSkeleton />

                        {/* main */}
                        <section className="min-w-0">
                            <ListingHeaderSkeleton />

                            {/* result information */}
                            <div className="mt-4 flex items-center justify-between rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                                <SkeletonBox className="h-4 w-32" />

                                <SkeletonBox className="h-12 w-36" />
                            </div>

                            {/* =================================================
                                LISTINGS

                                These are immediately visible while the
                                real Mongo/API data is loading.
                            ================================================= */}
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
                                {Array.from({
                                    length: 12,
                                }).map((_, index) => (
                                    <ListingCardSkeleton
                                        key={index}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}