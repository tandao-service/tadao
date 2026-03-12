"use client";

import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    useCallback,
} from "react";
import type { HomeCategoryNode } from "@/lib/home/home.categories";
import { flattenHomeCategoryTreeForSell } from "@/lib/home/home.sell";

type SellCategoryTreeContextType = {
    categoryTree: HomeCategoryNode[];
    setCategoryTree: (tree: HomeCategoryNode[]) => void;
    subcategoryList: any[];
    ensureCategoryTree: () => Promise<HomeCategoryNode[]>;
};

const SellCategoryTreeContext = createContext<SellCategoryTreeContextType | undefined>(undefined);

export function SellCategoryTreeProvider({
    children,
    initialCategoryTree = [],
}: {
    children: React.ReactNode;
    initialCategoryTree?: HomeCategoryNode[];
}) {
    const [categoryTree, setCategoryTree] = useState<HomeCategoryNode[]>(initialCategoryTree);

    const subcategoryList = useMemo(() => {
        return flattenHomeCategoryTreeForSell(categoryTree);
    }, [categoryTree]);

    const ensureCategoryTree = useCallback(async () => {
        if (categoryTree.length > 0) return categoryTree;

        try {
            const res = await fetch("/api/category-tree", {
                method: "GET",
                cache: "force-cache",
            });

            if (!res.ok) throw new Error("Failed to fetch category tree");

            const json = await res.json();
            const tree = Array.isArray(json?.tree) ? json.tree : [];

            if (tree.length) setCategoryTree(tree);

            return tree;
        } catch (error) {
            console.error("ensureCategoryTree error:", error);
            return [];
        }
    }, [categoryTree]);

    return (
        <SellCategoryTreeContext.Provider
            value={{
                categoryTree,
                setCategoryTree,
                subcategoryList,
                ensureCategoryTree,
            }}
        >
            {children}
        </SellCategoryTreeContext.Provider>
    );
}

export function useSellCategoryTree() {
    const context = useContext(SellCategoryTreeContext);
    if (!context) {
        throw new Error("useSellCategoryTree must be used within SellCategoryTreeProvider");
    }
    return context;
}