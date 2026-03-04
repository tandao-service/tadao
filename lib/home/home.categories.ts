// lib/home/home.categories.ts
import "server-only";
import { connectToDatabase } from "@/lib/database";
import Category from "@/lib/database/models/category.model";
import Subcategory from "@/lib/database/models/subcategory.model";
import DynamicAd from "@/lib/database/models/dynamicAd.model";

export type HomeSubCategory = {
    id: string;
    name: string;
    count: number;
    icon?: string | null;
};

export type HomeCategoryNode = {
    id: string;
    name: string;
    icon?: string | null;
    count: number;
    subcategories: HomeSubCategory[];
};

function slugify(input: string) {
    return String(input || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function safeStr(v: any) {
    return String(v ?? "").trim();
}

/**
 * ✅ Region matching
 * If your DB stores "Nairobi" but the URL uses "nairobi", this makes matching consistent.
 */
function normalizeRegion(v: any) {
    return slugify(safeStr(v));
}

/**
 * ✅ Country counts: call with no regionSlug
 * ✅ Region counts: call with regionSlug e.g. "nairobi"
 */
export async function getCategoryTreeForHome(
    limitCats = 12,
    limitSubsPerCat = 12,
    regionSlug?: string
) {
    await connectToDatabase();

    const regionNorm = regionSlug ? normalizeRegion(regionSlug) : "";

    // ✅ Base match: active ads only
    // ✅ Optional region filter using $expr + $toLower + $trim + regex replace (safe)
    const match: any = { adstatus: "Active" };

    // If you already store `data.regionSlug`, use that instead (faster):
    // match["data.regionSlug"] = regionNorm;

    if (regionNorm) {
        match.$expr = {
            $eq: [
                {
                    $trim: {
                        input: {
                            $toLower: {
                                $replaceAll: {
                                    input: {
                                        $replaceAll: {
                                            input: { $ifNull: ["$data.region", ""] },
                                            find: "&",
                                            replacement: "and",
                                        },
                                    },
                                    find: " ",
                                    replacement: "-",
                                },
                            },
                        },
                    },
                },
                regionNorm,
            ],
        };
    }

    // ✅ 1) counts by category
    const catCounts = await DynamicAd.aggregate([
        { $match: match },
        { $group: { _id: "$data.category", count: { $sum: 1 } } },
    ]);

    const catCountObj: Record<string, number> = Object.create(null);
    for (const row of catCounts as any[]) {
        const key = safeStr(row?._id);
        if (!key) continue;
        catCountObj[key] = Number(row?.count || 0);
    }

    // ✅ 2) counts by (category, subcategory)
    const subCounts = await DynamicAd.aggregate([
        { $match: match },
        {
            $group: {
                _id: { category: "$data.category", subcategory: "$data.subcategory" },
                count: { $sum: 1 },
            },
        },
    ]);

    const subCountObj: Record<string, number> = Object.create(null);
    for (const row of subCounts as any[]) {
        const cat = safeStr(row?._id?.category);
        const sub = safeStr(row?._id?.subcategory);
        if (!cat || !sub) continue;
        subCountObj[`${cat}|||${sub}`] = Number(row?.count || 0);
    }

    // ✅ 3) categories (icon from Category.imageUrl[0])
    const cats = await Category.find({})
        .select("_id name imageUrl")
        .sort({ _id: 1 })
        .lean();

    // ✅ 4) subcategories (icon from Subcategory.imageUrl[0])
    const subcats = await Subcategory.find({})
        .populate({ path: "category", model: Category, select: "name" })
        .select("_id subcategory category imageUrl")
        .lean();

    const byCat: Record<string, any[]> = Object.create(null);

    for (const s of subcats as any[]) {
        const parentName = safeStr(s?.category?.name);
        const subName = safeStr(s?.subcategory);
        if (!parentName || !subName) continue;

        if (!byCat[parentName]) byCat[parentName] = [];
        byCat[parentName].push(s);
    }

    // ✅ 5) Build tree + attach icons
    const tree: HomeCategoryNode[] = (cats || [])
        .map((c: any) => {
            const name = safeStr(c?.name);
            if (!name) return null;

            const total = catCountObj[name] || 0;

            const subsRaw = byCat[name] || [];
            const subs: HomeSubCategory[] = subsRaw
                .map((s: any) => {
                    const subName = safeStr(s?.subcategory);
                    const count = subCountObj[`${name}|||${subName}`] || 0;

                    const subIcon =
                        Array.isArray(s?.imageUrl) && s.imageUrl.length > 0 ? s.imageUrl[0] : null;

                    return {
                        id: slugify(subName),
                        name: subName,
                        count,
                        icon: subIcon,
                    };
                })
                .sort((a, b) => b.count - a.count)
                .slice(0, limitSubsPerCat);

            const catIcon =
                Array.isArray(c?.imageUrl) && c.imageUrl.length > 0 ? c.imageUrl[0] : null;

            return {
                id: slugify(name),
                name,
                icon: catIcon,
                count: total,
                subcategories: subs,
            } as HomeCategoryNode;
        })
        .filter(Boolean) as HomeCategoryNode[];

    tree.sort((a, b) => b.count - a.count);
    return tree.slice(0, limitCats);
}

/**
 * ✅ Total ads in a region (for /r/[regionSlug]/... pages)
 */
export async function getTotalAdsForRegion(regionSlug: string) {
    await connectToDatabase();
    const regionNorm = normalizeRegion(regionSlug);

    const match: any = { adstatus: "Active" };

    // If you store data.regionSlug, use this:
    // match["data.regionSlug"] = regionNorm;

    match.$expr = {
        $eq: [
            {
                $trim: {
                    input: {
                        $toLower: {
                            $replaceAll: {
                                input: {
                                    $replaceAll: {
                                        input: { $ifNull: ["$data.region", ""] },
                                        find: "&",
                                        replacement: "and",
                                    },
                                },
                                find: " ",
                                replacement: "-",
                            },
                        },
                    },
                },
            },
            regionNorm,
        ],
    };

    return DynamicAd.countDocuments(match);
}