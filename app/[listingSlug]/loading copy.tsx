// app/[listingSlug]/loading.tsx
export default function Loading() {
    return (
        <main className="mx-auto max-w-7xl p-4">
            {/* TopBar spacer (matches ListingPageClient pt calc) */}
            <div className="h-[calc(var(--topbar-h,64px)+12px)]" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
                {/* ✅ LEFT: sidebar skeleton (DESKTOP ONLY) */}
                <aside className="hidden md:block space-y-3">
                    {/* Category list card */}
                    <div className="rounded-2xl border bg-white p-3 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
                        </div>

                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl px-3 py-2"
                                >
                                    <div className="h-3 w-44 animate-pulse rounded bg-gray-200" />
                                    <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filters card */}
                    <div className="rounded-2xl border bg-white p-3 shadow-sm">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

                        <div className="mt-4 space-y-4">
                            {/* Price */}
                            <div>
                                <div className="mb-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                                    <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <div className="mb-2 h-3 w-20 animate-pulse rounded bg-gray-200" />
                                <div className="space-y-2">
                                    <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                                    <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                                </div>
                            </div>

                            {/* Verified sellers */}
                            <div>
                                <div className="mb-2 h-3 w-28 animate-pulse rounded bg-gray-200" />
                                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                            </div>

                            {/* Sort */}
                            <div>
                                <div className="mb-2 h-3 w-16 animate-pulse rounded bg-gray-200" />
                                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                            </div>

                            {/* Apply + Clear */}
                            <div className="h-12 animate-pulse rounded-xl bg-gray-200" />
                            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                        </div>
                    </div>
                </aside>

                {/* ✅ RIGHT: header + search + results skeleton */}
                <section className="min-w-0">
                    {/* Header + search card skeleton */}
                    <div className="rounded-2xl border bg-white p-4 shadow-sm">
                        {/* Title + canonical */}
                        <div className="h-6 w-[80%] max-w-[520px] animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-200" />

                        {/* Search row */}
                        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr_110px]">
                            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                            <div className="h-12 animate-pulse rounded-xl bg-gray-200" />
                        </div>

                        {/* ✅ Mobile: filters + layout row skeleton (like your real UI) */}
                        <div className="mt-3 flex items-center justify-between gap-2 md:hidden">
                            <div className="h-12 w-[55%] animate-pulse rounded-xl bg-gray-100" />
                            <div className="flex items-center gap-2">
                                <div className="h-12 w-20 animate-pulse rounded-xl bg-gray-100" />
                                <div className="h-12 w-20 animate-pulse rounded-xl bg-gray-100" />
                            </div>
                        </div>

                        {/* ✅ Desktop: layout + clear row skeleton */}
                        <div className="mt-3 hidden md:flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />
                                <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />
                            </div>
                            <div className="h-10 w-20 animate-pulse rounded-xl bg-gray-100" />
                        </div>
                    </div>

                    {/* ✅ Cards skeleton
              - mobile: 2 per row
              - desktop: up to 4 per row
          */}
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                            >
                                {/* image */}
                                <div className="h-32 w-full animate-pulse bg-gray-100 sm:h-40" />
                                {/* text */}
                                <div className="p-3">
                                    <div className="h-4 w-[80%] animate-pulse rounded bg-gray-200" />
                                    <div className="mt-2 h-3 w-[60%] animate-pulse rounded bg-gray-200" />
                                    <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}