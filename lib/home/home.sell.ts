import type { HomeCategoryNode } from "@/lib/home/home.categories";

export function flattenHomeCategoryTreeForSell(tree: HomeCategoryNode[] = []) {
    const rows: any[] = [];

    for (const cat of tree || []) {
        for (const sub of cat.subcategories || []) {
            rows.push({
                _id: sub.id,
                subcategory: sub.name,
                imageUrl: sub.icon ? [sub.icon] : [],
                fields: Array.isArray(sub.fields) ? sub.fields : [],
                category: {
                    _id: cat.id,
                    name: cat.name,
                    imageUrl: cat.icon ? [cat.icon] : [],
                },
            });
        }
    }

    return rows;
}