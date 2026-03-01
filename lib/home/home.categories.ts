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
    icon?: string | null; // ✅ NEW
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

export async function getCategoryTreeForHome(limitCats = 12, limitSubsPerCat = 12) {
    await connectToDatabase();

    // ✅ 1) counts by category
    const catCounts = await DynamicAd.aggregate([
        { $match: { adstatus: "Active" } },
        { $group: { _id: "$data.category", count: { $sum: 1 } } },
    ]);

    const catCountObj: Record<string, number> = Object.create(null);
    for (const row of catCounts as any[]) {
        const key = String(row?._id || "").trim();
        if (!key) continue;
        catCountObj[key] = Number(row?.count || 0);
    }

    // ✅ 2) counts by (category, subcategory)
    const subCounts = await DynamicAd.aggregate([
        { $match: { adstatus: "Active" } },
        {
            $group: {
                _id: { category: "$data.category", subcategory: "$data.subcategory" },
                count: { $sum: 1 },
            },
        },
    ]);

    const subCountObj: Record<string, number> = Object.create(null);
    for (const row of subCounts as any[]) {
        const cat = String(row?._id?.category || "").trim();
        const sub = String(row?._id?.subcategory || "").trim();
        if (!cat || !sub) continue;
        subCountObj[`${cat}|||${sub}`] = Number(row?.count || 0);
    }

    // ✅ 3) categories (icon from Category.imageUrl[0])
    const cats = await Category.find({})
        .select("_id name imageUrl")
        .sort({ _id: 1 })
        .lean();

    const catName = (c: any) => String(c?.name || "").trim();

    // ✅ 4) subcategories (icon from Subcategory.imageUrl[0])
    const subcats = await Subcategory.find({})
        .populate({ path: "category", model: Category, select: "name" })
        .select("_id subcategory category imageUrl") // ✅ include imageUrl
        .lean();

    const byCat: Record<string, any[]> = Object.create(null);

    for (const s of subcats as any[]) {
        const parentName = String(s?.category?.name || "").trim();
        const subName = String(s?.subcategory || "").trim();
        if (!parentName || !subName) continue;

        if (!byCat[parentName]) byCat[parentName] = [];
        byCat[parentName].push(s);
    }

    // ✅ 5) Build tree + attach icons
    const tree: HomeCategoryNode[] = (cats || [])
        .map((c: any) => {
            const name = catName(c);
            if (!name) return null;

            const total = catCountObj[name] || 0;

            const subsRaw = byCat[name] || [];
            const subs: HomeSubCategory[] = subsRaw
                .map((s: any) => {
                    const subName = String(s?.subcategory || "").trim();
                    const count = subCountObj[`${name}|||${subName}`] || 0;

                    const subIcon =
                        Array.isArray(s?.imageUrl) && s.imageUrl.length > 0 ? s.imageUrl[0] : null;

                    return {
                        id: slugify(subName),
                        name: subName,
                        count,
                        icon: subIcon, // ✅ NEW
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