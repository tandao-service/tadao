"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import DashboardSellMain from "@/components/shared/DashboardSellMain";
import { getallcategories } from "@/lib/actions/subcategory.actions";
import { getAllPackages } from "@/lib/actions/packages.actions";

export default function SellPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { authUser, user, appUserId, loading, profileLoading } = useAuth();

    const [subcategoryList, setSubcategoryList] = useState<any[]>([]);
    const [packagesList, setPackagesList] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";

    useEffect(() => {
        let mounted = true;

        const loadPageData = async () => {
            if (!authUser || !user) {
                setPageLoading(false);
                return;
            }

            try {
                setPageLoading(true);

                const [catsRes, packsRes] = await Promise.all([
                    getallcategories(),
                    getAllPackages(),
                ]);

                if (!mounted) return;

                setSubcategoryList(Array.isArray(catsRes) ? catsRes : []);
                setPackagesList(Array.isArray(packsRes) ? packsRes : []);
            } catch (error) {
                console.error("Failed to load sell page data:", error);
                if (mounted) {
                    setSubcategoryList([]);
                    setPackagesList([]);
                }
            } finally {
                if (mounted) setPageLoading(false);
            }
        };

        loadPageData();

        return () => {
            mounted = false;
        };
    }, [authUser, user]);

    const routeHandlers = useMemo(() => {
        return {
            onClose: () => router.push("/"),
            handleOpenSell: (cat?: string, subcat?: string) => {
                const qs = new URLSearchParams();
                if (cat) qs.set("category", cat);
                if (subcat) qs.set("subcategory", subcat);
                router.replace(`/sell${qs.toString() ? `?${qs.toString()}` : ""}`);
            },
            handleOpenBook: () => router.push("/bookmarks"),
            handleOpenPlan: () => router.push("/pricing"),
            handleOpenChat: () => router.push("/chat"),
            handleOpenAbout: () => router.push("/about"),
            handleOpenTerms: () => router.push("/terms"),
            handleOpenPrivacy: () => router.push("/privacy"),
            handleOpenSafety: () => router.push("/safety"),
            handleOpenSettings: () => router.push("/settings"),
            handleOpenPerfomance: () => router.push("/performance"),
            handleOpenShop: (shopId: string) => {
                if (shopId) router.push(`/profile/${shopId}`);
                else router.push("/profile");
            },
            handleAdView: (ad: any) => {
                const id = ad?._id || ad?.id;
                if (id) router.push(`/ads/${id}`);
            },
            handleCategory: (value: string) => {
                if (!value) return;
                router.push(`/?category=${encodeURIComponent(value)}`);
            },
            handlePay: (id: string) => {
                if (!id) return;
                router.push(`/pay?ad=${encodeURIComponent(id)}`);
            },
        };
    }, [router]);

    if (loading || profileLoading) {
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

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#131B1E]">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                    Preparing your sell form...
                </div>
            </div>
        );
    }

    return (
        <DashboardSellMain
            userId={appUserId}
            user={user}
            userName={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
            userImage={user?.photo || user?.imageUrl || authUser?.photoURL || ""}
            type="Create"
            packagesList={packagesList}
            category={category}
            subcategory={subcategory}
            subcategoryList={subcategoryList}
            popup="sell"
            {...routeHandlers}
        />
    );
}