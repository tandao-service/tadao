"use client";

import * as React from "react";
import SmartPropertyCardWithDesc from "@/components/home/SmartPropertyCardWithDesc";

type Props = {
    initial: any[];
    subcategory: string;
    currentAdId: string;
    regionFallback?: string;
    pageSize?: number;
};

export default function RelatedPropertiesInfinite({
    initial,
    subcategory,
    currentAdId,
    regionFallback,
    pageSize = 8,
}: Props) {
    const [items, setItems] = React.useState<any[]>(Array.isArray(initial) ? initial : []);
    const [page, setPage] = React.useState(1); // page 1 already loaded
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    // If initial is smaller than pageSize, likely no more
    React.useEffect(() => {
        if (!Array.isArray(initial) || initial.length < pageSize) setHasMore(false);
    }, [initial, pageSize]);

    const loadMore = React.useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setError(null);

        try {
            const nextPage = page + 1;

            const qs = new URLSearchParams({
                subcategory: subcategory || "",
                adId: currentAdId || "",
                page: String(nextPage),
                limit: String(pageSize),
            });

            const res = await fetch(`/api/related-ads?${qs.toString()}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error(`Failed (${res.status})`);
            }

            const data = (await res.json()) as { items?: any[] };
            const newItems = Array.isArray(data?.items) ? data.items : [];

            // de-dupe by _id
            setItems((prev) => {
                const seen = new Set(prev.map((x) => String(x?._id || "")));
                const merged = [...prev];
                for (const it of newItems) {
                    const id = String(it?._id || "");
                    if (id && !seen.has(id)) merged.push(it);
                }
                return merged;
            });

            setPage(nextPage);

            if (newItems.length < pageSize) {
                setHasMore(false);
            }
        } catch (e: any) {
            setError(e?.message || "Failed to load more.");
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, subcategory, currentAdId, pageSize]);

    // IntersectionObserver: when sentinel appears, load more
    React.useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first?.isIntersecting) loadMore();
            },
            { root: null, rootMargin: "800px 0px", threshold: 0.01 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [loadMore]);

    const title = "Related Properties";

    return (
        <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
                {subcategory ? <span className="text-xs text-gray-500">{subcategory}</span> : null}
            </div>

            {items.length > 0 ? (
                <>
<<<<<<< HEAD
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
=======
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
                        {items.map((r: any) => (
                            <SmartPropertyCardWithDesc
                                key={String(r?._id || "")}
                                ad={r}
                                regionFallback={(r?.data?.region as string) || regionFallback}
                                descLimit={90}
                            />
                        ))}
                    </div>

                    {/* status row */}
                    <div className="mt-4 flex items-center justify-center">
                        {error ? (
                            <div className="rounded-xl border bg-white px-4 py-3 text-sm text-red-600">
                                {error}{" "}
                                <button className="underline" onClick={loadMore}>
                                    Retry
                                </button>
                            </div>
                        ) : loading ? (
                            <div className="rounded-xl border bg-white px-4 py-3 text-sm text-gray-600">
                                Loading more…
                            </div>
                        ) : !hasMore ? (
                            <div className="rounded-xl border bg-white px-4 py-3 text-sm text-gray-600">
                                You’ve reached the end.
                            </div>
                        ) : (
                            <div className="rounded-xl border bg-white px-4 py-3 text-sm text-gray-600">
                                Scroll to load more…
                            </div>
                        )}
                    </div>

                    {/* sentinel */}
                    <div ref={sentinelRef} className="h-1 w-full" />
                </>
            ) : (
                <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600">No related ads found.</div>
            )}
        </section>
    );
}