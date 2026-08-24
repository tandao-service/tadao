import type { Metadata } from "next";
import {
    notFound,
    redirect,
} from "next/navigation";

import {
    getAdById,
    incrementAdMetric,
} from "@/lib/actions/dynamicAd.actions";

import AdDetailsView from "@/app/_ad/AdDetailsView";

import {
    buildAdAbsoluteUrl,
    buildAdPath,
    extractIdFromProductSlug,
    safeStr,
} from "@/app/_ad/ad-url";

type Props = {
    params: {
        listingSlug: string;
        productSlug: string;
    };
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeSlug(
    value: string
) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function stripHtml(
    input: any
) {
    return String(input || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const listingSlug =
        normalizeSlug(
            params.listingSlug
        );

    const productSlug =
        String(
            params.productSlug ||
            ""
        );

    const adId =
        extractIdFromProductSlug(
            productSlug
        );

    /*
     * Product URL must end with
     * MongoDB ObjectId.
     */
    if (!adId) {
        return {
            title:
                "Ad not found | Tadao Market",

            robots: {
                index: false,
                follow: false,
            },
        };
    }

    /*
     * IMPORTANT:
     *
     * Do not check LISTING_MAP here.
     *
     * Product existence is determined
     * by the ad ID.
     */
    const ad =
        await getAdById(
            adId
        ).catch(
            () => null
        );

    if (!ad) {
        return {
            title:
                "Ad not found | Tadao Market",

            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const titleText =
        safeStr(
            ad?.data?.title
        )
            ? `${safeStr(
                ad.data.title
            )} | Tadao Market`
            : "Listing | Tadao Market";

    const description =
        (
            ad?.data?.description
                ? stripHtml(
                    ad.data
                        .description
                ).slice(
                    0,
                    160
                )
                : ""
        ) ||
        "Browse listings on Tadao Market.";

    const ogImage =
        ad?.data
            ?.coverThumbUrl ||
        (
            Array.isArray(
                ad?.data
                    ?.imageUrls
            ) &&
                ad.data.imageUrls
                    .length > 0
                ? ad.data
                    .imageUrls[0]
                : null
        ) ||
        "https://tadaomarket.com/assets/og-image.png";

    const canonical =
        buildAdAbsoluteUrl(
            ad,
            listingSlug
        );

    return {
        title:
            titleText,

        description,

        alternates: {
            canonical,
        },

        robots: {
            index: true,
            follow: true,
        },

        openGraph: {
            title:
                titleText,

            description,

            url:
                canonical,

            images: [
                ogImage,
            ],

            type:
                "article",

            siteName:
                "Tadao Market",
        },

        twitter: {
            card:
                "summary_large_image",

            title:
                titleText,

            description,

            images: [
                ogImage,
            ],
        },
    };
}

/* =========================================================
   PAGE
========================================================= */

export default async function Page({
    params,
}: Props) {
    const listingSlug =
        normalizeSlug(
            params.listingSlug
        );

    const productSlug =
        String(
            params.productSlug ||
            ""
        );

    /* -----------------------------------------------------
       Extract product MongoDB ID
    ----------------------------------------------------- */

    const adId =
        extractIdFromProductSlug(
            productSlug
        );

    if (!adId) {
        return notFound();
    }

    /* -----------------------------------------------------
       Fetch product directly

       IMPORTANT:
       We intentionally don't validate
       LISTING_MAP[listingSlug].

       This allows URLs such as:

       /property/plot-for-lease-...

       even when "property" isn't a
       LISTING_MAP key.
    ----------------------------------------------------- */

    const ad =
        await getAdById(
            adId
        ).catch(
            () => null
        );

    if (!ad) {
        return notFound();
    }

    /* -----------------------------------------------------
       Canonical URL
    ----------------------------------------------------- */

    const canonicalPath =
        buildAdPath(
            ad,
            listingSlug
        );

    const currentPath =
        `/${listingSlug}/${productSlug}`;

    /*
     * Example:
     *
     * current:
     * /property/plot-for-lease-kiambu-ID
     *
     * canonical:
     * /property/plot-for-lease-kiambu-ID
     *
     * No redirect.
     *
     * If title/region slug changed,
     * redirect to current canonical.
     */
    if (
        currentPath !==
        canonicalPath
    ) {
        redirect(
            canonicalPath
        );
    }

    /* -----------------------------------------------------
       Views
    ----------------------------------------------------- */

    await incrementAdMetric(
        String(ad._id),
        "views"
    );

    /* -----------------------------------------------------
       Render
    ----------------------------------------------------- */

    return (
        <AdDetailsView
            ad={ad}
            listingSlug={
                listingSlug
            }
        />
    );
}