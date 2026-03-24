// app/api/listings/route.ts
import { NextResponse } from "next/server";
import {
  getAlldynamicAd,
  getAdsForRegionListing,
  getListingMapFromDB,
  getListingSidebarOptions,
} from "@/lib/actions/dynamicAd.actions";

import Category from "@/lib/database/models/category.model";
import Subcategory from "@/lib/database/models/subcategory.model";



function normalizeSlug(s: string) {
  return String(s || "").trim().toLowerCase();
}

async function getQuickFilterForSubcategory(args: {
  categoryName: string;
  subcategoryName: string;
}) {
  try {
    const catDoc: any = await Category.findOne({ name: args.categoryName })
      .select("_id")
      .lean();

    if (!catDoc?._id) return { field: "", options: [] as string[] };

    const subDoc: any = await Subcategory.findOne({
      category: catDoc._id,
      subcategory: args.subcategoryName,
    })
      .select("fields")
      .lean();

    const fields: any[] = Array.isArray(subDoc?.fields) ? subDoc.fields : [];

    const picked =
      fields.find((f) => f?.name === "type" || /type/i.test(String(f?.name || ""))) ||
      fields.find((f) => f?.name === "make-model") ||
      fields.find((f) => f?.name === "make") ||
      fields.find((f) => f?.name === "brand");

    const fieldName = String(picked?.name || "").trim();
    const options = Array.isArray(picked?.options)
      ? picked.options.map((x: any) => String(x))
      : [];

    return { field: fieldName, options };
  } catch {
    return { field: "", options: [] as string[] };
  }
}
function parseNum(v: string | null) {
  if (v == null || String(v).trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
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

    const type = String(searchParams.get("type") || "").trim();
    const brand = String(searchParams.get("brand") || "").trim();

    // accept both sort and sortby
    const sortRaw = String(
      searchParams.get("sort") || searchParams.get("sortby") || "recommended"
    ).trim().toLowerCase();

    const sort =
      sortRaw === "lowest"
        ? "lowest"
        : sortRaw === "highest"
          ? "highest"
          : sortRaw === "price_asc"
            ? "price_asc"
            : sortRaw === "price_desc"
              ? "price_desc"
              : sortRaw === "new"
                ? "new"
                : "recommended";

    const LISTING_MAP = await getListingMapFromDB();
    const listing = LISTING_MAP[listingSlug];

    if (!listing) {
      return NextResponse.json(
        {
          items: [],
          totalPages: 1,
          sidebar: {
            subcategoryCounts: {},
            counties: [],
            towns: [],
            townsByCounty: {},
            makes: [],
            models: [],
            totalInCategory: 0,
            types: [],
            brands: [],
          },
          quickFilter: { field: "", options: [] as string[] },
          listingMeta: null,
        },
        { status: 404 }
      );
    }

    const categoryName = String(listing.category || "").trim();
    const subcategoryName = String(listing.subcategory || "").trim();
    const listingTitle = String(listing.title || subcategoryName || "").trim();
    const isVehicle = categoryName.toLowerCase() === "vehicle";

    const [sidebar, quickFilter] = await Promise.all([
      getListingSidebarOptions({
        category: categoryName,
        subcategory: subcategoryName,
        regionSlug: regionSlug || undefined,
        min,
        max,
        membership,
        county,
        town,
        make: isVehicle ? make : undefined,
        model: isVehicle ? model : undefined,
        type: !isVehicle ? type : undefined,
        brand: !isVehicle ? brand : undefined,
        q,
      } as any),
      getQuickFilterForSubcategory({
        categoryName,
        subcategoryName,
      }),
    ]);

    if (regionSlug) {

      const res = await getAdsForRegionListing({
        regionSlug,
        category: categoryName,
        subcategory: subcategoryName,
        page,
        limit,
        min,
        max,
        sort:
          sort === "lowest"
            ? "price_asc"
            : sort === "highest"
              ? "price_desc"
              : sort,
        membership,
        county,
        town,
        make: isVehicle ? make : undefined,
        model: isVehicle ? model : undefined,
        q,
        type: !isVehicle ? type : undefined,
        brand: !isVehicle ? brand : undefined,
      } as any);

      return NextResponse.json({
        items: res?.items || [],
        totalPages: Number(res?.totalPages || 1),
        sidebar,
        quickFilter,
        listingMeta: {
          listingSlug,
          listingTitle,
          categoryName,
          subcategoryName,
          isVehicle,
          regionSlug,
        },
      });
    }

    const queryObject: any = {
      sortby:
        sort === "price_asc"
          ? "lowest"
          : sort === "price_desc"
            ? "highest"
            : sort,
      category: categoryName,
      subcategory: subcategoryName,
    };

    if (membership) queryObject.membership = membership;
    if (min !== undefined || max !== undefined) {
      queryObject.price = `${min || 0}-${max || 999999999}`;
    }
    if (county) queryObject.county = county;
    if (town) queryObject.town = town;
    if (q) queryObject.q = q;

    if (isVehicle && make) queryObject.make = make;
    if (isVehicle && model) queryObject.model = model;

    if (!isVehicle && type) queryObject.type = type;
    if (!isVehicle && brand) queryObject.brand = brand;

    const res = await getAlldynamicAd({ page, limit, queryObject });

    return NextResponse.json({
      items: res?.data || [],
      totalPages: Number(res?.totalPages || 1),
      sidebar,
      quickFilter,
      listingMeta: {
        listingSlug,
        listingTitle,
        categoryName,
        subcategoryName,
        isVehicle,
        regionSlug: null,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to load listings", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}