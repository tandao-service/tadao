import { unstable_cache } from "next/cache";
import { getCategoryTreeForHome } from "@/lib/home/home.categories";

export const getGlobalCategoryTree_ = unstable_cache(
    async () => {
        return await getCategoryTreeForHome(80, 200);
    },
    ["global-category-tree"],
    {
        revalidate: 60 * 60, // 1 hour
        tags: ["global-category-tree"],
    }
);
export async function getGlobalCategoryTree() {
    return await getCategoryTreeForHome(80, 200);
}