"use client";

import DashboardSell from "@/components/home/DashboardSell";
import { useAuth } from "@/app/hooks/useAuth";
import { useSellCategoryTree } from "@/app/hooks/useSellCategoryTree";

type Props = {
    category?: string;
    subcategory?: string;
};

export default function SellPageClient({
    category = "",
    subcategory = "",
}: Props) {
    const { authUser, user, appUserId, loading } = useAuth();
    const { subcategoryList } = useSellCategoryTree();

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