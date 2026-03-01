// app/api/listings/route.ts
import { NextResponse } from "next/server";
import {
  getAlldynamicAd,
  getAdsForRegionListing,
  getListingMapFromDB,
} from "@/lib/actions/dynamicAd.actions";

function parseNum(v?: string | null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeSlug(s: string) {
  return String(s || "").trim().toLowerCase();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const listingSlug = normalizeSlug(searchParams.get("listingSlug") || "");
    const regionSlug = normalizeSlug(searchParams.get("regionSlug") || "");

    const page = Math.max(1, parseNum(searchParams.get("page")) || 1);
    const limit = Math.max(1, parseNum(searchParams.get("limit")) || 24);

    const min = parseNum(searchParams.get("min"));
    const max = parseNum(searchParams.get("max"));

    const membership =
      searchParams.get("membership") === "verified"
        ? "verified"
        : searchParams.get("membership") === "unverified"
          ? "unverified"
          : undefined;

    const county = String(searchParams.get("county") || "").trim();
    const town = String(searchParams.get("town") || "").trim();
    const make = String(searchParams.get("make") || "").trim();
    const model = String(searchParams.get("model") || "").trim();
    const q = String(searchParams.get("q") || "").trim();

    const LISTING_MAP = await getListingMapFromDB();
    const listing = LISTING_MAP[listingSlug];

    if (!listing) {
      return NextResponse.json({ items: [], totalPages: 1 }, { status: 404 });
    }

    // REGION LISTING
    if (regionSlug) {
      const sort =
        searchParams.get("sort") === "price_asc"
          ? "price_asc"
          : searchParams.get("sort") === "price_desc"
            ? "price_desc"
            : searchParams.get("sort") === "new"
              ? "new"
              : "recommeded";

      const res = await getAdsForRegionListing({
        regionSlug,
        category: listing.category,
        subcategory: listing.subcategory,
        page,
        limit,
        min,
        max,
        sort,
        membership,
        county,
        town,
        make,
        model,
        q,
      } as any);

      return NextResponse.json({
        items: res?.items || [],
        totalPages: Number(res?.totalPages || 1),
      });
    }

    // NATIONAL LISTING
    const sortby =
      searchParams.get("sortby") === "lowest"
        ? "lowest"
        : searchParams.get("sortby") === "highest"
          ? "highest"
          : searchParams.get("sortby") === "new"
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
    if (county) queryObject.county = county;
    if (town) queryObject.town = town;
    if (q) queryObject.q = q;
    if (make) queryObject.make = make;
    if (model) queryObject.model = model;

    const res = await getAlldynamicAd({ page, limit, queryObject });

    return NextResponse.json({
      items: res?.data || [],
      totalPages: Number(res?.totalPages || 1),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to load listings", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}