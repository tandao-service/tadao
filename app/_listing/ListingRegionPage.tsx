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

import {
    getCategoryTreeForHome,
} from "@/lib/home/home.categories";

import Category from "@/lib/database/models/category.model";
import Subcategory from "@/lib/database/models/subcategory.model";

import { getRegionsForListing } from "@/lib/home/home.data";

const PAGE_SIZE = 24;

/* =========================================================
   LISTING MAP
========================================================= */

const getListingMap = cache(async () => {
    return await getListingMapFromDB();
});

/* =========================================================
   HELPERS
========================================================= */

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

function normalizeSlug(s: string) {
    return String(s || "").trim().toLowerCase();
}

function normName(s: any) {
    return String(s || "").trim().toLowerCase();
}

function normalizeSort(v?: string) {
    const s = String(v || "").trim().toLowerCase();

    if (s === "new") return "new";
    if (s === "lowest") return "lowest";
    if (s === "highest") return "highest";

    return "recommended";
}

/* =========================================================
   SEARCH PARAMS
========================================================= */

type ListingSearchParams = {
    page?: string;

    min?: string;
    max?: string;

    sort?: string;

    membership?: string;

    county?: string;
    town?: string;

    make?: string;
    model?: string;

    q?: string;

    // Non-vehicle filters
    type?: string;
    brand?: string;

    layout?: string;
};

/* =========================================================
   CATEGORY TYPES
========================================================= */

type CategoryListingItem = {
    slug: string;
    title: string;
    subcategory: string;
    icon?: string;
};

type ClientCategory = {
    name: string;
    count: number;
    icon?: string;

    listings: CategoryListingItem[];

    countsBySub: Record<string, number>;

    fieldsBySub: Record<string, any[]>;
};

/* =========================================================
   GET CATEGORY LISTINGS
========================================================= */

function getCategoryListings(
    LISTING_MAP: Record<string, any>,
    categoryName: string
) {
    const items: CategoryListingItem[] = [];

    for (const [slug, entry] of Object.entries(LISTING_MAP)) {
        if (!entry) continue;

        if (
            String(entry.category || "").trim() !==
            String(categoryName || "").trim()
        ) {
            continue;
        }

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

/* =========================================================
   QUICK FILTER
========================================================= */

async function getQuickFilterForSubcategory(args: {
    categoryName: string;
    subcategoryName: string;
}) {
    try {
        const catDoc: any = await Category.findOne({
            name: args.categoryName,
        })
            .select("_id")
            .lean();

        if (!catDoc?._id) {
            return {
                field: "",
                options: [] as string[],
            };
        }

        const subDoc: any = await Subcategory.findOne({
            category: catDoc._id,
            subcategory: args.subcategoryName,
        })
            .select("fields")
            .lean();

        const fields: any[] = Array.isArray(subDoc?.fields)
            ? subDoc.fields
            : [];

        // Priority:
        // type -> make-model -> make -> brand
        const picked =
            fields.find(
                (f) =>
                    f?.name === "type" ||
                    /type/i.test(String(f?.name || ""))
            ) ||
            fields.find((f) => f?.name === "make-model") ||
            fields.find((f) => f?.name === "make") ||
            fields.find((f) => f?.name === "brand");

        const fieldName = String(picked?.name || "").trim();

        const options = Array.isArray(picked?.options)
            ? picked.options.map((x: any) => String(x))
            : [];

        return {
            field: fieldName,
            options,
        };
    } catch (error) {
        console.error(
            "getQuickFilterForSubcategory error:",
            error
        );

        return {
            field: "",
            options: [] as string[],
        };
    }
}

/* =========================================================
   METADATA
========================================================= */

export async function buildListingMetadata(args: {
    listingSlug: string;
    regionSlug?: string;
}): Promise<Metadata> {
    const LISTING_MAP = await getListingMap();

    const listingSlug = normalizeSlug(args.listingSlug);

    const listing = LISTING_MAP[listingSlug];

    const regionName = args.regionSlug
        ? regionFromSlug(args.regionSlug)
        : "Kenya";

    const titleText = listing?.title ?? "Listings";

    const title =
        `${titleText} in ${regionName} | Tadao Market`;

    const description =
        `Browse ${String(titleText).toLowerCase()} in ${regionName}. ` +
        `Filter by price, location, and more on Tadao Market.`;

    const canonical = args.regionSlug
        ? `https://tadaomarket.com/r/${args.regionSlug}/${listingSlug}`
        : `https://tadaomarket.com/${listingSlug}`;

    if (!listing) {
        return {
            title: "Category not found | Tadao Market",

            robots: {
                index: false,
                follow: false,
            },

            alternates: {
                canonical,
            },
        };
    }

    return {
        title,
        description,

        alternates: {
            canonical,
        },
    };
}

/* =========================================================
   LISTING PAGE
========================================================= */

export default async function ListingPageUI(args: {
    listingSlug: string;
    regionSlug?: string;
    searchParams: ListingSearchParams;
}) {
    /* =====================================================
       1. LISTING MAP
    ===================================================== */

    const LISTING_MAP = await getListingMap();

    const listingSlug = normalizeSlug(args.listingSlug);

    const listing = LISTING_MAP[listingSlug];

    if (!listing) {
        return (
            <main className="p-6">
                <h1 className="text-2xl font-bold">
                    Category not found
                </h1>
            </main>
        );
    }

    /* =====================================================
       2. URL / FILTER PARAMS
    ===================================================== */

    const page = Math.max(
        1,
        parseNum(args.searchParams.page) || 1
    );

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

    const county = String(
        args.searchParams.county || ""
    ).trim();

    const town = String(
        args.searchParams.town || ""
    ).trim();

    const q = String(
        args.searchParams.q || ""
    ).trim();

    /* =====================================================
       3. CATEGORY
    ===================================================== */

    const categoryName = String(
        listing.category || ""
    ).trim();

    const isVehicle =
        categoryName.toLowerCase() === "vehicle";

    const make = isVehicle
        ? String(args.searchParams.make || "").trim()
        : "";

    const model = isVehicle
        ? String(args.searchParams.model || "").trim()
        : "";

    const type = !isVehicle
        ? String(args.searchParams.type || "").trim()
        : "";

    const brand = !isVehicle
        ? String(args.searchParams.brand || "").trim()
        : "";

    const layout =
        args.searchParams.layout === "list"
            ? "list"
            : "grid";

    const sort = normalizeSort(
        args.searchParams.sort
    );

    const canonical = args.regionSlug
        ? `https://tadaomarket.com/r/${args.regionSlug}/${listingSlug}`
        : `https://tadaomarket.com/${listingSlug}`;

    /* =====================================================
       4. CATEGORY LISTINGS
    ===================================================== */

    let categoryListings =
        getCategoryListings(
            LISTING_MAP,
            categoryName
        );

    /* =====================================================
       5. CATEGORY TREE

       Keep your regionSlug here so when visiting:
       /r/nairobi/cars-for-sale

       category/subcategory counts remain Nairobi-specific.
    ===================================================== */

    const homeTree =
        await getCategoryTreeForHome(
            80,
            200,
            args.regionSlug
        ).catch((error) => {
            console.error(
                "getCategoryTreeForHome error:",
                error
            );

            return [];
        });

    /* =====================================================
       6. BUILD CATEGORY SWITCHER
    ===================================================== */

    const categories: ClientCategory[] = [];

    for (const c of homeTree as any[]) {
        const catName = String(
            c?.name || ""
        ).trim();

        if (!catName) continue;

        const catIcon = String(
            c?.icon || ""
        ).trim();

        const catCount = Number(
            c?.count || 0
        );

        const iconBySub: Record<string, string> = {};

        const countsBySub: Record<string, number> = {};

        const fieldsBySub: Record<string, any[]> = {};

        if (c?.subcategories?.length) {
            for (const s of c.subcategories as any[]) {
                const subName = String(
                    s?.name || ""
                ).trim();

                const subIcon = String(
                    s?.icon || ""
                ).trim();

                if (subName && subIcon) {
                    iconBySub[subName] = subIcon;
                }

                const subCount = Number(
                    s?.count || 0
                );

                if (subName) {
                    countsBySub[subName] = subCount;
                }

                if (subName) {
                    fieldsBySub[subName] =
                        Array.isArray(s?.fields)
                            ? s.fields
                            : [];
                }
            }
        }

        let listings =
            getCategoryListings(
                LISTING_MAP,
                catName
            );

        listings = listings.map((it) => ({
            ...it,

            icon:
                iconBySub[it.subcategory] ||
                it.icon ||
                "",
        }));

        if (listings.length) {
            categories.push({
                name: catName,

                count: catCount,

                icon: catIcon || "",

                listings,

                countsBySub,

                fieldsBySub,
            });
        }
    }

    /* =====================================================
       7. CURRENT CATEGORY INFO
    ===================================================== */

    const homeCat = (homeTree || []).find(
        (c: any) =>
            normName(c?.name) ===
            normName(categoryName)
    );

    const iconBySub: Record<string, string> = {};

    const homeCountsBySub: Record<string, number> = {};

    if (homeCat?.subcategories?.length) {
        for (const s of homeCat.subcategories as any[]) {
            const name = String(
                s?.name || ""
            ).trim();

            const icon = String(
                s?.icon || ""
            ).trim();

            const count = Number(
                s?.count || 0
            );

            if (!name) continue;

            if (icon) {
                iconBySub[name] = icon;
            }

            homeCountsBySub[name] = count;
        }
    }

    const homeTotalInCategory = Number(
        homeCat?.count || 0
    );

    categoryListings =
        categoryListings.map((it) => ({
            ...it,

            icon:
                iconBySub[it.subcategory] ||
                it.icon ||
                "",
        }));

    /* =====================================================
       8. START INDEPENDENT REQUESTS IMMEDIATELY

       IMPORTANT PERFORMANCE CHANGE:

       OLD:
       sidebar -> wait
       ads -> wait
       quick filters -> wait
       regions -> wait

       NEW:
       start sidebar
       start quick filter
       start regions
       start ads
       await everything together
    ===================================================== */

    const currentSubcategory =
        String(
            listing.subcategory || ""
        ).trim();

    const sidebarPromise =
        getListingSidebarOptions({
            category: categoryName,

            // Keep the current subcategory filter.
            subcategory:
                currentSubcategory,

            regionSlug:
                args.regionSlug,

            min:
                minN,

            max:
                maxN,

            membership:
                membership
                    ? (membership as any)
                    : undefined,

            county,

            town,

            make,

            model,

            q,

            type,

            brand,
        } as any);

    const quickFilterPromise =
        getQuickFilterForSubcategory({
            categoryName,

            subcategoryName:
                currentSubcategory,
        });

    const regionsPromise =
        getRegionsForListing(
            listingSlug
        );

    /* =====================================================
       9. ADS PROMISE
    ===================================================== */

    let adsPromise: Promise<any>;

    let fallbackRegionName = "Kenya";

    if (args.regionSlug) {
        /* -------------------------------------------------
           REGION LISTINGS
        ------------------------------------------------- */

        const regionName =
            regionFromSlug(
                args.regionSlug
            );

        fallbackRegionName =
            regionName;

        const regionSort =
            sort === "lowest"
                ? "price_asc"
                : sort === "highest"
                    ? "price_desc"
                    : sort === "new"
                        ? "new"
                        : "recommended";

        adsPromise =
            getAdsForRegionListing({
                regionSlug:
                    args.regionSlug,

                category:
                    listing.category,

                subcategory:
                    currentSubcategory,

                page,

                limit:
                    PAGE_SIZE,

                min:
                    minN,

                max:
                    maxN,

                sort:
                    regionSort,

                membership:
                    membership
                        ? (membership as any)
                        : undefined,

                county,

                town,

                make:
                    isVehicle
                        ? make
                        : undefined,

                model:
                    isVehicle
                        ? model
                        : undefined,

                q,

                type:
                    !isVehicle
                        ? type
                        : undefined,

                brand:
                    !isVehicle
                        ? brand
                        : undefined,
            } as any);
    } else {
        /* -------------------------------------------------
           ALL KENYA LISTINGS
        ------------------------------------------------- */

        const queryObject: any = {
            category:
                categoryName,

            subcategory:
                currentSubcategory,

            /*
             * Convert the UI sort names to the values
             * expected by the listing query.
             */
            sortby:
                sort === "lowest"
                    ? "price_asc"
                    : sort === "highest"
                        ? "price_desc"
                        : sort === "new"
                            ? "new"
                            : "recommended",
        };

        if (membership) {
            queryObject.membership =
                membership;
        }

        if (
            minN !== undefined ||
            maxN !== undefined
        ) {
            queryObject.price =
                `${minN || 0}-${maxN || 999999999}`;
        }

        if (county) {
            queryObject.county =
                county;
        }

        if (town) {
            queryObject.town =
                town;
        }

        if (q) {
            queryObject.q =
                q;
        }

        if (isVehicle && make) {
            queryObject.make =
                make;
        }

        if (isVehicle && model) {
            queryObject.model =
                model;
        }

        if (!isVehicle && type) {
            queryObject.type =
                type;
        }

        if (!isVehicle && brand) {
            queryObject.brand =
                brand;
        }

        adsPromise =
            getAlldynamicAd({
                page,

                limit:
                    PAGE_SIZE,

                queryObject,
            });
    }

    /* =====================================================
       10. WAIT FOR ALL REQUESTS IN PARALLEL
    ===================================================== */

    const [
        sidebar,
        quickFilter,
        regions,
        adsResult,
    ] = await Promise.all([
        sidebarPromise,
        quickFilterPromise,
        regionsPromise,
        adsPromise,
    ]);

    /* =====================================================
       11. NORMALIZE ADS RESULT
    ===================================================== */

    let items: any[] = [];

    let totalPages = 1;

    let regionLabel =
        fallbackRegionName;

    if (args.regionSlug) {
        items =
            adsResult?.items ||
            [];

        totalPages =
            Number(
                adsResult?.totalPages ||
                1
            );

        regionLabel =
            adsResult?.regionName ||
            fallbackRegionName;
    } else {
        items =
            adsResult?.data ||
            [];

        totalPages =
            Number(
                adsResult?.totalPages ||
                1
            );

        regionLabel =
            "Kenya";
    }

    /* =====================================================
       12. RENDER
    ===================================================== */

    return (
        <ListingPageClient
            title={String(
                listing.title ||
                "Listings"
            )}
            regionLabel={
                regionLabel
            }
            canonical={
                canonical
            }
            activeListingSlug={
                listingSlug
            }
            regionSlug={
                args.regionSlug ||
                ""
            }
            regions={
                regions
            }

            /* Category switching */
            categories={
                categories
            }

            categoryName={
                categoryName
            }

            categoryListings={
                categoryListings
            }

            sidebar={
                sidebar
            }

            isVehicle={
                isVehicle
            }

            items={
                items
            }

            totalPages={
                totalPages
            }

            page={
                page
            }

            homeCountsBySub={
                homeCountsBySub
            }

            homeTotalInCategory={
                homeTotalInCategory
            }

            quickFilter={
                quickFilter
            }

            selected={{
                q,

                county,

                town,

                make,

                model,

                min,

                max,

                membership,

                sort,

                layout,

                type,

                brand,
            }}
        />
    );
}