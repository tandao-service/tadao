"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSparkles, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import TopBar from "@/components/home/TopBar.client";
import SmartPropertyCardWithDesc from "@/components/home/SmartPropertyCardWithDesc";

type Props = {
    initialQuery: string;
    initialRegion: string;
    initialCategory: string;
    initialPage: number;
    initialMin: string;
    initialMax: string;
    initialSort: string;
};

type SearchItem = any;

type SearchResponse = {
    items: SearchItem[];
    totalPages: number;
    total: number;
    categories?: { name: string; slug: string; count: number }[];
    regions?: { name: string; count: number }[];
};

function setQS(sp: URLSearchParams, key: string, value: string) {
    if (!value) sp.delete(key);
    else sp.set(key, value);
}

function formatLabel(value: string) {
    return value?.trim() || "";
}

export default function SearchPageClient({
    initialQuery,
    initialRegion,
    initialCategory,
    initialPage,
    initialMin,
    initialMax,
    initialSort,
}: Props) {
    const router = useRouter();

    const [query, setQuery] = React.useState(initialQuery);
    const [region, setRegion] = React.useState(initialRegion);
    const [category, setCategory] = React.useState(initialCategory);
    const min = initialMin;
    const max = initialMax;
    const [sort, setSort] = React.useState(initialSort || "recommended");

    const [items, setItems] = React.useState<SearchItem[]>([]);
    const [categories, setCategories] = React.useState<
        { name: string; slug: string; count: number }[]
    >([]);
    const [regions, setRegions] = React.useState<{ name: string; count: number }[]>([]);
    const [page, setPage] = React.useState(initialPage || 1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const runSearch = React.useCallback(
        async (nextPage = 1, nextCategory?: string, nextRegion?: string) => {
            setLoading(true);
            setError("");

            try {
                const sp = new URLSearchParams();
                setQS(sp, "query", query.trim());
                setQS(sp, "region", nextRegion ?? region);
                setQS(sp, "category", nextCategory ?? category);
                setQS(sp, "min", min);
                setQS(sp, "max", max);
                setQS(sp, "sort", sort);
                sp.set("page", String(nextPage));

                const qs = sp.toString();
                router.replace(qs ? `/search?${qs}` : "/search");

                const res = await fetch(`/api/search?${qs}`, { cache: "no-store" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json: SearchResponse = await res.json();

                setItems(Array.isArray(json.items) ? json.items : []);
                setCategories(Array.isArray(json.categories) ? json.categories : []);
                setRegions(Array.isArray(json.regions) ? json.regions : []);
                setPage(nextPage);
                setTotalPages(Number(json.totalPages || 1));
                setTotal(Number(json.total || 0));
            } catch (e: any) {
                setError(String(e?.message || e));
            } finally {
                setLoading(false);
            }
        },
        [query, region, category, min, max, sort, router]
    );

    React.useEffect(() => {
        runSearch(initialPage || 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeFilters = [
        category ? { label: category, type: "category" as const } : null,
        region ? { label: region, type: "region" as const } : null,
    ].filter(Boolean) as { label: string; type: "category" | "region" }[];

    return (
        <>
            <TopBar />

            <main className="mx-auto max-w-[1440px] px-3 pb-8 pt-[calc(var(--topbar-h,64px)+16px)] sm:px-4 lg:px-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
                    <aside className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-5 py-4">
                            <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                                Browse
                            </div>
                            <h2 className="mt-1 text-lg font-black text-slate-900">Categories</h2>
                        </div>

                        <div className="p-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setCategory("");
                                    runSearch(1, "", region);
                                }}
                                className={`mb-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-extrabold transition ${!category
                                    ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                All Categories
                            </button>

                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => {
                                            setCategory(cat.name);
                                            runSearch(1, cat.name, region);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${category === cat.name
                                            ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                                            : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span className="pr-3 font-semibold leading-5">{cat.name}</span>
                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${category === cat.name
                                                ? "bg-white text-orange-700"
                                                : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {cat.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <section className="min-w-0">
                        <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                            <div className="bg-gradient-to-r from-white via-orange-50/40 to-white px-5 py-5 sm:px-6">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-orange-700">
                                            <HiOutlineSparkles className="text-sm" />
                                            Search
                                        </div>

                                        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                            Search results for{" "}
                                            <span className="text-orange-600">&quot;{query || "All ads"}&quot;</span>
                                        </h1>

                                        <p className="mt-2 text-sm font-medium text-slate-500">
                                            {loading ? "Searching listings..." : `${total} results found across Kenya`}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[220px_minmax(0,1fr)_160px]">
                                        <div className="relative">
                                            <HiOutlineLocationMarker className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-orange-500" />
                                            <select
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                            >
                                                <option value="">All Kenya</option>
                                                {regions.map((r) => (
                                                    <option key={r.name} value={r.name}>
                                                        {r.name} ({r.count})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="relative">
                                            <IoSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                                            <input
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && runSearch(1, category, region)}
                                                placeholder="Search products, vehicles, phones, property..."
                                                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => runSearch(1, category, region)}
                                            className="h-14 rounded-2xl bg-orange-500 px-5 text-sm font-black text-white shadow-[0_10px_20px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:bg-orange-600"
                                        >
                                            Search
                                        </button>
                                    </div>

                                    {activeFilters.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-600">
                                                <HiOutlineAdjustmentsHorizontal className="text-sm" />
                                                Active Filters
                                            </div>

                                            {activeFilters.map((filter) => (
                                                <button
                                                    key={`${filter.type}-${filter.label}`}
                                                    type="button"
                                                    onClick={() => {
                                                        if (filter.type === "category") {
                                                            setCategory("");
                                                            runSearch(1, "", region);
                                                        } else {
                                                            setRegion("");
                                                            runSearch(1, category, "");
                                                        }
                                                    }}
                                                    className="rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                                                >
                                                    {formatLabel(filter.label)} ✕
                                                </button>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCategory("");
                                                    setRegion("");
                                                    runSearch(1, "", "");
                                                }}
                                                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm font-semibold text-slate-500">
                                Showing page <span className="font-black text-slate-900">{page}</span> of{" "}
                                <span className="font-black text-slate-900">{totalPages}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-sm font-black text-slate-700">Sort by:</div>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="new">Newest</option>
                                    <option value="lowest">Price: Low to High</option>
                                    <option value="highest">Price: High to Low</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={() => runSearch(1, category, region)}
                                    className="hidden rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-extrabold text-orange-700 transition hover:bg-orange-100 sm:block"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-6 text-sm font-bold text-slate-700 shadow-sm">
                                Loading search results...
                            </div>
                        ) : null}

                        {error ? (
                            <div className="mt-4 rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700 shadow-sm">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {items.map((ad: any) => (
                                <SmartPropertyCardWithDesc
                                    key={String(ad._id)}
                                    ad={ad}
                                    regionFallback="Kenya"
                                />
                            ))}
                        </div>

                        {!loading && !items.length ? (
                            <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                                <div className="text-lg font-black text-slate-900">No results found</div>
                                <p className="mt-2 text-sm font-medium text-slate-500">
                                    Try another keyword, remove a filter, or search a different region.
                                </p>
                            </div>
                        ) : null}
                    </section>
                </div>
            </main>
        </>
    );
}