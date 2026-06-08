// app/[listingSlug]/[productSlug]/lo
export default function Loading() {
    return (
        <main className="mx-auto max-w-6xl px-4 pt-[calc(var(--topbar-h,64px)+12px)] pb-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <div className="overflow-hidden rounded-[28px] border bg-white shadow-sm">
                        <div className="h-[320px] animate-pulse bg-gray-100 md:h-[420px]" />
                        <div className="p-5 md:p-6">
                            <div className="h-8 w-[70%] animate-pulse rounded bg-gray-200" />
                            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-gray-100" />
                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="rounded-2xl bg-gray-50 p-4">
                                        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                                        <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="lg:col-span-4">
                    <div className="space-y-3">
                        <div className="rounded-[28px] border bg-white p-5 shadow-sm">
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                            <div className="mt-2 h-7 w-32 animate-pulse rounded bg-gray-200" />
                        </div>

                        <div className="rounded-[28px] border bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 animate-pulse rounded-full bg-gray-100" />
                                <div className="flex-1">
                                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-12 animate-pulse rounded-2xl bg-gray-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}