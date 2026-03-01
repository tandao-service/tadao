import type { Metadata } from "next";
import ListingPageUI, { buildListingMetadata } from "@/app/_listing/ListingPage";

type Props = {
    params: { regionSlug: string; listingSlug: string };
    searchParams: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return buildListingMetadata({ regionSlug: params.regionSlug, listingSlug: params.listingSlug });
}

export default async function Page({ params, searchParams }: Props) {
    return ListingPageUI({ regionSlug: params.regionSlug, listingSlug: params.listingSlug, searchParams });
}