"use client";

import { useEffect, useState } from "react";
import DashboardSell from "@/components/home/DashboardSell";
import { useAuth } from "@/app/hooks/useAuth";
import { useSellCategoryTree } from "@/app/hooks/useSellCategoryTree";

type Props = {
    category?: string;
    subcategory?: string;
    packagesList?: any[];
    payStatus?: string;
    tx?: string;
};

export default function SellPageClient({
    category = "",
    subcategory = "",
    packagesList = [],
    payStatus = "",
    tx = "",
}: Props) {
    const { authUser, user, appUserId, loading } = useAuth();
    const { subcategoryList, ensureCategoryTree } = useSellCategoryTree();
    const [treeReady, setTreeReady] = useState(subcategoryList.length > 0);

    useEffect(() => {
        let mounted = true;

        async function boot() {
            if (subcategoryList.length > 0) {
                if (mounted) setTreeReady(true);
                return;
            }

            const tree = await ensureCategoryTree();
            if (mounted) setTreeReady(Array.isArray(tree) && tree.length > 0);
        }

        boot();

        return () => {
            mounted = false;
        };
    }, [subcategoryList.length, ensureCategoryTree]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#131B1E]">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                    Loading your session...
                </div>
            </div>
        );
    }

    if (!authUser || !user || !appUserId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#131B1E]">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                    Please sign in to continue.
                </div>
            </div>
        );
    }

    if (!treeReady || !subcategoryList.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#131B1E]">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                    Preparing sell form...
                </div>
            </div>
        );
    }

    return (
        <DashboardSell
            userId={appUserId}
            user={user}
            userName={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
            userImage={user?.photo || user?.imageUrl || authUser?.photoURL || ""}
            type="Create"
            packagesList={packagesList}
            category={category}
            subcategory={subcategory}
            subcategoryList={subcategoryList}
            payStatus={payStatus}
            tx={tx}
        />
    );
}