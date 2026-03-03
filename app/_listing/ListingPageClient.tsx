// app/_listing/ListingPageClient.tsx
"use client";

import * as React from "react";
import TopBar from "@/components/home/TopBar.client";
import { cn } from "@/lib/utils";
import { ArrowLeft, SlidersHorizontal, X, Layers } from "lucide-react";
import SmartPropertyCardWithDesc from "@/components/home/SmartPropertyCardWithDesc";
import { Icons } from "@/constants";

type SidebarData = {
    subcategoryCounts: Record<string, number>;
    counties: string[];
    towns: string[];
    townsByCounty: Record<string, string[]>;
    makes: string[];
    models: string[];
    totalInCategory: number;

    types?: string[];
    brands?: string[];
};

type CategoryListingItem = {
    slug: string;
    title: string;
    subcategory: string;
    icon?: string;
};

type QuickFilter = {
    field: string; // "type" | "make-model" | "make" | "brand" | ""
    options: string[];
};

type ClientCategory = {
    name: string;
    count: number;
    icon?: string;
    listings: CategoryListingItem[];
    countsBySub: Record<string, number>; // ✅ NEW
};

type Props = {
    title: string;
    regionLabel: string;
    canonical: string;

    activeListingSlug: string;
    regionSlug?: string;

    // ✅ NEW: for category switching
    categories: ClientCategory[];

    categoryName: string;
    categoryListings: CategoryListingItem[];
    sidebar: SidebarData;
    isVehicle: boolean;

    items: any[];
    totalPages: number;
    page: number;

    homeCountsBySub: Record<string, number>;
    homeTotalInCategory: number;

    quickFilter: QuickFilter;

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

        type?: string;
        brand?: string;
    };
};

function setQS(sp: URLSearchParams, key: string, value: string) {
    if (!value) sp.delete(key);
    else sp.set(key, value);
}
function initials2(label: string) {
    const s = String(label || "").trim();
    if (!s) return "NA";
    const parts = s.replace(/[-_/]+/g, " ").split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}
function isLikelyImagePath(v: string) {
    const s = (v || "").trim();
    if (!s) return false;
    // starts with / or http(s) or data:
    if (/^(\/|https?:\/\/|data:)/i.test(s)) return true;
    // or ends with an image extension
    if (/\.(svg|png|jpg|jpeg|webp|gif)$/i.test(s)) return true;
    return false;
}
/** ✅ icon resolver: listing.icon -> Icons map -> emoji -> solid initials circle */
function IconOrInitial(props: { label: string; src?: string; className?: string }) {
    const { label, src, className } = props;

    const direct = String(src || "").trim();
    if (direct) {
        if (isLikelyImagePath(direct)) {
            return <img src={direct} alt={label} className="h-9 w-9 object-contain" loading="lazy" />;
        }
        // otherwise treat as emoji/text
        return <span className="text-[28px] leading-none" aria-hidden>{direct}</span>;
    }

    const v = (Icons as any)?.[label];
    if (typeof v === "string" && v.trim()) {
        if (isLikelyImagePath(v)) {
            return <img src={v} alt={label} className="h-9 w-9 object-contain" loading="lazy" />;
        }
        return <span className="text-[28px] leading-none" aria-hidden>{v}</span>;
    }

    // 3) fallback: SOLID circle with initials
    return (
        <div
            className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-[11px] font-extrabold text-white", className)}
            title={label}
        >
            {initials2(label)}
        </div>
    );
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
function SearchableSelect<T extends { [k: string]: any }>(props: {
    label?: string;
    items: T[];
    valueKey: keyof T;     // e.g. "name"
    subtitleKey?: keyof T; // e.g. "count"
    iconKey?: keyof T;     // e.g. "icon"
    value: string;
    placeholder?: string;
    onChange: (item: T) => void;
}) {
    const { label, items, valueKey, subtitleKey, iconKey, value, placeholder, onChange } = props;

    const [open, setOpen] = React.useState(false);
    const [q, setQ] = React.useState("");

    const selected = React.useMemo(() => {
        const v = String(value || "").toLowerCase();
        return items.find((it) => String(it[valueKey] || "").toLowerCase() === v);
    }, [items, value, valueKey]);

    const filtered = React.useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return items;
        return items.filter((it) => {
            const name = String(it[valueKey] || "").toLowerCase();
            return name.includes(query);
        });
    }, [items, q, valueKey]);

    React.useEffect(() => {
        if (!open) setQ("");
    }, [open]);

    // close on escape / outside click
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        const onClick = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (!t.closest?.("[data-combobox-root='1']")) setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("mousedown", onClick);
        };
    }, [open]);

    return (
        <div className="relative" data-combobox-root="1">
            {label ? <div className="mb-1 text-xs font-extrabold text-slate-700">{label}</div> : null}

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 text-left text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-200"
            >
                <div className="flex min-w-0 items-center gap-3">
                    {iconKey ? <IconBubble src={String(selected?.[iconKey] || "")} alt={String(selected?.[valueKey] || "Category")} /> : null}
                    <div className="min-w-0">
                        <div className="truncate">
                            {selected ? String(selected[valueKey]) : placeholder || "Select..."}
                        </div>
                        {subtitleKey && selected ? (
                            <div className="truncate text-[11px] font-bold text-slate-500">
                                {Number(selected[subtitleKey] || 0).toLocaleString()} ads
                            </div>
                        ) : null}
                    </div>
                </div>
                <span className="text-slate-400">▾</span>
            </button>

            {open ? (
                <div className="absolute z-[999] mt-2 w-full overflow-hidden rounded-2xl border bg-white shadow-xl">
                    <div className="border-b p-2">
                        <input
                            autoFocus
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search category..."
                            className="h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

                    <div className="max-h-[320px] overflow-auto p-2">
                        {filtered.length ? (
                            filtered.map((it) => {
                                const name = String(it[valueKey] || "");
                                const active = name.toLowerCase() === String(value || "").toLowerCase();
                                const sub = subtitleKey ? Number(it[subtitleKey] || 0) : 0;

                                return (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => {
                                            onChange(it);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-orange-50",
                                            active ? "bg-orange-50 ring-1 ring-orange-200" : ""
                                        )}
                                    >
                                        {iconKey ? <IconBubble src={String(it[iconKey] || "")} alt={name} /> : null}
                                        <div className="min-w-0 flex-1">
                                            <div className={cn("truncate text-sm", active ? "font-extrabold text-orange-700" : "font-semibold text-slate-900")}>{name}</div>
                                            {subtitleKey ? <div className="text-[11px] font-bold text-slate-500">{sub.toLocaleString()} ads</div> : null}
                                        </div>
                                        <div className={cn("text-slate-400", active ? "text-orange-600" : "")}>›</div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-8 text-center text-sm font-semibold text-slate-500">
                                No matches
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
function parsePlainTextToMakeModels(text: string) {
    const blocks = String(text || "")
        .trim()
        .split("\n\n")
        .filter(Boolean);

    return blocks
        .map((block) => {
            const [makeLine, modelsLine] = block.split("\n");
            const make = String(makeLine || "").replace("Make:", "").trim();
            const models = String(modelsLine || "")
                .replace("Models:", "")
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean);
            return { make, models };
        })
        .filter((x) => x.make);
}

type PricePreset = { label: string; min?: number; max?: number };

function fmtKsh(n: number) {
    if (!Number.isFinite(n)) return "";
    if (n >= 1_000_000) {
        const m = n / 1_000_000;
        return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
    }
    if (n >= 1000) return `${Math.round(n / 1000)}K`;
    return `${n}`;
}

function preset(min?: number, max?: number): PricePreset {
    if (min == null && max == null) return { label: "Any price" };
    if (min == null) return { label: `< KSh ${fmtKsh(max!)}`, min: undefined, max };
    if (max == null) return { label: `> KSh ${fmtKsh(min)}`, min, max: undefined };
    return { label: `KSh ${fmtKsh(min)} - ${fmtKsh(max)}`, min, max };
}

function pickPricePresets(categoryName: string, activeSubTitle: string): PricePreset[] {
    const cat = String(categoryName || "").toLowerCase();
    const sub = String(activeSubTitle || "").toLowerCase();
    const has = (re: RegExp) => re.test(cat) || re.test(sub);

    if (has(/\bvehicle\b|\bcars?\b|\btrucks?\b|\bbuses?\b|\bmotorbikes?\b|\bmachinery\b|\bheavy\s*equipment\b/)) {
        return [preset(undefined, 500_000), preset(500_000, 1_500_000), preset(1_500_000, 3_000_000), preset(3_000_000, 6_000_000), preset(6_000_000, undefined)];
    }

    if (has(/\bland\b|\bplot\b|\bfarm\b|\bacres?\b/)) {
        return [preset(undefined, 500_000), preset(500_000, 2_000_000), preset(2_000_000, 5_000_000), preset(5_000_000, 10_000_000), preset(10_000_000, undefined)];
    }

    const isProperty =
        /\bproperty\b|\breal\s*estate\b|\bhouses?\b|\bapartment\b|\bbedsitter\b|\bstudio\b|\bvilla\b|\bcommercial\b|\boffice\b|\bshop\b|\bwarehouse\b|\bplaza\b/.test(cat) ||
        /\bproperty\b|\breal\s*estate\b|\bhouses?\b|\bapartment\b|\bbedsitter\b|\bstudio\b|\bvilla\b|\bcommercial\b|\boffice\b|\bshop\b|\bwarehouse\b|\bplaza\b/.test(sub);

    if (isProperty) {
        const isRent = /\brent\b|\blet\b|\bshort\s*let\b|\bairbnb\b/.test(sub) || /\brent\b|\blet\b/.test(cat);
        if (isRent) return [preset(undefined, 10_000), preset(10_000, 30_000), preset(30_000, 60_000), preset(60_000, 120_000), preset(120_000, undefined)];
        return [preset(undefined, 3_000_000), preset(3_000_000, 8_000_000), preset(8_000_000, 15_000_000), preset(15_000_000, 30_000_000), preset(30_000_000, undefined)];
    }

    if (has(/\bparts?\b|\bspares?\b|\baccessor(y|ies)\b|\belectronics?\b|\bphones?\b|\blaptops?\b|\bfurniture\b/)) {
        return [preset(undefined, 1_000), preset(1_000, 5_000), preset(5_000, 20_000), preset(20_000, 50_000), preset(50_000, 150_000), preset(150_000, undefined)];
    }

    return [preset(undefined, 1_000), preset(1_000, 5_000), preset(5_000, 20_000), preset(20_000, 50_000), preset(50_000, 150_000), preset(150_000, undefined)];
}

type FetchOverrides = {
    listingSlug?: string;
    page?: number;
    append?: boolean;

    q?: string;
    county?: string;
    town?: string;
    min?: string;
    max?: string;
    membership?: string;
    sort?: string;
    sortby?: string;
    layout?: "grid" | "list";

    make?: string;
    model?: string;

    type?: string;
    brand?: string;
};

export default function ListingPageClient(props: Props) {
    // ✅ stateful category context (needed for category switching)
    const [categoryName, setCategoryName] = React.useState(props.categoryName);
    const [isVehicle, setIsVehicle] = React.useState(props.isVehicle);
    const [categoryListings, setCategoryListings] = React.useState<CategoryListingItem[]>(props.categoryListings);
    const [countsBySubFallback, setCountsBySubFallback] = React.useState<Record<string, number>>(
        props.homeCountsBySub || {}
    );
    const [totalFallback, setTotalFallback] = React.useState<number>(props.homeTotalInCategory || 0);
    // ✅ live sidebar + quickFilter
    const [sidebar, setSidebar] = React.useState<SidebarData>(props.sidebar);
    const [quickFilterState, setQuickFilterState] = React.useState<QuickFilter>(props.quickFilter);

    // active listing slug (subcategory listing)
    const [activeSlug, setActiveSlug] = React.useState<string>(props.activeListingSlug);

    const activeListing = React.useMemo(() => {
        return categoryListings.find((x) => x.slug.toLowerCase() === activeSlug.toLowerCase()) || categoryListings[0];
    }, [activeSlug, categoryListings]);

    // filters
    const [layout, setLayout] = React.useState<"grid" | "list">(props.selected.layout || "grid");
    const [county, setCounty] = React.useState(props.selected.county || "");
    const [town, setTown] = React.useState(props.selected.town || "");
    const [q, setQ] = React.useState(props.selected.q || "");

    const [make, setMake] = React.useState(props.selected.make || "");
    const [model, setModel] = React.useState(props.selected.model || "");

    const [type, setType] = React.useState(props.selected.type || "");
    const [brand, setBrand] = React.useState(props.selected.brand || "");

    const [min, setMin] = React.useState(props.selected.min || "");
    const [max, setMax] = React.useState(props.selected.max || "");

    const [membership, setMembership] = React.useState(props.selected.membership || "");
    const [sort, setSort] = React.useState(props.selected.sort || "recommeded");
    const [sortby, setSortby] = React.useState(props.selected.sortby || "recommeded");

    const townsForCounty = React.useMemo(() => {
        if (!county) return sidebar.towns;
        return sidebar.townsByCounty?.[county] || [];
    }, [county, sidebar.towns, sidebar.townsByCounty]);

    React.useEffect(() => {
        if (!county) return;
        if (town && !townsForCounty.includes(town)) setTown("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [county]);

    // items state
    const [allItems, setAllItems] = React.useState<any[]>(props.items || []);
    const [currentPage, setCurrentPage] = React.useState<number>(props.page || 1);
    const [tp, setTp] = React.useState<number>(props.totalPages || 1);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [loadError, setLoadError] = React.useState<string>("");

    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    // sync SSR on real route changes
    React.useEffect(() => {
        setCategoryName(props.categoryName);
        setIsVehicle(props.isVehicle);
        setCategoryListings(props.categoryListings);

        setSidebar(props.sidebar);
        setQuickFilterState(props.quickFilter);

        setAllItems(props.items || []);
        setCurrentPage(props.page || 1);
        setTp(props.totalPages || 1);
        setLoadError("");
        setActiveSlug(props.activeListingSlug);
        setCountsBySubFallback(props.homeCountsBySub || {});
        setTotalFallback(props.homeTotalInCategory || 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.activeListingSlug, props.items, props.page, props.totalPages]);

    // URL builder
    const buildPathForSlug = React.useCallback(
        (slug: string) => {
            const prefix = props.regionSlug ? `/r/${props.regionSlug}/` : `/`;
            return `${prefix}${slug}`;
        },
        [props.regionSlug]
    );

    const updateUrlShallow = React.useCallback(
        (slug: string, sp: URLSearchParams) => {
            const qs = sp.toString();
            const url = qs ? `${buildPathForSlug(slug)}?${qs}` : buildPathForSlug(slug);
            if (typeof window !== "undefined") window.history.replaceState({}, "", url);
        },
        [buildPathForSlug]
    );

    // fetcher (uses CURRENT category/isVehicle state)
    const fetchItems = React.useCallback(
        async (opts: FetchOverrides) => {
            setLoadError("");

            const pageToFetch = Number(opts.page || 1);
            const append = Boolean(opts.append);

            const listingSlug = String(opts.listingSlug || activeSlug || props.activeListingSlug);

            const q2 = opts.q ?? q;
            const county2 = opts.county ?? county;
            const town2 = opts.town ?? town;
            const min2 = opts.min ?? min;
            const max2 = opts.max ?? max;
            const membership2 = opts.membership ?? membership;
            const sort2 = opts.sort ?? sort;
            const sortby2 = opts.sortby ?? sortby;
            const layout2 = opts.layout ?? layout;

            const make2 = opts.make ?? make;
            const model2 = opts.model ?? model;

            const type2 = opts.type ?? type;
            const brand2 = opts.brand ?? brand;

            const sp = new URLSearchParams();
            sp.set("page", String(pageToFetch));
            sp.set("limit", "24");

            sp.set("listingSlug", listingSlug);
            if (props.regionSlug) sp.set("regionSlug", props.regionSlug);

            setQS(sp, "q", q2);
            setQS(sp, "county", county2);
            setQS(sp, "town", town2);
            setQS(sp, "min", min2);
            setQS(sp, "max", max2);
            setQS(sp, "membership", membership2);
            setQS(sp, "sort", sort2);
            setQS(sp, "sortby", sortby2);
            setQS(sp, "layout", layout2);

            if (isVehicle) {
                setQS(sp, "make", make2);
                setQS(sp, "model", model2);
                sp.delete("type");
                sp.delete("brand");
            } else {
                sp.delete("make");
                sp.delete("model");
                setQS(sp, "type", type2 || "");
                setQS(sp, "brand", brand2 || "");
            }

            updateUrlShallow(listingSlug, sp);

            const res = await fetch(`/api/listings?${sp.toString()}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            const newItems = Array.isArray(json?.items) ? json.items : Array.isArray(json?.data) ? json.data : [];
            const nextTotalPages = Number(json?.totalPages || 1);

            if (json?.sidebar) setSidebar(json.sidebar);
            if (json?.quickFilter) setQuickFilterState(json.quickFilter);

            setTp(nextTotalPages);
            setCurrentPage(pageToFetch);
            setAllItems((prev) => (append ? [...prev, ...newItems] : newItems));
        },
        [
            activeSlug,
            props.activeListingSlug,
            props.regionSlug,
            updateUrlShallow,
            isVehicle,
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
            type,
            brand,
        ]
    );

    // infinite scroll
    const canLoadMore = currentPage < tp && !loadingMore;

    const fetchNextPage = React.useCallback(async () => {
        if (!canLoadMore) return;
        setLoadingMore(true);
        try {
            await fetchItems({ page: currentPage + 1, append: true });
        } catch (e: any) {
            setLoadError(String(e?.message || e));
        } finally {
            setLoadingMore(false);
        }
    }, [canLoadMore, currentPage, fetchItems]);

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

    // subcategory switch (within category)
    const onSubcategoryClick = React.useCallback(
        async (slug: string) => {
            if (!slug) return;

            setActiveSlug(slug);

            // reset category-specific filters so they don't stick across subcategories
            setMake("");
            setModel("");
            setType("");
            setBrand("");

            setCurrentPage(1);
            setTp(1);
            setAllItems([]);
            setLoadingMore(true);

            try {
                await fetchItems({ page: 1, append: false, listingSlug: slug, make: "", model: "", type: "", brand: "" });
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (e: any) {
                setLoadError(String(e?.message || e));
            } finally {
                setLoadingMore(false);
            }
        },
        [fetchItems]
    );

    // ✅ CATEGORY switch (new)
    const onCategoryPick = React.useCallback(
        async (cat: ClientCategory) => {
            if (!cat?.name) return;
            if (!cat.listings?.length) return;

            const nextCategoryName = String(cat.name).trim();
            const nextIsVehicle = nextCategoryName.toLowerCase() === "vehicle";
            const nextListings = cat.listings;

            // pick first slug in that category (or keep current if exists)
            const nextSlug = nextListings[0]?.slug;

            // update UI state first
            setCategoryName(nextCategoryName);
            setIsVehicle(nextIsVehicle);
            setCategoryListings(nextListings);
            setCountsBySubFallback(cat.countsBySub || {});
            setTotalFallback(Number(cat.count || 0));
            // reset category-specific filters only
            setMake("");
            setModel("");
            setType("");
            setBrand("");

            // switch active slug
            setActiveSlug(nextSlug);

            // reset paging
            setCurrentPage(1);
            setTp(1);
            setAllItems([]);
            setLoadingMore(true);

            try {
                await fetchItems({
                    page: 1,
                    append: false,
                    listingSlug: nextSlug,
                    make: "",
                    model: "",
                    type: "",
                    brand: "",
                });
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (e: any) {
                setLoadError(String(e?.message || e));
            } finally {
                setLoadingMore(false);
            }
        },
        [fetchItems]
    );

    // apply/clear
    const applyFilters = React.useCallback(async () => {
        setLoadingMore(true);
        try {
            await fetchItems({ page: 1, append: false });
        } catch (e: any) {
            setLoadError(String(e?.message || e));
        } finally {
            setLoadingMore(false);
        }
    }, [fetchItems]);

    const clearAll = React.useCallback(async () => {
        setQ("");
        setCounty("");
        setTown("");
        setMin("");
        setMax("");
        setMembership("");
        setMake("");
        setModel("");
        setBrand("");
        setType("");
        setSort("recommeded");
        setSortby("recommeded");
        setLayout("grid");

        setLoadingMore(true);
        try {
            await fetchItems({
                page: 1,
                append: false,
                q: "",
                county: "",
                town: "",
                min: "",
                max: "",
                membership: "",
                make: "",
                model: "",
                brand: "",
                type: "",
                sort: "recommeded",
                sortby: "recommeded",
                layout: "grid",
            });
        } catch (e: any) {
            setLoadError(String(e?.message || e));
        } finally {
            setLoadingMore(false);
        }
    }, [fetchItems]);

    // sticky back (mobile)
    const goBack = React.useCallback(() => {
        if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
        else window.location.href = "/";
    }, []);

    const [showStickyBack, setShowStickyBack] = React.useState(false);
    React.useEffect(() => {
        const onScroll = () => setShowStickyBack(window.scrollY > 160);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // mobile modals
    const [filtersOpen, setFiltersOpen] = React.useState(false);
    const [catsOpen, setCatsOpen] = React.useState(false);

    React.useEffect(() => {
        if (!filtersOpen && !catsOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setFiltersOpen(false);
                setCatsOpen(false);
            }
        };
        document.addEventListener("keydown", onKey);

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [filtersOpen, catsOpen]);

    const appliedCount = React.useMemo(() => {
        const vals = [
            q,
            county,
            town,
            min,
            max,
            membership,
            isVehicle ? make : "",
            isVehicle ? model : "",
            !isVehicle ? type : "",
            !isVehicle ? brand : "",
        ].filter((x) => String(x || "").trim().length > 0);
        return vals.length;
    }, [q, county, town, min, max, membership, isVehicle, make, model, type, brand]);

    const sum = (obj?: Record<string, number>) =>
        Object.values(obj || {}).reduce((a, b) => a + (Number(b) || 0), 0);

    const totalCategoryAds = React.useMemo(() => {
        const a = Number(sidebar?.totalInCategory || 0);
        if (a > 0) return a;

        const b = Number(totalFallback || 0);
        if (b > 0) return b;

        const c = sum(sidebar?.subcategoryCounts);
        if (c > 0) return c;

        const d = sum(countsBySubFallback);
        return d;
    }, [sidebar?.totalInCategory, sidebar?.subcategoryCounts, totalFallback, countsBySubFallback]);
    // quick filter chips
    const quickField = String(quickFilterState?.field || "").trim();
    const quickOptions = Array.isArray(quickFilterState?.options) ? quickFilterState.options : [];

    const makeModelParsed = React.useMemo(() => {
        if (quickField !== "make-model") return [];
        if (!quickOptions.length) return [];
        return parsePlainTextToMakeModels(quickOptions.join("\n\n"));
    }, [quickField, quickOptions]);

    const topTypeChips = React.useMemo(() => {
        if (!quickField) return [];
        if (quickField === "type" || /type/i.test(quickField)) return quickOptions.slice(0, 7);
        if (quickField === "brand") return quickOptions.slice(0, 7);
        if (quickField === "make") return quickOptions.slice(0, 7);
        return [];
    }, [quickField, quickOptions]);

    const onQuickChip = React.useCallback(
        async (val: string) => {
            if (!val) return;

            setLoadingMore(true);
            try {
                if (isVehicle) {
                    setMake(val);
                    setModel("");
                    await fetchItems({ page: 1, append: false, make: val, model: "" });
                    return;
                }

                const field =
                    quickFilterState?.field === "brand"
                        ? "brand"
                        : quickFilterState?.field === "type" || /type/i.test(quickFilterState?.field || "")
                            ? "type"
                            : "q";

                if (field === "type") {
                    setType(val);
                    setBrand("");
                    await fetchItems({ page: 1, append: false, type: val.trim(), brand: "" });
                } else if (field === "brand") {
                    setBrand(val);
                    setType("");
                    await fetchItems({ page: 1, append: false, brand: val.trim(), type: "" });
                } else {
                    setQ(val);
                    await fetchItems({ page: 1, append: false, q: val.trim() });
                }
            } catch (e: any) {
                setLoadError(String(e?.message || e));
            } finally {
                setLoadingMore(false);
            }
        },
        [fetchItems, isVehicle, quickFilterState?.field]
    );

    const onMakeModelChip = React.useCallback(
        async (makeVal: string) => {
            if (!makeVal) return;
            setMake(makeVal);
            setModel("");

            setLoadingMore(true);
            try {
                await fetchItems({ page: 1, append: false, make: makeVal, model: "" });
            } catch (e: any) {
                setLoadError(String(e?.message || e));
            } finally {
                setLoadingMore(false);
            }
        },
        [fetchItems]
    );

    const pricePresets = React.useMemo(() => {
        return pickPricePresets(categoryName, String(activeListing?.title || props.title || ""));
    }, [categoryName, activeListing?.title, props.title]);

    const activePriceKey = `${min || ""}-${max || ""}`;

    const onPricePreset = React.useCallback(
        async (p: PricePreset) => {
            const nextMin = p.min != null ? String(p.min) : "";
            const nextMax = p.max != null ? String(p.max) : "";
            setMin(nextMin);
            setMax(nextMax);

            setLoadingMore(true);
            try {
                await fetchItems({ page: 1, append: false, min: nextMin, max: nextMax });
            } catch (e: any) {
                setLoadError(String(e?.message || e));
            } finally {
                setLoadingMore(false);
            }
        },
        [fetchItems]
    );

    const FiltersContent = (
        <div className="space-y-3">
            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-700">Price (KSh)</div>
                <div className="grid grid-cols-2 gap-2">
                    <input value={min} onChange={(e) => setMin(e.target.value)} placeholder="min" inputMode="numeric" className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200" />
                    <input value={max} onChange={(e) => setMax(e.target.value)} placeholder="max" inputMode="numeric" className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200" />
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
                        {sidebar.counties.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <select value={town} onChange={(e) => setTown(e.target.value)} className="h-12 w-full rounded-xl border px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-200">
                        <option value="">{county ? "Any town / area" : "Select county first (optional)"}</option>
                        {townsForCounty.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isVehicle ? (
                <div>
                    <div className="mb-1 text-xs font-extrabold text-slate-700">Vehicle</div>
                    <div className="grid grid-cols-1 gap-2">
                        <select
                            value={make}
                            onChange={(e) => {
                                setMake(e.target.value);
                                setModel("");
                            }}
                            className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                        >
                            <option value="">Any Make</option>
                            {sidebar.makes.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        <select value={model} onChange={(e) => setModel(e.target.value)} className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200">
                            <option value="">Any Model</option>
                            {sidebar.models.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="mb-1 text-xs font-extrabold text-slate-700">Type / Brand</div>

                    {(quickField === "type" || /type/i.test(quickField)) ? (
                        <select value={type} onChange={(e) => setType(e.target.value)} className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200">
                            <option value="">Any Type</option>
                            {quickOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : quickField === "brand" ? (
                        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200">
                            <option value="">Any Brand</option>
                            {quickOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (optional)" className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200" />
                            <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand (optional)" className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200" />
                        </div>
                    )}
                </div>
            )}

            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-700">Verified sellers</div>
                <select value={membership} onChange={(e) => setMembership(e.target.value)} className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200">
                    <option value="">Show all</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                </select>
            </div>

            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-700">Sort</div>
                <select value={sortby} onChange={(e) => setSortby(e.target.value)} className="h-12 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-orange-200">
                    <option value="recommeded">Recommended</option>
                    <option value="new">Newest</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                </select>
            </div>
        </div>
    );

    // Desktop sidebar categories list
    const DesktopCategories = (
        <div className="rounded-2xl border bg-white p-3 shadow-sm">
            <SearchableSelect
                label="Category"
                items={props.categories}
                valueKey="name"
                subtitleKey="count"
                iconKey="icon"
                value={categoryName}
                placeholder="Choose category"
                onChange={(cat) => onCategoryPick(cat)}
            />
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
                        {/* LEFT (desktop only) */}
                        <aside className="hidden md:block space-y-3">
                            {/* ✅ Categories switcher */}
                            {DesktopCategories}

                            {/* Subcategories */}
                            <div className="rounded-2xl border bg-white p-3 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="text-sm font-extrabold">{categoryName}</div>
                                    <div className="text-xs font-bold text-slate-500">{Number(totalCategoryAds || 0).toLocaleString()} ads</div>
                                </div>

                                <div className="max-h-[520px] overflow-auto pr-1">
                                    {categoryListings.map((it) => {
                                        const active = it.slug.toLowerCase() === activeSlug.toLowerCase();
                                        const live = sidebar.subcategoryCounts?.[it.subcategory];
                                        const fallback = countsBySubFallback?.[it.subcategory];
                                        const count = Number(live ?? fallback ?? 0);

                                        return (
                                            <button
                                                key={it.slug}
                                                type="button"
                                                onClick={() => onSubcategoryClick(it.slug)}
                                                className={cn("w-full rounded-xl px-3 py-2 text-left hover:bg-orange-50", active ? "bg-orange-50 ring-1 ring-orange-200" : "")}
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

                            {/* Filters */}
                            <div className="rounded-2xl border bg-white p-3 shadow-sm">
                                <div className="text-sm font-extrabold">Filters</div>
                                <div className="mt-3">{FiltersContent}</div>

                                <button onClick={applyFilters} className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600">
                                    Apply filters
                                </button>

                                <button onClick={clearAll} className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-orange-50">
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
                                            {String(activeListing?.title || props.title)} in {props.regionLabel}
                                        </h1>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                            <span className="font-bold">{categoryName}</span>
                                            <span className="text-slate-400">•</span>
                                            <a className="underline" href={props.canonical}>
                                                Canonical
                                            </a>
                                        </div>
                                    </div>

                                    {/* ✅ Mobile: category button */}
                                    <button
                                        type="button"
                                        onClick={() => setCatsOpen(true)}
                                        className="md:hidden inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-extrabold text-slate-800 hover:bg-orange-50"
                                    >
                                        <Layers className="h-4 w-4" />
                                        Category
                                    </button>
                                </div>

                                {/* search row */}
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
                                        {sidebar.counties.map((c) => (
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

                                    <button onClick={applyFilters} className="h-12 rounded-xl bg-orange-500 px-4 text-sm font-extrabold text-white hover:bg-orange-600">
                                        Search
                                    </button>
                                </div>

                                {/* price chips */}
                                <div className="mt-3 space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {pricePresets.map((p) => {
                                            const key = `${p.min ?? ""}-${p.max ?? ""}`;
                                            const active = key === activePriceKey;
                                            return (
                                                <button
                                                    key={p.label}
                                                    type="button"
                                                    onClick={() => onPricePreset(p)}
                                                    className={cn(
                                                        "rounded-xl border px-4 py-2 text-xs font-extrabold",
                                                        active ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200" : "bg-white text-slate-700 hover:bg-orange-50"
                                                    )}
                                                >
                                                    {p.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* quick chips */}
                                    {/* ✅ quick chips WITH ICONS */}
                                    {isVehicle ? (
                                        quickField === "make-model" && makeModelParsed.length ? (
                                            <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
                                                {makeModelParsed.slice(0, 7).map((m) => {
                                                    const active = String(make || "").toLowerCase() === m.make.toLowerCase();
                                                    return (
                                                        <button
                                                            key={m.make}
                                                            type="button"
                                                            onClick={() => onMakeModelChip(m.make)}
                                                            className={cn("h-[92px] rounded-xl border p-2 text-center", active ? "bg-orange-50 ring-1 ring-orange-200" : "bg-white hover:bg-orange-50")}
                                                        >
                                                            <div className="flex h-full flex-col items-center justify-center gap-2">
                                                                <IconOrInitial label={m.make} />
                                                                <div className={cn("text-[11px] font-extrabold", active ? "text-orange-700" : "text-slate-900")}>{m.make}</div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : topTypeChips.length ? (
                                            <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
                                                {topTypeChips.map((opt) => {
                                                    const active = String(make || "").toLowerCase() === String(opt || "").toLowerCase();
                                                    return (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => onQuickChip(opt)}
                                                            className={cn("h-[92px] rounded-xl border p-2 text-center", active ? "bg-orange-50 ring-1 ring-orange-200" : "bg-white hover:bg-orange-50")}
                                                        >
                                                            <div className="flex h-full flex-col items-center justify-center gap-2">
                                                                <IconOrInitial label={opt} />
                                                                <div className={cn("text-[11px] font-extrabold", active ? "text-orange-700" : "text-slate-900")}>{opt}</div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : null
                                    ) : topTypeChips.length ? (
                                        <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
                                            {topTypeChips.map((opt) => {
                                                const active =
                                                    (quickField === "brand" && String(brand || "").toLowerCase() === String(opt || "").toLowerCase()) ||
                                                    ((quickField === "type" || /type/i.test(quickField)) && String(type || "").toLowerCase() === String(opt || "").toLowerCase()) ||
                                                    (!quickField && String(q || "").toLowerCase() === String(opt || "").toLowerCase());

                                                return (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => onQuickChip(opt)}
                                                        className={cn("h-[92px] rounded-xl border p-2 text-center", active ? "bg-orange-50 ring-1 ring-orange-200" : "bg-white hover:bg-orange-50")}
                                                    >
                                                        <div className="flex h-full flex-col items-center justify-center gap-2">
                                                            <IconOrInitial label={opt} />
                                                            <div className={cn("text-[11px] font-extrabold", active ? "text-orange-700" : "text-slate-900")}>{opt}</div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>


                                {/* mobile actions */}
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

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setLayout("grid")}
                                            className={cn("rounded-xl border px-3 py-3 text-sm font-extrabold", layout === "grid" ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200" : "bg-white text-slate-700 hover:bg-orange-50")}
                                        >
                                            Grid
                                        </button>
                                        <button
                                            onClick={() => setLayout("list")}
                                            className={cn("rounded-xl border px-3 py-3 text-sm font-extrabold", layout === "list" ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200" : "bg-white text-slate-700 hover:bg-orange-50")}
                                        >
                                            List
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* results */}
                            <div className={cn("mt-4 gap-3", layout === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" : "grid grid-cols-1")}>
                                {allItems.map((ad: any) => (
                                    <SmartPropertyCardWithDesc key={String(ad._id)} ad={ad} regionFallback={props.regionLabel} />
                                ))}
                            </div>

                            <div ref={sentinelRef} className="h-1" />

                            <div className="mt-4 flex items-center justify-center">
                                {loadingMore ? <div className="rounded-xl border bg-white px-4 py-2 text-sm font-bold text-slate-700">Loading…</div> : null}
                                {!loadingMore && currentPage >= tp ? <div className="rounded-xl border bg-white px-4 py-2 text-sm font-bold text-slate-700">You’ve reached the end</div> : null}
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

            {/* ✅ Mobile categories sheet */}
            {catsOpen ? (
                <div className="md:hidden fixed inset-0 z-[900]">
                    <button aria-label="Close categories" className="absolute inset-0 bg-black/40" onClick={() => setCatsOpen(false)} />
                    <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white shadow-2xl" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <div className="text-sm font-extrabold">Categories</div>
                            <button type="button" onClick={() => setCatsOpen(false)} className="rounded-full border p-2 hover:bg-orange-50">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-[72vh] overflow-auto px-4 py-4 space-y-2">
                            {props.categories.map((c) => {
                                const active = String(c.name).toLowerCase() === String(categoryName).toLowerCase();
                                return (
                                    <button
                                        key={c.name}
                                        type="button"
                                        onClick={async () => {
                                            setCatsOpen(false);
                                            await onCategoryPick(c);
                                        }}
                                        className={cn("w-full rounded-2xl border p-3 text-left hover:bg-orange-50", active ? "bg-orange-50 ring-1 ring-orange-200" : "bg-white")}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconBubble src={c.icon} alt={c.name} />
                                            <div className="min-w-0 flex-1">
                                                <div className={cn("truncate text-sm", active ? "font-extrabold text-orange-700" : "font-semibold text-slate-900")}>{c.name}</div>
                                                <div className="text-[11px] font-bold text-slate-500">{Number(c.count || 0).toLocaleString()} ads</div>
                                            </div>
                                            <div className={cn("text-slate-400", active ? "text-orange-600" : "")}>›</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* mobile filters sheet */}
            {filtersOpen ? (
                <div className="md:hidden fixed inset-0 z-[800]">
                    <button aria-label="Close filters" className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
                    <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white shadow-2xl" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <div className="text-sm font-extrabold">Filters</div>
                            <button type="button" onClick={() => setFiltersOpen(false)} className="rounded-full border p-2 hover:bg-orange-50">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-[72vh] overflow-auto px-4 py-4">{FiltersContent}</div>

                        <div className="grid grid-cols-2 gap-2 border-t px-4 py-3">
                            <button type="button" onClick={clearAll} className="h-12 rounded-xl border px-4 text-sm font-extrabold text-slate-700 hover:bg-orange-50">
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    setFiltersOpen(false);
                                    await applyFilters();
                                }}
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