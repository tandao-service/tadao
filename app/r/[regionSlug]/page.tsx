// app/r/[regionSlug]/page.tsx
import { redirect } from "next/navigation";
import { getListingMapFromDB } from "@/lib/actions/dynamicAd.actions";

function normalizeSlug(s: string) {
    return String(s || "").trim().toLowerCase();
}

export default async function RegionLandingPage({
    params,
}: {
    params: { regionSlug: string };
}) {
    const regionSlug = normalizeSlug(params.regionSlug);

    const listingMap = await getListingMapFromDB();
    const listingSlugs = Object.keys(listingMap || {})
        .map(normalizeSlug)
        .filter(Boolean);

    // ✅ choose a stable default
    const preferred =
        listingSlugs.find((s) => s === "cars-for-sale") ||
        listingSlugs.find((s) => s.includes("cars")) ||
        listingSlugs[0] ||
        "listings";

    redirect(`/r/${regionSlug}/${preferred}`);
}