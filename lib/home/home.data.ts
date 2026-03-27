// lib/home/home.data.ts
import "server-only";

import { connectToDatabase } from "@/lib/database";
import DynamicAd from "@/lib/database/models/dynamicAd.model";
import User from "@/lib/database/models/user.model";
import Packages from "@/lib/database/models/packages.model";
import Subcategory from "@/lib/database/models/subcategory.model";
import { getCategoryTreeForHome } from "./home.categories";

// ---------- TYPES ----------
export type HomeCategory = {
    id: string;
    name: string;
    icon?: string;
    count: number;
};

export type HomeAd = {
    id: string;
    title: string;
    price: number | null;
    region: string;
    area?: string;
    image?: string | null;
    isFeatured?: boolean;
    isTop?: boolean;
    isVerifiedSeller?: boolean;
    imagesCount?: number;
    category?: string;
    subcategory?: string;
    listingSlug?: string;
};

export type HomeRegion = {
    slug: string;
    name: string;
    count: number;
};

// ---------- HELPERS ----------
function slugify(input: string) {
    return String(input || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function stripIntent(name: string) {
    return String(name ?? "")
        .replace(/for\s+rent/gi, "")
        .replace(/for\s+sale/gi, "")
        .replace(/to\s+let/gi, "")
        .replace(/rent(al)?/gi, "")
        .replace(/lease/gi, "")
        .trim();
}

function detectMode(name: string): "rent" | "sale" {
    const s = String(name ?? "").toLowerCase();
    return /\b(rent|rental|to let|letting|lease)\b/.test(s) ? "rent" : "sale";
}

function toListingSlugFromName(name: string) {
    const mode = detectMode(name);
    const base = stripIntent(name);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";
    return `${slugify(base)}-${suffix}`;
}

// basic emoji map
const CATEGORY_EMOJI: Record<string, string> = {
    Vehicle: "🚗",
    Property: "🏠",
    "Phones & Tablets": "📱",
    Electronics: "💻",
    Jobs: "💼",
    Services: "🛠️",
    Fashion: "👕",
    "Home, Furniture & Appliances": "🛋️",
};

function generateListingSlugForHome(data: any) {
    const category = String(data?.category || "").trim().toLowerCase();
    const subcategory = String(data?.subcategory || "").trim();

    if (subcategory) {
        const s = subcategory.toLowerCase();



        return toListingSlugFromName(subcategory);
    }

    if (category) {

        return toListingSlugFromName(category);
    }

    return "ads";
}

function toHomeAd(doc: any): HomeAd {
    const data = doc?.data || {};
    const boost = doc?.boost || {};
    const organizer = doc?.organizer || {};

    const imageUrls: string[] = Array.isArray(data.imageUrls) ? data.imageUrls : [];
    const image =
        (typeof data.coverThumbUrl === "string" && data.coverThumbUrl) ||
        (typeof imageUrls?.[0] === "string" && imageUrls[0]) ||
        null;

    const isVerifiedSeller = Boolean(
        organizer?.verified?.accountverified === true ||
        organizer?.verified?.[0]?.accountverified === true
    );

    const now = Date.now();
    const featuredUntil = boost?.featuredUntil ? new Date(boost.featuredUntil).getTime() : 0;
    const topUntil = boost?.topUntil ? new Date(boost.topUntil).getTime() : 0;

    const featuredActive = boost?.isFeatured === true && featuredUntil > now;
    const topActive = boost?.isTop === true && topUntil > now;

    return {
        id: String(doc?._id || ""),
        title: String(data?.title || "Untitled"),
        price:
            data?.price === null || data?.price === undefined || data?.price === ""
                ? null
                : Number(String(data.price).replace(/,/g, "")) || null,
        region: String(data?.region || ""),
        area: String(data?.area || ""),
        image,
        isFeatured: featuredActive,
        isTop: topActive,
        isVerifiedSeller,
        imagesCount: imageUrls?.length || 0,
        category: String(data?.category || ""),
        subcategory: String(data?.subcategory || ""),
        listingSlug: generateListingSlugForHome(data),
    };
}

// ---------- MAIN ----------
export async function getHomePageData() {
    await connectToDatabase();

    const now = new Date();

    // 1) CATEGORIES
    const catAgg = await DynamicAd.aggregate([
        { $match: { adstatus: "Active" } },
        {
            $group: {
                _id: "$data.category",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 12 },
    ]);

    const categories: HomeCategory[] = catAgg
        .filter((x: any) => x?._id)
        .map((x: any) => {
            const name = String(x._id);
            return {
                id: slugify(name),
                name,
                icon: CATEGORY_EMOJI[name] || "🧩",
                count: Number(x.count || 0),
            };
        });

    // 2) FEATURED
    const promotedPipeline: any[] = [
        { $match: { adstatus: "Active" } },
        {
            $addFields: {
                featuredActive: {
                    $and: [
                        { $eq: ["$boost.isFeatured", true] },
                        { $gt: ["$boost.featuredUntil", now] },
                    ],
                },
                topActive: {
                    $and: [
                        { $eq: ["$boost.isTop", true] },
                        { $gt: ["$boost.topUntil", now] },
                    ],
                },
            },
        },
        { $match: { $or: [{ featuredActive: true }, { topActive: true }] } },
        {
            $sort: {
                featuredActive: -1,
                "boost.featuredUntil": -1,
                topActive: -1,
                "boost.topUntil": -1,
                priority: -1,
                createdAt: -1,
            },
        },
        { $limit: 12 },
    ];

    const featuredRaw = await DynamicAd.aggregate(promotedPipeline);

    const populateSpec = [
        { path: "subcategory", model: Subcategory, select: "fields" },
        {
            path: "organizer",
            model: User,
            select: "_id firstName lastName businessname photo imageUrl verified",
        },
        { path: "plan", model: Packages, select: "_id name color imageUrl" },
    ];

    const featuredPop = await DynamicAd.populate(featuredRaw, populateSpec);
    const featured: HomeAd[] = (featuredPop || []).map(toHomeAd);

    // 3) TRENDING
    const trendingQuery = DynamicAd.find(
        { adstatus: "Active" },
        {
            data: 1,
            boost: 1,
            organizer: 1,
            views: 1,
            createdAt: 1,
            priority: 1,
        }
    )
        .sort({ views: -1, priority: -1, createdAt: -1 })
        .limit(28);

    const trendingDocs = await trendingQuery.populate(populateSpec);
    const trending: HomeAd[] = (trendingDocs || []).map(toHomeAd);

    // 4) REGIONS
    const regionAgg = await DynamicAd.aggregate([
        { $match: { adstatus: "Active", "data.region": { $type: "string" } } },
        { $group: { _id: "$data.region", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
    ]);

    const regions: HomeRegion[] = regionAgg
        .filter((x: any) => x?._id)
        .map((x: any) => {
            const name = String(x._id).trim();
            return {
                slug: slugify(name),
                name,
                count: Number(x.count || 0),
            };
        });

    const categoryTree = await getCategoryTreeForHome(12, 12);

    return { categories, featured, trending, regions, categoryTree };
}

// ---------- LISTING REGIONS ----------
export async function getRegionsForListing(listingSlug: string) {
    await connectToDatabase();

    const slug = String(listingSlug || "").trim().toLowerCase();

    const sub: any = await Subcategory.findOne(
        { slug },
        { _id: 1, subcategory: 1 }
    ).lean();

    if (!sub?._id) return [] as HomeRegion[];

    const regionAgg = await DynamicAd.aggregate([
        {
            $match: {
                adstatus: "Active",
                "data.subcategory": String(sub.subcategory || "").trim(),
                "data.region": { $type: "string" },
            },
        },
        { $group: { _id: "$data.region", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 50 },
    ]);

    return regionAgg
        .filter((x: any) => x?._id)
        .map((x: any) => {
            const name = String(x._id).trim();
            return {
                slug: slugify(name),
                name,
                count: Number(x.count || 0),
            };
        });
}