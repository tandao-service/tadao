// app/_listing/ListingPageClient.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TopBar from "@/components/home/TopBar.client";
import { cn } from "@/lib/utils";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import SmartPropertyCardWithDesc from "@/components/home/SmartPropertyCardWithDesc";

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
    icon?: string;
};

type Props = {
    title: string;
    regionLabel: string;
    canonical: string;

    basePath: string; // initial path for this page load
    activeListingSlug: string; // initial slug for this page load
    regionSlug?: string;

    categoryName: string;
    categoryListings: CategoryListingItem[];
    sidebar: SidebarData;
    isVehicle: boolean;

    items: any[];
    totalPages: number;
    page: number;

    homeCountsBySub: Record<string, number>;
    homeTotalInCategory: number;

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

function IconBubble({ src, alt }: { src?: string; alt: string }) {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200">
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt} className="h-6 w-6 object-contain" loading="lazy" />
            ) : (
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-100" />
            )}
        </div>
    );
}

function getSlugFromPathname(pathname: string) {
    // supports /r/region/slug OR /slug
    const parts = String(pathname || "")
        .split("?")[0]
        .split("#")[0]
        .split("/")
        .filter(Boolean);

    if (!parts.length) return "";
    return parts[parts.length - 1]; // last segment is slug
}

export default function ListingPageClient(props: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();

    // ✅ IMPORTANT:
    // we keep our own "activeSlug" so sidebar doesn't depend on server props changing.
    const [activeSlug, setActiveSlug] = React.useState(props.activeListingSlug);
    const [activeTitle, setActiveTitle] = React.useState(props.title);

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
        return props.sidebar.townsByCounty?.[county] || [];
    }, [county, props.sidebar.towns, props.sidebar.townsByCounty]);

    React.useEffect(() => {
        if (!county) return;
        if (town && !townsForCounty.includes(town)) setTown("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [county]);

    // -------------------------
    // ✅ Items state (grid only updates)
    // -------------------------
    const [allItems, setAllItems] = React.useState<any[]>(props.items || []);
    const [currentPage, setCurrentPage] = React.useState<number>(props.page || 1);
    const [tp, setTp] = React.useState<number>(props.totalPages || 1);

    const [loadingMore, setLoadingMore] = React.useState(false);
    const [switchingSlug, setSwitchingSlug] = React.useState(false);
    const [loadError, setLoadError] = React.useState<string>("");

    // If the user hard-refreshes on a different slug (because we pushState),
    // server will pass that slug as props.activeListingSlug.
    // But during client switching we DON'T want sidebar to reset.
    React.useEffect(() => {
        // only sync once on first mount OR when server actually loads a new slug (hard refresh)
        setActiveSlug(props.activeListingSlug);
        setActiveTitle(props.title);
        setAllItems(props.items || []);
        setCurrentPage(props.page || 1);
        setTp(props.totalPages || 1);
        setLoadError("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.activeListingSlug]);

    // -------------------------
    // ✅ URL builder for pushState (no Next navigation)
    // -------------------------
    const buildHrefForSlug = React.useCallback(
        (slug: string) => {
            const sp = new URLSearchParams(search?.toString() || "");
            sp.set("page", "1"); // reset page when changing slug

            // keep current filters in URL (so refresh keeps them)
            setQS(sp, "q", q);
            setQS(sp, "county", county);
            setQS(sp, "town", town);
            setQS(sp, "min", min);
            setQS(sp, "max", max);
            setQS(sp, "membership", membership);
            setQS(sp, "sort", sort);
            setQS(sp, "sortby", sortby);
            setQS(sp, "layout", layout);
            setQS(sp, "make", props.isVehicle ? make : "");
            setQS(sp, "model", props.isVehicle ? model : "");

            // URL path (matches your route)
            const path = props.regionSlug ? `/r/${props.regionSlug}/${slug}` : `/${slug}`;
            const qs = sp.toString();
            return qs ? `${path}?${qs}` : path;
        },
        [
            search,
            q,
            county,
            town,
            min,
            max,
            membership,
            sort,
            sortby,
            layout,
            make,
            model,
            props.isVehicle,
            props.regionSlug,
        ]
    );

    // -------------------------
    // ✅ Fetch items for a slug (only updates grid)
    // -------------------------
    const fetchItemsForSlug = React.useCallback(
        async (slug: string) => {
            setSwitchingSlug(true);
            setLoadError("");

            try {
                const sp = new URLSearchParams(search?.toString() || "");

                // keep filters
                sp.set("page", "1");
                sp.set("limit", "24");
                sp.set("listingSlug", slug);
                if (props.regionSlug) sp.set("regionSlug", props.regionSlug);

                setQS(sp, "q", q);
                setQS(sp, "county", county);
                setQS(sp, "town", town);
                setQS(sp, "min", min);
                setQS(sp, "max", max);
                setQS(sp, "membership", membership);
                setQS(sp, "sort", sort);
                setQS(sp, "sortby", sortby);
                setQS(sp, "layout", layout);
                setQS(sp, "make", props.isVehicle ? make : "");
                setQS(sp, "model", props.isVehicle ? model : "");

                const res = await fetch(`/api/listings?${sp.toString()}`, { cache: "no-store" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();

                const newItems = Array.isArray(json?.items) ? json.items : [];
                const nextTotalPages = Number(json?.totalPages || 1);

                setAllItems(newItems);
                setCurrentPage(1);
                setTp(nextTotalPages);
            } catch (e: any) {
                setLoadError(String(e?.message || e));
            } finally {
                setSwitchingSlug(false);
            }
        },
        [
            search,
            props.regionSlug,
            q,
            county,
            town,
            min,
            max,
            membership,
            sort,
            sortby,
            layout,
            make,
            model,
            props.isVehicle,
        ]
    );

    // -------------------------
    // ✅ Click subcategory: NO Next navigation
    // -------------------------
    const onSubcategoryClick = React.useCallback(
        async (slug: string) => {
            if (!slug || slug === activeSlug) return;

            // update active label (title)
            const found = props.categoryListings.find((x) => x.slug === slug);
            setActiveTitle(found?.title || props.title);
            setActiveSlug(slug);

            // 1) fetch items only (grid refresh)
            await fetchItemsForSlug(slug);

            // 2) update URL WITHOUT Next routing (so sidebar doesn't refresh)
            if (typeof window !== "undefined") {
                const href = buildHrefForSlug(slug);
                window.history.pushState({ tadaoListingSlug: slug }, "", href);
            }
        },
        [activeSlug, props.categoryListings, props.title, fetchItemsForSlug, buildHrefForSlug]
    );

    // -------------------------
    // ✅ Handle browser Back/Forward (popstate)
    // -------------------------
    React.useEffect(() => {
        if (typeof window === "undefined") return;

        const onPop = async () => {
            const slug = getSlugFromPathname(window.location.pathname);
            if (!slug || slug === activeSlug) return;

            const found = props.categoryListings.find((x) => x.slug === slug);
            setActiveTitle(found?.title || props.title);
            setActiveSlug(slug);
            await fetchItemsForSlug(slug);
        };

        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, [activeSlug, props.categoryListings, props.title, fetchItemsForSlug]);

    // -------------------------
    // ✅ Infinite scroll (uses activeSlug)
    // -------------------------
    const sentinelRef = React.useRef<HTMLDivElement | null>(null);
    const canLoadMore = currentPage < tp && !loadingMore && !switchingSlug;

    const fetchNextPage = React.useCallback(async () => {
        if (!canLoadMore) return;

        setLoadingMore(true);
        setLoadError("");

        try {
            const sp = new URLSearchParams(search?.toString() || "");
            const nextPage = currentPage + 1;

            sp.set("page", String(nextPage));
            sp.set("limit", "24");
            sp.set("listingSlug", activeSlug);
            if (props.regionSlug) sp.set("regionSlug", props.regionSlug);

            setQS(sp, "q", q);
            setQS(sp, "county", county);
            setQS(sp, "town", town);
            setQS(sp, "min", min);
            setQS(sp, "max", max);
            setQS(sp, "membership", membership);
            setQS(sp, "sort", sort);
            setQS(sp, "sortby", sortby);
            setQS(sp, "layout", layout);
            setQS(sp, "make", props.isVehicle ? make : "");
            setQS(sp, "model", props.isVehicle ? model : "");

            const res = await fetch(`/api/listings?${sp.toString()}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            const newItems = Array.isArray(json?.items) ? json.items : [];
            const nextTotalPages = Number(json?.totalPages || tp);

            setAllItems((prev) => [...prev, ...newItems]);
            setCurrentPage(nextPage);
            setTp(nextTotalPages);
        } catch (e: any) {
            setLoadError(String(e?.message || e));
        } finally {
            setLoadingMore(false);
        }
    }, [
        canLoadMore,
        currentPage,
        tp,
        search,
        activeSlug,
        props.regionSlug,
        q,
        county,
        town,
        min,
        max,
        membership,
        sort,
        sortby,
        layout,
        make,
        model,
        props.isVehicle,
    ]);

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

    // -------------------------
    // Other UI bits
    // -------------------------
    const clearAll = () => router.replace(props.basePath, { scroll: false });

    const goBack = React.useCallback(() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push(props.basePath || "/");
    }, [router, props.basePath]);

    const [showStickyBack, setShowStickyBack] = React.useState(false);
    React.useEffect(() => {
        const onScroll = () => setShowStickyBack(window.scrollY > 160);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const [filtersOpen, setFiltersOpen] = React.useState(false);
    React.useEffect(() => {
        if (!filtersOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFiltersOpen(false);
        };
        document.addEventListener("keydown", onKey);

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [filtersOpen]);

    const appliedCount = React.useMemo(() => {
        const vals = [
            q,
            county,
            town,
            props.isVehicle ? make : "",
            props.isVehicle ? model : "",
            min,
            max,
            membership,
        ].filter((x) => String(x || "").trim().length > 0);
        return vals.length;
    }, [q, county, town, make, model, min, max, membership, props.isVehicle]);

    const applyAndClose = () => {
        // you can still use Next router for filters (this will rerender server),
        // but if you want filters also to not refresh sidebar, we can convert filters to client-fetch too.
        // For now: keep your existing behavior.
        const sp = new URLSearchParams(search?.toString() || "");
        sp.set("page", "1");
        setQS(sp, "q", q);
        setQS(sp, "county", county);
        setQS(sp, "town", town);
        setQS(sp, "min", min);
        setQS(sp, "max", max);
        setQS(sp, "membership", membership);
        setQS(sp, "sort", sort);
        setQS(sp, "sortby", sortby);
        setQS(sp, "layout", layout);
        setQS(sp, "make", props.isVehicle ? make : "");
        setQS(sp, "model", props.isVehicle ? model : "");
        router.replace(sp.toString() ? `${pathname}?${sp.toString()}` : pathname, { scroll: false });
        setFiltersOpen(false);
    };

    const clearAndClose = () => {
        setQ("");
        setCounty("");
        setTown("");
        setMake("");
        setModel("");
        setMin("");
        setMax("");
        setMembership("");
        setSort("recommeded");
        setSortby("recommeded");
        setLayout("grid");
        router.replace(props.basePath, { scroll: false });
        setFiltersOpen(false);
    };

    // -------------------------
    // Counts fallback (fixes "0 ads")
    // -------------------------
    const safeHomeCountsBySub =
        props.homeCountsBySub && Object.getPrototypeOf(props.homeCountsBySub) === Object.prototype
            ? props.homeCountsBySub
            : { ...(props.homeCountsBySub || {}) };

    const safeSidebarCounts =
        props.sidebar.subcategoryCounts && Object.getPrototypeOf(props.sidebar.subcategoryCounts) === Object.prototype
            ? props.sidebar.subcategoryCounts
            : { ...(props.sidebar.subcategoryCounts || {}) };

    const totalCategoryAds =
        Number(props.sidebar.totalInCategory || 0) > 0
            ? Number(props.sidebar.totalInCategory || 0)
            : Number(props.homeTotalInCategory || 0);

    const FiltersContent = (
        <div className="space-y-3">
            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-700">Price (KSh)</div>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        value={min}
                        onChange={(e) => setMin(e.target.value)}
                        placeholder="min"
                        inputMode="numeric"
                        className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <input
                        value={max}
                        onChange={(e) => setMax(e.target.value)}
                        placeholder="max"
                        inputMode="numeric"
                        className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>
            </div>

            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-700">Location</div>
                <div className="grid grid-cols-1 gap-2">
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
            </div>

            {props.isVehicle && (
                <div>
                    <div className="mb-1 text-xs font-extrabold text-slate-700">Vehicle</div>
                    <div className="grid grid-cols-1 gap-2">
                        <select
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                        >
                            <option value="">Any Make</option>
                            {props.sidebar.makes.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                        >
                            <option value="">Any Model</option>
                            {props.sidebar.models.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-700">Verified sellers</div>
                <select
                    value={membership}
                    onChange={(e) => setMembership(e.target.value)}
                    className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
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
                    className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                >
                    <option value="recommeded">Recommended</option>
                    <option value="new">Newest</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                </select>
            </div>
        </div>
    );

    return (
        <>
            <TopBar />

            {/* sticky back pill */}
            <div
                className={cn(
                    "md:hidden fixed left-3 z-[650] transition-all duration-200",
                    showStickyBack ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                )}
                style={{ top: "calc(var(--topbar-h, 64px) + 10px)" }}
            >
                <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-full border bg-white/95 px-3 py-2 text-sm font-extrabold text-slate-800 shadow-md backdrop-blur hover:bg-orange-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            </div>

            <div className="pt-[calc(var(--topbar-h,64px)+12px)]">
                <main className="mx-auto max-w-7xl p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
                        {/* LEFT */}
                        <aside className="hidden md:block space-y-3">
                            <div className="rounded-2xl border bg-white p-3 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="text-sm font-extrabold">{props.categoryName}</div>
                                    <div className="text-xs font-bold text-slate-500">{Number(totalCategoryAds).toLocaleString()} ads</div>
                                </div>

                                <div className="max-h-[520px] overflow-auto pr-1">
                                    {props.categoryListings.map((it) => {
                                        const active = it.slug.toLowerCase() === activeSlug.toLowerCase();

                                        const sidebarCount = safeSidebarCounts?.[it.subcategory];
                                        const homeCount = safeHomeCountsBySub?.[it.subcategory];
                                        const count = Number(sidebarCount ?? homeCount ?? 0);

                                        return (
                                            <button
                                                key={it.slug}
                                                type="button"
                                                onClick={() => onSubcategoryClick(it.slug)}
                                                className={cn(
                                                    "w-full rounded-xl px-3 py-2 text-left",
                                                    "hover:bg-orange-50",
                                                    active ? "bg-orange-50 ring-1 ring-orange-200" : ""
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <IconBubble src={it.icon} alt={it.title} />

                                                    <div className="min-w-0 flex-1">
                                                        <div className={cn("truncate text-sm", active ? "font-extrabold text-orange-700" : "font-semibold text-slate-900")}>
                                                            {it.title}
                                                        </div>
                                                        <div className="text-[11px] font-bold text-slate-500">{Number(count).toLocaleString()} ads</div>
                                                    </div>

                                                    <div className={cn("text-slate-400", active ? "text-orange-600" : "")}>›</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filters card */}
                            <div className="rounded-2xl border bg-white p-3 shadow-sm">
                                <div className="text-sm font-extrabold">Filters</div>
                                <div className="mt-3">{FiltersContent}</div>

                                <button
                                    onClick={applyAndClose}
                                    className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600"
                                >
                                    Apply filters
                                </button>

                                <button
                                    onClick={clearAll}
                                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-orange-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </aside>

                        {/* RIGHT */}
                        <section className="min-w-0">
                            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h1 className="truncate text-2xl font-extrabold">
                                            {activeTitle} in {props.regionLabel}
                                        </h1>
                                        <a className="mt-1 inline-block text-sm text-slate-600 underline" href={props.canonical}>
                                            Canonical
                                        </a>
                                    </div>
                                </div>

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
                                        onClick={applyAndClose}
                                        className="h-12 rounded-xl bg-orange-500 px-4 text-sm font-extrabold text-white hover:bg-orange-600"
                                    >
                                        Search
                                    </button>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-2 md:hidden">
                                    <button
                                        type="button"
                                        onClick={() => setFiltersOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-orange-50"
                                    >
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Filters
                                        {appliedCount > 0 ? (
                                            <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-extrabold text-orange-700">
                                                {appliedCount}
                                            </span>
                                        ) : null}
                                    </button>
                                </div>
                            </div>

                            {/* ✅ ONLY THIS PART CHANGES WHEN SUBCATEGORY CLICKED */}
                            <div
                                className={cn(
                                    "mt-4 gap-3",
                                    layout === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" : "grid grid-cols-1"
                                )}
                            >
                                {switchingSlug ? (
                                    <div className="col-span-full rounded-2xl border bg-white p-6 text-center text-sm font-bold text-slate-700">
                                        Loading…
                                    </div>
                                ) : null}

                                {!switchingSlug &&
                                    allItems.map((ad: any) => (
                                        <SmartPropertyCardWithDesc key={String(ad._id)} ad={ad} regionFallback={props.regionLabel} />
                                    ))}
                            </div>

                            <div ref={sentinelRef} className="h-1" />

                            <div className="mt-4 flex items-center justify-center">
                                {loadingMore ? (
                                    <div className="rounded-xl border bg-white px-4 py-2 text-sm font-bold text-slate-700">Loading more…</div>
                                ) : null}

                                {!loadingMore && currentPage >= tp ? (
                                    <div className="rounded-xl border bg-white px-4 py-2 text-sm font-bold text-slate-700">You’ve reached the end</div>
                                ) : null}
                            </div>

                            {loadError ? (
                                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    Failed to load: {loadError}{" "}
                                    <button className="underline" onClick={() => location.reload()}>
                                        Refresh
                                    </button>
                                </div>
                            ) : null}
                        </section>
                    </div>
                </main>
            </div>

            {/* mobile filters */}
            {filtersOpen ? (
                <div className="md:hidden fixed inset-0 z-[800]">
                    <button aria-label="Close filters" className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />

                    <div
                        className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white shadow-2xl"
                        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                    >
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <div className="text-sm font-extrabold">Filters</div>
                            <button type="button" onClick={() => setFiltersOpen(false)} className="rounded-full border p-2 hover:bg-orange-50">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-[72vh] overflow-auto px-4 py-4">{FiltersContent}</div>

                        <div className="grid grid-cols-2 gap-2 border-t px-4 py-3">
                            <button
                                type="button"
                                onClick={clearAndClose}
                                className="h-12 rounded-xl border px-4 text-sm font-extrabold text-slate-700 hover:bg-orange-50"
                            >
                                Clear
                            </button>

                            <button
                                type="button"
                                onClick={applyAndClose}
                                className="h-12 rounded-xl bg-orange-500 px-4 text-sm font-extrabold text-white hover:bg-orange-600"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}