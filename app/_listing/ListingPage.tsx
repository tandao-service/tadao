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

import Category from "@/lib/database/models/category.model";
import Subcategory from "@/lib/database/models/subcategory.model";
import { getRegionsForListing } from "@/lib/home/home.data";

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

    // ✅ NEW for non-vehicle
    type?: string;
    brand?: string;

    layout?: string;
};

function normalizeSlug(s: string) {
    return String(s || "").trim().toLowerCase();
}
function normName(s: any) {
    return String(s || "").trim().toLowerCase();
}

type CategoryListingItem = { slug: string; title: string; subcategory: string; icon?: string };

function getCategoryListings(LISTING_MAP: Record<string, any>, categoryName: string) {
    const items: CategoryListingItem[] = [];
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

async function getQuickFilterForSubcategory(args: { categoryName: string; subcategoryName: string }) {
    try {
        const catDoc: any = await Category.findOne({ name: args.categoryName }).select("_id").lean();
        if (!catDoc?._id) return { field: "", options: [] as string[] };

        const subDoc: any = await Subcategory.findOne({
            category: catDoc._id,
            subcategory: args.subcategoryName,
        })
            .select("fields")
            .lean();

        const fields: any[] = Array.isArray(subDoc?.fields) ? subDoc.fields : [];

        // preference order: type -> make-model -> make -> brand
        const picked =
            fields.find((f) => f?.name === "type" || /type/i.test(String(f?.name || ""))) ||
            fields.find((f) => f?.name === "make-model") ||
            fields.find((f) => f?.name === "make") ||
            fields.find((f) => f?.name === "brand");

        const fieldName = String(picked?.name || "").trim();
        const options = Array.isArray(picked?.options) ? picked.options.map((x: any) => String(x)) : [];

        return { field: fieldName, options };
    } catch {
        return { field: "", options: [] as string[] };
    }
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

type ClientCategory = {
    name: string;
    count: number;
    icon?: string;
    listings: CategoryListingItem[];
    countsBySub: Record<string, number>; // ✅ NEW
    // ✅ NEW: fields per subcategory name
    fieldsBySub: Record<string, any[]>;
};

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

    // ✅ NEW for non-vehicle
    const type = !isVehicle ? String(args.searchParams.type || "").trim() : "";
    const brand = !isVehicle ? String(args.searchParams.brand || "").trim() : "";

    const layout = args.searchParams.layout === "list" ? "list" : "grid";

    const canonical = args.regionSlug
        ? `https://tadaomarket.com/r/${args.regionSlug}/${listingSlug}`
        : `https://tadaomarket.com/${listingSlug}`;

    // base list (slugs) for this category
    let categoryListings = getCategoryListings(LISTING_MAP, categoryName);

    // ✅ homepage tree (truth for counts + icons) + used for category switcher
    const homeTree = await getCategoryTreeForHome(80, 200).catch(() => []);

    // Build ALL categories nav data (category -> its subcategory listings with icons)
    const categories: ClientCategory[] = [];

    for (const c of homeTree as any[]) {
        const catName = String(c?.name || "").trim();
        if (!catName) continue;

        // icon & count from home tree
        const catIcon = String(c?.icon || "").trim();
        const catCount = Number(c?.count || 0);

        // build icon map per subcategory
        const iconBySub: Record<string, string> = {};
        const countsBySub: Record<string, number> = {};
        const fieldsBySub: Record<string, any[]> = {};
        if (c?.subcategories?.length) {
            for (const s of c.subcategories as any[]) {
                const subName = String(s?.name || "").trim();
                const subIcon = String(s?.icon || "").trim();
                if (subName && subIcon) iconBySub[subName] = subIcon;
                const subCount = Number(s?.count || 0);
                if (subName) countsBySub[subName] = subCount;
                fieldsBySub[subName] = Array.isArray(s?.fields) ? s.fields : [];
            }
        }
        // map listing slugs for this category
        let listings = getCategoryListings(LISTING_MAP, catName);
        listings = listings.map((it) => ({
            ...it,
            icon: iconBySub[it.subcategory] || it.icon || "",
        }));

        // only include categories that have listings
        if (listings.length) {
            categories.push({
                name: catName,
                count: catCount,
                icon: catIcon || "",
                listings,
                countsBySub, // ✅
                fieldsBySub, // ✅
            });
        }
    }

    // current category in homeTree (for counts + icons)
    const homeCat = (homeTree || []).find((c: any) => normName(c?.name) === normName(categoryName));

    // ✅ MUST be plain objects {}
    const iconBySub: Record<string, string> = {};
    const homeCountsBySub: Record<string, number> = {};

    if (homeCat?.subcategories?.length) {
        for (const s of homeCat.subcategories as any[]) {
            const name = String(s?.name || "").trim();
            const icon = String(s?.icon || "").trim();
            const count = Number(s?.count || 0);
            if (!name) continue;
            if (icon) iconBySub[name] = icon;
            homeCountsBySub[name] = count;
        }
    }

    const homeTotalInCategory = Number(homeCat?.count || 0);

    // inject icons into current categoryListings
    categoryListings = categoryListings.map((it) => ({
        ...it,
        icon: iconBySub[it.subcategory] || it.icon || "",
    }));

    // Sidebar (filters/options) — initial only
    const sidebar = await getListingSidebarOptions({
        category: categoryName,
        subcategory: String(listing.subcategory || "").trim(), // ✅ ADD THIS
        regionSlug: args.regionSlug,
        min: minN,
        max: maxN,
        membership: membership ? (membership as any) : undefined,
        county,
        town,
        make,
        model,
        q,
        type,
        brand,
    } as any);

    // Fetch ads (initial only)
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
            // ✅ NEW for non-vehicle (if supported in your action, otherwise ignored)
            type: !isVehicle ? type : undefined,
            brand: !isVehicle ? brand : undefined,
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

        // ✅ NEW for non-vehicle
        if (!isVehicle && type) queryObject.type = type;
        if (!isVehicle && brand) queryObject.brand = brand;

        const res = await getAlldynamicAd({
            page,
            limit: PAGE_SIZE,
            queryObject,
        });

        items = res?.data || [];
        totalPages = Number(res?.totalPages || 1);
        regionLabel = "Kenya";
    }

    // ✅ quick filter options for current subcategory (type/make/make-model/brand)
    const quickFilter = await getQuickFilterForSubcategory({
        categoryName,
        subcategoryName: String(listing.subcategory || "").trim(),
    });
    const { regions } = await getRegionsForListing(listingSlug);
    return (
        <ListingPageClient
            title={String(listing.title || "Listings")}
            regionLabel={regionLabel}
            canonical={canonical}
            activeListingSlug={listingSlug}
            regionSlug={args.regionSlug || ""}
            regions={regions}
            // ✅ category switching data
            categories={categories}

            categoryName={categoryName}
            categoryListings={categoryListings}
            sidebar={sidebar}
            isVehicle={isVehicle}
            items={items}
            totalPages={totalPages}
            page={page}
            homeCountsBySub={homeCountsBySub}
            homeTotalInCategory={homeTotalInCategory}
            quickFilter={quickFilter}
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

                // ✅ NEW
                type,
                brand,
            }}
        />
    );
}