// app/_listing/ListingPageClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SmartPropertyCard from "@/components/shared/SmartPropertyCard";
import TopBar from "@/components/home/TopBar.client";
import { cn } from "@/lib/utils";

type SidebarData = {
    subcategoryCounts: Record<string, number>;
    counties: string[];
    towns: string[];
    townsByCounty: Record<string, string[]>;
    makes: string[];
    models: string[];
    totalInCategory: number;
};

type CategoryListingItem = {
    slug: string;
    title: string;
    subcategory: string;
};

type Props = {
    title: string;
    regionLabel: string;
    canonical: string;

    basePath: string;
    activeListingSlug: string;
    regionSlug?: string;

    categoryName: string;
    categoryListings: CategoryListingItem[];
    sidebar: SidebarData;
    isVehicle: boolean;

    items: any[];
    totalPages: number;
    page: number;

    selected: {
        q: string;
        county: string;
        town: string;
        make: string;
        model: string;
        min: string;
        max: string;
        membership: string;
        sort: string;
        sortby: string;
        layout: "grid" | "list";
    };
};

function setQS(sp: URLSearchParams, key: string, value: string) {
    if (!value) sp.delete(key);
    else sp.set(key, value);
}

export default function ListingPageClient(props: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();

    // -------------------------
    // UI state (filters)
    // -------------------------
    const [layout, setLayout] = React.useState<"grid" | "list">(props.selected.layout || "grid");

    const [county, setCounty] = React.useState(props.selected.county || "");
    const [town, setTown] = React.useState(props.selected.town || "");
    const [q, setQ] = React.useState(props.selected.q || "");

    const [make, setMake] = React.useState(props.selected.make || "");
    const [model, setModel] = React.useState(props.selected.model || "");

    const [min, setMin] = React.useState(props.selected.min || "");
    const [max, setMax] = React.useState(props.selected.max || "");

    const [membership, setMembership] = React.useState(props.selected.membership || "");
    const [sort, setSort] = React.useState(props.selected.sort || "recommeded");
    const [sortby, setSortby] = React.useState(props.selected.sortby || "recommeded");

    const townsForCounty = React.useMemo(() => {
        if (!county) return props.sidebar.towns;
        return props.sidebar.townsByCounty[county] || [];
    }, [county, props.sidebar.towns, props.sidebar.townsByCounty]);

    React.useEffect(() => {
        if (!county) return;
        if (town && !townsForCounty.includes(town)) setTown("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [county]);

    const pushFilters = React.useCallback(
        (overrides: Partial<Props["selected"]> = {}) => {
            const sp = new URLSearchParams(search?.toString() || "");
            sp.set("page", "1"); // reset on filter change

            const next = {
                q,
                county,
                town,
                make,
                model,
                min,
                max,
                membership,
                sort,
                sortby,
                layout,
                ...overrides,
            };

            setQS(sp, "q", next.q);
            setQS(sp, "county", next.county);
            setQS(sp, "town", next.town);
            setQS(sp, "make", props.isVehicle ? next.make : "");
            setQS(sp, "model", props.isVehicle ? next.model : "");
            setQS(sp, "min", next.min);
            setQS(sp, "max", next.max);
            setQS(sp, "membership", next.membership);

            setQS(sp, "sort", next.sort);
            setQS(sp, "sortby", next.sortby);
            setQS(sp, "layout", next.layout);

            const qs = sp.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname);
        },
        [
            county,
            layout,
            make,
            max,
            membership,
            min,
            model,
            pathname,
            props.isVehicle,
            q,
            router,
            search,
            sort,
            sortby,
            town,
        ]
    );

    const clearAll = () => router.replace(props.basePath);

    // -------------------------
    // ✅ Infinite scroll state
    // -------------------------
    const [allItems, setAllItems] = React.useState<any[]>(props.items || []);
    const [currentPage, setCurrentPage] = React.useState<number>(props.page || 1);
    const [totalPages, setTotalPages] = React.useState<number>(props.totalPages || 1);

    const [loadingMore, setLoadingMore] = React.useState(false);
    const [loadError, setLoadError] = React.useState<string>("");

    React.useEffect(() => {
        setAllItems(props.items || []);
        setCurrentPage(props.page || 1);
        setTotalPages(props.totalPages || 1);
        setLoadError("");
    }, [props.items, props.page, props.totalPages, props.activeListingSlug]);

    const sentinelRef = React.useRef<HTMLDivElement | null>(null);
    const canLoadMore = currentPage < totalPages && !loadingMore;

    const fetchNextPage = React.useCallback(async () => {
        if (!canLoadMore) return;
        setLoadingMore(true);
        setLoadError("");

        try {
            const sp = new URLSearchParams(search?.toString() || "");
            const nextPage = currentPage + 1;

            sp.set("page", String(nextPage));
            sp.set("limit", "24");
            sp.set("listingSlug", props.activeListingSlug);
            if (props.regionSlug) sp.set("regionSlug", props.regionSlug);

            const res = await fetch(`/api/listings?${sp.toString()}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            const newItems = Array.isArray(json?.items) ? json.items : [];
            const tp = Number(json?.totalPages || totalPages);

            setAllItems((prev) => [...prev, ...newItems]);
            setCurrentPage(nextPage);
            setTotalPages(tp);
        } catch (e: any) {
            setLoadError(String(e?.message || e));
        } finally {
            setLoadingMore(false);
        }
    }, [canLoadMore, currentPage, props.activeListingSlug, props.regionSlug, search, totalPages]);

    React.useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((x) => x.isIntersecting)) fetchNextPage();
            },
            { root: null, rootMargin: "900px", threshold: 0.01 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [fetchNextPage]);

    return (
        <>
            <TopBar />

            <div className="pt-[calc(var(--topbar-h,64px)+12px)]">
                <main className="mx-auto max-w-7xl p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
                        {/* LEFT */}
                        <aside className="space-y-3">
                            <div className="rounded-2xl border bg-white p-3 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="text-sm font-extrabold">{props.categoryName}</div>
                                    <div className="text-xs font-bold text-slate-500">
                                        {Number(props.sidebar.totalInCategory || 0).toLocaleString()} ads
                                    </div>
                                </div>

                                <div className="max-h-[420px] overflow-auto pr-1">
                                    {props.categoryListings.map((it) => {
                                        const active = it.slug.toLowerCase() === props.activeListingSlug.toLowerCase();
                                        const count = props.sidebar.subcategoryCounts?.[it.subcategory] ?? 0;

                                        const sp = new URLSearchParams(search?.toString() || "");
                                        sp.set("page", "1");
                                        const qs = sp.toString();
                                        const href = qs ? `/${it.slug}?${qs}` : `/${it.slug}`;

                                        return (
                                            <Link
                                                key={it.slug}
                                                href={href}
                                                className={cn(
                                                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
                                                    "hover:bg-orange-50",
                                                    active
                                                        ? "bg-orange-50 font-extrabold text-orange-700 ring-1 ring-orange-200"
                                                        : "text-slate-700"
                                                )}
                                            >
                                                <span className="min-w-0 truncate">{it.title}</span>
                                                <span className={cn("ml-2 text-xs font-bold", active ? "text-orange-700" : "text-slate-500")}>
                                                    {Number(count).toLocaleString()}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-white p-3 shadow-sm">
                                <div className="text-sm font-extrabold">Filters</div>

                                <div className="mt-2 space-y-3">
                                    <div>
                                        <div className="mb-1 text-xs font-extrabold text-slate-700">Price (KSh)</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                value={min}
                                                onChange={(e) => setMin(e.target.value)}
                                                placeholder="min"
                                                inputMode="numeric"
                                                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                            />
                                            <input
                                                value={max}
                                                onChange={(e) => setMax(e.target.value)}
                                                placeholder="max"
                                                inputMode="numeric"
                                                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                            />
                                        </div>
                                    </div>

                                    {props.isVehicle && (
                                        <>
                                            <div>
                                                <div className="mb-1 text-xs font-extrabold text-slate-700">Make</div>
                                                <select
                                                    value={make}
                                                    onChange={(e) => setMake(e.target.value)}
                                                    className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                                >
                                                    <option value="">Any</option>
                                                    {props.sidebar.makes.map((m) => (
                                                        <option key={m} value={m}>
                                                            {m}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <div className="mb-1 text-xs font-extrabold text-slate-700">Model</div>
                                                <select
                                                    value={model}
                                                    onChange={(e) => setModel(e.target.value)}
                                                    className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                                >
                                                    <option value="">Any</option>
                                                    {props.sidebar.models.map((m) => (
                                                        <option key={m} value={m}>
                                                            {m}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <div className="mb-1 text-xs font-extrabold text-slate-700">Verified sellers</div>
                                        <select
                                            value={membership}
                                            onChange={(e) => setMembership(e.target.value)}
                                            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                        >
                                            <option value="">Show all</option>
                                            <option value="verified">Verified</option>
                                            <option value="unverified">Unverified</option>
                                        </select>
                                    </div>

                                    <div>
                                        <div className="mb-1 text-xs font-extrabold text-slate-700">Sort</div>
                                        <select
                                            value={sortby}
                                            onChange={(e) => setSortby(e.target.value)}
                                            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                        >
                                            <option value="recommeded">Recommended</option>
                                            <option value="new">Newest</option>
                                            <option value="lowest">Price: Low to High</option>
                                            <option value="highest">Price: High to Low</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() =>
                                            pushFilters({
                                                county,
                                                town,
                                                q,
                                                min,
                                                max,
                                                membership,
                                                make,
                                                model,
                                                sort,
                                                sortby,
                                                layout,
                                            })
                                        }
                                        className="w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-orange-600"
                                    >
                                        Apply filters
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT */}
                        <section className="min-w-0">
                            {/* ✅ This RIGHT header card matches your screenshot */}
                            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h1 className="truncate text-2xl font-extrabold">{props.title} in {props.regionLabel}</h1>
                                        <a className="mt-1 inline-block text-sm text-slate-600 underline" href={props.canonical}>
                                            Canonical
                                        </a>
                                    </div>
                                </div>

                                {/* Search row */}
                                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr_110px]">
                                    <select
                                        value={county}
                                        onChange={(e) => {
                                            setCounty(e.target.value);
                                            setTown("");
                                        }}
                                        className="h-12 w-full rounded-xl border px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200"
                                    >
                                        <option value="">All Kenya</option>
                                        {props.sidebar.counties.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Search keywords..."
                                        className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                    />

                                    <button
                                        onClick={() => pushFilters({ county, town, q })}
                                        className="h-12 rounded-xl bg-orange-500 px-4 text-sm font-extrabold text-white hover:bg-orange-600"
                                    >
                                        Search
                                    </button>
                                </div>

                                {/* Town row */}
                                <div className="mt-2">
                                    <select
                                        value={town}
                                        onChange={(e) => setTown(e.target.value)}
                                        className="h-12 w-full rounded-xl border px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-200"
                                    >
                                        <option value="">{county ? "Any town / area" : "Select county first (optional)"}</option>
                                        {townsForCounty.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Layout + Clear row */}
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setLayout("grid");
                                                pushFilters({ layout: "grid" });
                                            }}
                                            className={cn(
                                                "rounded-xl border px-4 py-2 text-sm font-extrabold",
                                                layout === "grid"
                                                    ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                                    : "bg-white text-slate-700 hover:bg-orange-50"
                                            )}
                                        >
                                            Grid layout
                                        </button>

                                        <button
                                            onClick={() => {
                                                setLayout("list");
                                                pushFilters({ layout: "list" });
                                            }}
                                            className={cn(
                                                "rounded-xl border px-4 py-2 text-sm font-extrabold",
                                                layout === "list"
                                                    ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                                    : "bg-white text-slate-700 hover:bg-orange-50"
                                            )}
                                        >
                                            List layout
                                        </button>
                                    </div>

                                    <button
                                        onClick={clearAll}
                                        className="rounded-xl border px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-orange-50"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Results grid */}
                            <div
                                className={cn(
                                    "mt-4 gap-4",
                                    layout === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                                        : "grid grid-cols-1"
                                )}
                            >
                                {allItems.map((ad: any) => (
                                    <SmartPropertyCard key={String(ad._id)} ad={ad} regionFallback={props.regionLabel} />
                                ))}
                            </div>

                            {/* Infinite scroll sentinel */}
                            <div ref={sentinelRef} className="h-1" />

                            <div className="mt-4 flex items-center justify-center">
                                {loadingMore ? (
                                    <div className="rounded-xl border bg-white px-4 py-2 text-sm font-bold text-slate-700">
                                        Loading more…
                                    </div>
                                ) : null}

                                {!loadingMore && currentPage >= totalPages ? (
                                    <div className="rounded-xl border bg-white px-4 py-2 text-sm font-bold text-slate-700">
                                        You’ve reached the end
                                    </div>
                                ) : null}
                            </div>

                            {loadError ? (
                                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    Failed to load more: {loadError}{" "}
                                    <button className="underline" onClick={() => location.reload()}>
                                        Refresh
                                    </button>
                                </div>
                            ) : null}
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}