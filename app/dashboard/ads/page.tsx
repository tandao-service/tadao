"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import TopBar from "@/components/home/TopBar.client";
import MobileBackPill from "@/components/home/MobileBackPill.client";
import { useAuth } from "@/app/hooks/useAuth";
import { getAdByUser } from "@/lib/actions/dynamicAd.actions";
import SellerAdsClient from "./SellerAdsClient";

export default function DashboardAdsPage() {
    const router = useRouter();
    const { authUser, appUserId, loading } = useAuth();

    const [ads, setAds] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (loading) return;

        if (!authUser || !appUserId) {
            router.replace("/auth?redirect_url=/dashboard/ads");
            return;
        }

        let mounted = true;

        async function loadAds() {
            try {
                setPageLoading(true);

                const result = await getAdByUser({
                    userId: String(appUserId),
                    page: 1,
                    limit: 100,
                    sortby: "new",
                    myshop: true,
                });

                if (mounted) {
                    setAds(result?.data || []);
                }
            } catch (error) {
                console.error("Failed to load seller ads:", error);
                if (mounted) setAds([]);
            } finally {
                if (mounted) setPageLoading(false);
            }
        }

        loadAds();

        return () => {
            mounted = false;
        };
    }, [loading, authUser, appUserId, router]);

    const totals = useMemo(() => {
        return ads.reduce(
            (acc: any, ad: any) => {
                acc.totalAds += 1;
                acc.active += ad?.adstatus === "Active" ? 1 : 0;
                acc.pending += ad?.adstatus === "Pending" ? 1 : 0;
                acc.expired += ad?.adstatus === "Expired" ? 1 : 0;
                acc.views += Number(ad?.views || 0);
                acc.calls += Number(ad?.calls || 0);
                acc.whatsapp += Number(ad?.whatsapp || 0);
                acc.inquiries += Number(ad?.inquiries || 0);
                acc.shared += Number(ad?.shared || 0);
                return acc;
            },
            {
                totalAds: 0,
                active: 0,
                pending: 0,
                expired: 0,
                views: 0,
                calls: 0,
                whatsapp: 0,
                inquiries: 0,
                shared: 0,
            }
        );
    }, [ads]);

    if (loading || pageLoading) {
        return (
            <>
                <TopBar />
                <MobileBackPill label="Back" />
                <main className="mx-auto max-w-7xl px-3 pt-[calc(var(--topbar-h,64px)+10px)] pb-8 md:px-4">
                    <div className="overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-sm">
                        <div className="h-28 animate-pulse bg-gradient-to-r from-orange-100 via-orange-50 to-white" />
                        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-20 animate-pulse rounded-2xl bg-slate-100"
                                />
                            ))}
                        </div>
                        <div className="px-4 pb-4 text-sm font-medium text-slate-500">
                            Loading dashboard...
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!authUser || !appUserId) return null;

    return (
        <>
            <TopBar />
            <MobileBackPill label="Back" />
            <main className="mx-auto max-w-7xl px-3 pt-[calc(var(--topbar-h,64px)+10px)] pb-8 md:px-4">
                <SellerAdsClient ads={ads} totals={totals} />
            </main>
        </>
    );
}