// app/[regionSlug]/[listingSlug]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { getAdsForRegionListing, getListingMapFromDB } from "@/lib/actions/dynamicAd.actions";

const PAGE_SIZE = 24;

// ✅ Cache listing map per request (and across calls in same render)
const getListingMap = cache(async () => {
    return await getListingMapFromDB();
});

// ✅ safer region conversion (keeps hyphens)
function regionFromSlug(slug: string) {
    // "elgeyo-marakwet" -> "Elgeyo-Marakwet"
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("-");
}

function parseNum(v?: string) {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

type Props = {
    params: { regionSlug: string; listingSlug: string };
    searchParams: { page?: string; min?: string; max?: string; sort?: string; membership?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const LISTING_MAP = await getListingMap();
    const listing = LISTING_MAP[params.listingSlug];

    const regionName = regionFromSlug(params.regionSlug);

    const titleText = listing?.title ?? "Listings";
    const title = `${titleText} in ${regionName} | Tadao Market`;
    const description = `Browse ${titleText.toLowerCase()} in ${regionName}. Filter by price, location, and more on Tadao Market.`;
    const canonical = `https://tadaomarket.com/${params.regionSlug}/${params.listingSlug}`;

    // If listing slug not found, do not index
    if (!listing) {
        return {
            title: "Category not found | Tadao Market",
            robots: { index: false, follow: false },
            alternates: { canonical },
        };
    }

    return { title, description, alternates: { canonical } };
}

export default async function ListingPage({ params, searchParams }: Props) {
    const LISTING_MAP = await getListingMap();
    const listing = LISTING_MAP[params.listingSlug];

    if (!listing) {
        return (
            <main className="p-6">
                <h1 className="text-2xl font-bold">Category not found</h1>
            </main>
        );
    }

    const page = Math.max(1, parseNum(searchParams.page) || 1);
    const min = parseNum(searchParams.min);
    const max = parseNum(searchParams.max);

    const sort =
        searchParams.sort === "price_asc" ? "price_asc" :
            searchParams.sort === "price_desc" ? "price_desc" :
                searchParams.sort === "new" ? "new" :
                    "recommeded";

    const membership =
        searchParams.membership === "verified" ? "verified" :
            searchParams.membership === "unverified" ? "unverified" :
                undefined;

    const { items, total, totalPages, regionName } = await getAdsForRegionListing({
        regionSlug: params.regionSlug,
        category: listing.category,
        subcategory: listing.subcategory,
        page,
        limit: PAGE_SIZE,
        min,
        max,
        sort,
        membership,
    });

    const canonical = `https://tadaomarket.com/${params.regionSlug}/${params.listingSlug}`;

    const breadcrumbsLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://tadaomarket.com" },
            { "@type": "ListItem", position: 2, name: regionName, item: `https://tadaomarket.com/${params.regionSlug}` },
            { "@type": "ListItem", position: 3, name: listing.title, item: canonical },
        ],
    };

    const itemListLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: items.map((ad: any, idx: number) => ({
            "@type": "ListItem",
            position: (page - 1) * PAGE_SIZE + idx + 1,
            url: `https://tadaomarket.com/property/${ad._id}`,
            name: ad?.data?.title || "Listing",
        })),
    };

    return (
        <main className="mx-auto max-w-6xl p-4">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

            <h1 className="text-2xl font-bold">
                {listing.title} in {regionName}
            </h1>

            <div className="mt-3 text-sm text-gray-600">
                {Number(total).toLocaleString()} results •{" "}
                <a className="underline" href={canonical}>Canonical</a>
            </div>

            <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {items.map((ad: any) => (
                    <Link
                        key={String(ad._id)}
                        href={`/property/${ad._id}`}
                        className="rounded-xl border p-3 hover:shadow"
                    >
                        <div className="font-semibold line-clamp-2">{ad?.data?.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                            {ad?.data?.area || regionName}
                        </div>
                        <div className="mt-2 font-bold">
                            KSh {Number(ad?.data?.price || 0).toLocaleString()}
                        </div>
                    </Link>
                ))}
            </section>

            <div className="mt-6 flex items-center gap-3">
                {page > 1 && (
                    <Link className="underline" href={`/${params.regionSlug}/${params.listingSlug}?page=${page - 1}`}>
                        Prev
                    </Link>
                )}
                <span>Page {page} of {totalPages}</span>
                {page < totalPages && (
                    <Link className="underline" href={`/${params.regionSlug}/${params.listingSlug}?page=${page + 1}`}>
                        Next
                    </Link>
                )}
            </div>
        </main>
    );
}