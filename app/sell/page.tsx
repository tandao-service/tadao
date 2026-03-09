"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import DashboardSell from "@/components/home/DashboardSell";
import { useSellCategoryTree } from "@/app/hooks/useSellCategoryTree";

export default function SellPage() {
    const searchParams = useSearchParams();
    const { authUser, user, appUserId, loading } = useAuth();
    const { subcategoryList } = useSellCategoryTree();

    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";

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
        return null;
    }

    if (!subcategoryList.length) {
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
            packagesList={[]}
            category={category}
            subcategory={subcategory}
            subcategoryList={subcategoryList}
        />
    );
}