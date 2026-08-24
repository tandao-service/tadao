import {
    notFound,
    redirect,
} from "next/navigation";

import {
    getAdById,
} from "@/lib/actions/dynamicAd.actions";

import {
    buildAdPath,
    extractIdFromProductSlug,
    toListingSlugFromName,
} from "@/app/_ad/ad-url";

type Props = {
    params: {
        id: string;
    };
};

export default async function PropertyPage({
    params,
}: Props) {
    const rawIdOrSlug =
        String(
            params.id || ""
        ).trim();

    /*
     * Supports both:
     *
     * /property/6a6738bfce26894ada7b5851
     *
     * and:
     *
     * /property/plot-for-lease-kiambu-6a6738bfce26894ada7b5851
     */
    const extractedId =
        extractIdFromProductSlug(
            rawIdOrSlug
        );

    const adId =
        extractedId ||
        rawIdOrSlug;

    if (!adId) {
        return notFound();
    }

    const ad =
        await getAdById(
            adId
        ).catch(
            () => null
        );

    if (!ad) {
        return notFound();
    }

    const subcategory =
        String(
            ad?.data
                ?.subcategory || ""
        ).trim();

    /*
     * Example:
     * "Land and Plots for Rent"
     *
     * becomes:
     * "land-and-plots-for-rent"
     */
    const listingSlug =
        subcategory
            ? toListingSlugFromName(
                subcategory
            )
            : "property";

    const canonicalPath =
        buildAdPath(
            ad,
            listingSlug
        );

    redirect(
        canonicalPath
    );
}