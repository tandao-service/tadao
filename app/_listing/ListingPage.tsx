// app/_listing/ListingPage.tsx
import type { Metadata } from "next";
import { cache } from "react";
import {
    getAlldynamicAd,
    getAdsForRegionListing,
    getListingMapFromDB,
    getListingSidebarOptions,
} from "@/lib/actions/dynamicAd.actions";
import ListingPageClient from "@/app/_listing/ListingPageClient";
import { getCategoryTreeForHome } from "@/lib/home/home.categories";

const PAGE_SIZE = 24;

const getListingMap = cache(async () => {
    return await getListingMapFromDB();
});

function regionFromSlug(slug: string) {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("-");
}

function parseNum(v?: string) {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

type ListingSearchParams = {
    page?: string;
    min?: string;
    max?: string;
    sort?: string;
    sortby?: string;
    membership?: string;

    county?: string;
    town?: string;
    make?: string;
    model?: string;
    q?: string;

    layout?: string;
};

function normalizeSlug(s: string) {
    return String(s || "").trim().toLowerCase();
}

function normName(s: any) {
    return String(s || "").trim().toLowerCase();
}

function slugify(input: string) {
    return String(input || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function stripIntent(name: string) {
    return String(name || "")
        .replace(/\s+for\s+sale\s*$/i, "")
        .replace(/\s+for\s+rent\s*$/i, "")
        .trim();
}

function detectMode(name: string): "sale" | "rent" {
    const n = String(name || "").toLowerCase();
    if (/\bfor\s+rent\b/.test(n) || /\brent\b/.test(n)) return "rent";
    if (/\bfor\s+sale\b/.test(n) || /\bsale\b/.test(n)) return "sale";
    return "sale";
}

function toListingSlugFromName(name: string) {
    const mode = detectMode(name);
    const base = stripIntent(name);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";
    return `${slugify(base)}-${suffix}`;
}

function getCategoryListings(LISTING_MAP: Record<string, any>, categoryName: string) {
    const items: { slug: string; title: string; subcategory: string; icon?: string }[] = [];
    for (const [slug, entry] of Object.entries(LISTING_MAP)) {
        if (!entry) continue;
        if (String(entry.category || "").trim() !== String(categoryName || "").trim()) continue;

        items.push({
            slug,
            title: String(entry.title || slug),
            subcategory: String(entry.subcategory || ""),
            icon: undefined,
        });
    }
    items.sort((a, b) => a.title.localeCompare(b.title));
    return items;
}

export async function buildListingMetadata(args: {
    listingSlug: string;
    regionSlug?: string;
}): Promise<Metadata> {
    const LISTING_MAP = await getListingMap();
    const listingSlug = normalizeSlug(args.listingSlug);
    const listing = LISTING_MAP[listingSlug];

    const regionName = args.regionSlug ? regionFromSlug(args.regionSlug) : "Kenya";
    const titleText = listing?.title ?? "Listings";
    const title = `${titleText} in ${regionName} | Tadao Market`;
    const description = `Browse ${String(titleText).toLowerCase()} in ${regionName}. Filter by price, location, and more on Tadao Market.`;

    const canonical = args.regionSlug
        ? `https://tadaomarket.com/r/${args.regionSlug}/${listingSlug}`
        : `https://tadaomarket.com/${listingSlug}`;

    if (!listing) {
        return {
            title: "Category not found | Tadao Market",
            robots: { index: false, follow: false },
            alternates: { canonical },
        };
    }

    return { title, description, alternates: { canonical } };
}

export default async function ListingPageUI(args: {
    listingSlug: string;
    regionSlug?: string;
    searchParams: ListingSearchParams;
}) {
    const LISTING_MAP = await getListingMap();
    const listingSlug = normalizeSlug(args.listingSlug);
    const listing = LISTING_MAP[listingSlug];

    if (!listing) {
        return (
            <main className="p-6">
                <h1 className="text-2xl font-bold">Category not found</h1>
            </main>
        );
    }

    const page = Math.max(1, parseNum(args.searchParams.page) || 1);

    const minN = parseNum(args.searchParams.min);
    const maxN = parseNum(args.searchParams.max);

    const min = args.searchParams.min || "";
    const max = args.searchParams.max || "";

    const membership =
        args.searchParams.membership === "verified"
            ? "verified"
            : args.searchParams.membership === "unverified"
                ? "unverified"
                : "";

    const county = String(args.searchParams.county || "").trim();
    const town = String(args.searchParams.town || "").trim();
    const q = String(args.searchParams.q || "").trim();

    const categoryName = String(listing.category || "").trim();
    const isVehicle = categoryName.toLowerCase() === "vehicle";

    const make = isVehicle ? String(args.searchParams.make || "").trim() : "";
    const model = isVehicle ? String(args.searchParams.model || "").trim() : "";

    const layout = args.searchParams.layout === "list" ? "list" : "grid";

    const canonical = args.regionSlug
        ? `https://tadaomarket.com/r/${args.regionSlug}/${listingSlug}`
        : `https://tadaomarket.com/${listingSlug}`;

    // ✅ base subcategory list (slugs)
    let categoryListings = getCategoryListings(LISTING_MAP, categoryName);

    // ✅ homepage tree (truth for counts + icons)
    const homeTree = await getCategoryTreeForHome(80, 200).catch(() => []);
    const homeCat = (homeTree || []).find((c: any) => normName(c?.name) === normName(categoryName));

    const iconBySub: Record<string, string> = {};
    const homeCountsBySub: Record<string, number> = {};

    if (homeCat?.subcategories?.length) {
        for (const s of homeCat.subcategories as any[]) {
            const name = String(s?.name || "").trim();
            const icon = String(s?.icon || "").trim();
            const count = Number(s?.count || 0);

            if (name) {
                if (icon) iconBySub[name] = icon;
                homeCountsBySub[name] = count;
            }
        }
    }

    const homeTotalInCategory = Number(homeCat?.count || 0);

    // ✅ inject icons into categoryListings (from homepage tree)
    categoryListings = categoryListings.map((it) => ({
        ...it,
        icon: iconBySub[it.subcategory] || it.icon || "",
    }));

    // Sidebar (filters/options) — may have buggy counts, we'll fallback on client
    const sidebar = await getListingSidebarOptions({
        category: categoryName,
        regionSlug: args.regionSlug,
        min: minN,
        max: maxN,
        membership: membership ? (membership as any) : undefined,
        county,
        town,
        make,
        model,
        q,
    });

    // Fetch ads
    let items: any[] = [];
    let totalPages = 1;
    let regionLabel = "Kenya";

    if (args.regionSlug) {
        const regionName = regionFromSlug(args.regionSlug);

        const sort =
            args.searchParams.sort === "price_asc"
                ? "price_asc"
                : args.searchParams.sort === "price_desc"
                    ? "price_desc"
                    : args.searchParams.sort === "new"
                        ? "new"
                        : "recommeded";

        const res = await getAdsForRegionListing({
            regionSlug: args.regionSlug,
            category: listing.category,
            subcategory: listing.subcategory,
            page,
            limit: PAGE_SIZE,
            min: minN,
            max: maxN,
            sort,
            membership: membership ? (membership as any) : undefined,
            county,
            town,
            make: isVehicle ? make : undefined,
            model: isVehicle ? model : undefined,
            q,
        } as any);

        items = res?.items || [];
        totalPages = Number(res?.totalPages || 1);
        regionLabel = res?.regionName || regionName;
    } else {
        const sortby =
            args.searchParams.sortby === "lowest"
                ? "lowest"
                : args.searchParams.sortby === "highest"
                    ? "highest"
                    : args.searchParams.sortby === "new"
                        ? "new"
                        : "recommeded";

        const queryObject: any = {
            sortby,
            category: listing.category,
            subcategory: listing.subcategory,
        };

        if (membership) queryObject.membership = membership;
        if (minN !== undefined || maxN !== undefined) queryObject.price = `${minN || 0}-${maxN || 999999999}`;

        if (county) queryObject.county = county;
        if (town) queryObject.town = town;
        if (q) queryObject.q = q;

        if (isVehicle && make) queryObject.make = make;
        if (isVehicle && model) queryObject.model = model;

        const res = await getAlldynamicAd({
            page,
            limit: PAGE_SIZE,
            queryObject,
        });

        items = res?.data || [];
        totalPages = Number(res?.totalPages || 1);
        regionLabel = "Kenya";
    }

    const basePath = args.regionSlug ? `/r/${args.regionSlug}/${listingSlug}` : `/${listingSlug}`;

    return (
        // inside return (<ListingPageClient ... />)
        <ListingPageClient
            title={String(listing.title || "Listings")}
            regionLabel={regionLabel}
            canonical={canonical}
            basePath={basePath}
            activeListingSlug={listingSlug}
            regionSlug={args.regionSlug}          // ✅ ADD THIS
            categoryName={categoryName}
            categoryListings={categoryListings}
            sidebar={JSON.parse(JSON.stringify(sidebar || {}))} // ✅ ensure plain
            isVehicle={isVehicle}
            items={items}
            totalPages={totalPages}
            page={page}
            homeCountsBySub={{ ...homeCountsBySub }}           // ✅ ensure plain
            homeTotalInCategory={Number(homeTotalInCategory || 0)}
            selected={{
                q,
                county,
                town,
                make,
                model,
                min,
                max,
                membership,
                sort: String(args.searchParams.sort || "recommeded"),
                sortby: String(args.searchParams.sortby || "recommeded"),
                layout,
            }}
        />
    );
}