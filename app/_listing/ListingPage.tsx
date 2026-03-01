// app/_listing/ListingPage.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { getAlldynamicAd, getAdsForRegionListing, getListingMapFromDB } from "@/lib/actions/dynamicAd.actions";
import SmartPropertyCard from "@/components/shared/SmartPropertyCard";

const PAGE_SIZE = 24;

const getListingMap = cache(async () => {
    return await getListingMapFromDB();
});

function regionFromSlug(slug: string) {
    // keep hyphens as you were doing earlier
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
    sort?: string;     // for region pages
    sortby?: string;   // for national pages (your existing getAlldynamicAd expects sortby)
    membership?: string;
};

function normalizeSlug(s: string) {
    return String(s || "").trim().toLowerCase();
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
    const description = `Browse ${titleText.toLowerCase()} in ${regionName}. Filter by price, location, and more on Tadao Market.`;

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
    const min = parseNum(args.searchParams.min);
    const max = parseNum(args.searchParams.max);

    const membership =
        args.searchParams.membership === "verified"
            ? "verified"
            : args.searchParams.membership === "unverified"
                ? "unverified"
                : undefined;

    const canonical = args.regionSlug
        ? `https://tadaomarket.com/r/${args.regionSlug}/${listingSlug}`
        : `https://tadaomarket.com/${listingSlug}`;

    // ✅ 1) REGION LISTING: /r/nairobi/cars-for-sale
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

        const { items, total, totalPages, regionName: regionNameFromQuery } =
            await getAdsForRegionListing({
                regionSlug: args.regionSlug,
                category: listing.category,
                subcategory: listing.subcategory,
                page,
                limit: PAGE_SIZE,
                min,
                max,
                sort,
                membership,
            });

        const finalRegionName = regionNameFromQuery || regionName;

        return (
            <main className="mx-auto max-w-6xl p-4">
                <h1 className="text-2xl font-bold">
                    {listing.title} in {finalRegionName}
                </h1>

                <div className="mt-3 text-sm text-gray-600">
                    {Number(total).toLocaleString()} results •{" "}
                    <a className="underline" href={canonical}>Canonical</a>
                </div>

                <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                    {items.map((ad: any) => (
                        <SmartPropertyCard key={String(ad._id)} ad={ad} regionFallback={finalRegionName} />
                    ))}
                </section>

                <div className="mt-6 flex items-center gap-3">
                    {page > 1 && (
                        <Link className="underline" href={`/r/${args.regionSlug}/${listingSlug}?page=${page - 1}`}>
                            Prev
                        </Link>
                    )}
                    <span>Page {page} of {totalPages}</span>
                    {page < totalPages && (
                        <Link className="underline" href={`/r/${args.regionSlug}/${listingSlug}?page=${page + 1}`}>
                            Next
                        </Link>
                    )}
                </div>
            </main>
        );
    }

    // ✅ 2) NATIONAL LISTING: /cars-for-sale (NO REGION FILTER)
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
    if (min !== undefined || max !== undefined) {
        queryObject.price = `${min || 0}-${max || 999999999}`;
    }

    const res = await getAlldynamicAd({
        page,
        limit: PAGE_SIZE,
        queryObject,
    });

    const items = res?.data || [];
    const totalPages = res?.totalPages || 1;

    return (
        <main className="mx-auto max-w-6xl p-4">
            <h1 className="text-2xl font-bold">{listing.title} in Kenya</h1>

            <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                {items.map((ad: any) => (
                    <SmartPropertyCard key={String(ad._id)} ad={ad} regionFallback="Kenya" />
                ))}
            </section>

            <div className="mt-6 flex items-center gap-3">
                {page > 1 && (
                    <Link className="underline" href={`/${listingSlug}?page=${page - 1}`}>
                        Prev
                    </Link>
                )}
                <span>Page {page} of {totalPages}</span>
                {page < totalPages && (
                    <Link className="underline" href={`/${listingSlug}?page=${page + 1}`}>
                        Next
                    </Link>
                )}
            </div>
        </main>
    );
}