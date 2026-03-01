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
    icon?: string; // emoji for now
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

// basic emoji map (you can expand later or store icons in DB)
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

function toHomeAd(doc: any): HomeAd {
    const data = doc?.data || {};
    const boost = doc?.boost || {};
    const organizer = doc?.organizer || {};

    const imageUrls: string[] = Array.isArray(data.imageUrls) ? data.imageUrls : [];
    const image =
        (typeof data.coverThumbUrl === "string" && data.coverThumbUrl) ||
        (typeof imageUrls?.[0] === "string" && imageUrls[0]) ||
        null;

    const isVerifiedSeller = Boolean(organizer?.verified?.accountverified);

    // "Active now" flags (same rule as your pipelines)
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
    };
}

// ---------- MAIN ----------
export async function getHomePageData() {
    await connectToDatabase();

    const now = new Date();

    // 1) CATEGORIES (left rail) from active ads grouped by data.category
    // Note: this is the cleanest + fastest because your ads already store category as string.
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

    // 2) FEATURED (promoted feed) — Featured active first, then Top active, then priority/new
    // This matches your existing boosted logic.
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

    // populate after aggregate
    const populateSpec = [
        { path: "subcategory", model: Subcategory, select: "fields" },
        {
            path: "organizer",
            model: User,
            select:
                "_id firstName lastName businessname photo imageUrl verified",
        },
        { path: "plan", model: Packages, select: "_id name color imageUrl" },
    ];

    const featuredPop = await DynamicAd.populate(featuredRaw, populateSpec);
    const featured: HomeAd[] = (featuredPop || []).map(toHomeAd);

    // 3) TRENDING (grid) — most viewed first (fallback to newest)
    // uses your DynamicAd top-level "views" field.
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

    // 4) REGIONS — group by data.region
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