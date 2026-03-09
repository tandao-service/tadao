"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { HomeCategoryNode } from "@/lib/home/home.categories";
import { flattenHomeCategoryTreeForSell } from "@/lib/home/home.sell";

type SellCategoryTreeContextType = {
    categoryTree: HomeCategoryNode[];
    setCategoryTree: (tree: HomeCategoryNode[]) => void;
    subcategoryList: any[];
};

const SellCategoryTreeContext = createContext<SellCategoryTreeContextType | undefined>(undefined);

export function SellCategoryTreeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [categoryTree, setCategoryTree] = useState<HomeCategoryNode[]>([]);

    const subcategoryList = useMemo(() => {
        return flattenHomeCategoryTreeForSell(categoryTree);
    }, [categoryTree]);

    return (
        <SellCategoryTreeContext.Provider
            value={{ categoryTree, setCategoryTree, subcategoryList }}
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