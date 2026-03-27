import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { getAdById, getListingMapFromDB } from "@/lib/actions/dynamicAd.actions";
import AdDetailsView from "@/app/_ad/AdDetailsView";
import { buildAdAbsoluteUrl, buildAdPath, extractIdFromProductSlug, safeStr } from "@/app/_ad/ad-url";

type Props = {
    params: {
        listingSlug: string;
        productSlug: string;
    };
};

const getListingMapCached = cache(async () => {
    return await getListingMapFromDB();
});

function normalizeSlug(value: string) {
    return String(value || "").trim().toLowerCase();
}

function stripHtml(input: any) {
    return String(input || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const listingSlug = normalizeSlug(params.listingSlug);
    const productSlug = String(params.productSlug || "");
    const adId = extractIdFromProductSlug(productSlug);

    if (!adId) {
        return {
            title: "Ad not found | Tadao Market",
            robots: { index: false, follow: false },
        };
    }

    const [LISTING_MAP, ad] = await Promise.all([
        getListingMapCached(),
        getAdById(adId).catch(() => null),
    ]);

    if (!ad || !LISTING_MAP[listingSlug]) {
        return {
            title: "Ad not found | Tadao Market",
            robots: { index: false, follow: false },
        };
    }

    const titleText = safeStr(ad?.data?.title)
        ? `${safeStr(ad.data.title)} | Tadao Market`
        : "Listing | Tadao Market";

    const description =
        (ad?.data?.description ? stripHtml(ad.data.description).slice(0, 160) : "") ||
        "Browse listings on Tadao Market.";

    const ogImage =
        ad?.data?.coverThumbUrl ||
        (Array.isArray(ad?.data?.imageUrls) && ad.data.imageUrls.length > 0
            ? ad.data.imageUrls[0]
            : null) ||
        "https://tadaomarket.com/assets/og-image.png";

    const canonical = buildAdAbsoluteUrl(ad, listingSlug);

    return {
        title: titleText,
        description,
        alternates: { canonical },
        openGraph: {
            title: titleText,
            description,
            url: canonical,
            images: [ogImage],
            type: "article",
            siteName: "Tadao Market",
        },
        twitter: {
            card: "summary_large_image",
            title: titleText,
            description,
            images: [ogImage],
        },
    };
}

export default async function Page({ params }: Props) {
    const listingSlug = normalizeSlug(params.listingSlug);
    const productSlug = String(params.productSlug || "");
    const adId = extractIdFromProductSlug(productSlug);

    if (!adId) return notFound();

    const [LISTING_MAP, ad] = await Promise.all([
        getListingMapCached(),
        getAdById(adId).catch(() => null),
    ]);

    if (!ad) return notFound();
    if (!LISTING_MAP[listingSlug]) return notFound();

    const canonicalPath = buildAdPath(ad, listingSlug);
    const currentPath = `/${listingSlug}/${productSlug}`;

    if (currentPath !== canonicalPath) {
        redirect(canonicalPath);
    }

    return <AdDetailsView ad={ad} listingSlug={listingSlug} />;
}