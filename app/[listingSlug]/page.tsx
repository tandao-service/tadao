import type { Metadata } from "next";
import ListingPageUI, { buildListingMetadata } from "@/app/_listing/ListingPage";

type Props = {
    params: { listingSlug: string };
    searchParams: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return buildListingMetadata({ listingSlug: params.listingSlug });
}

export default async function Page({ params, searchParams }: Props) {
    return ListingPageUI({ listingSlug: params.listingSlug, searchParams });
}