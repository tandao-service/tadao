"use client";

import DashboardPerformance from "@/components/home/dashboardPerfomance";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";


export default function PerformancePageClient() {
    const router = useRouter();

    const { authUser, user, appUserId, loading } = useAuth();
    const userName =
        user?.businessname ||
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
        user?.username ||
        "User";

    const userImage = user?.imageUrl || user?.photo || "";

    return (
        <DashboardPerformance
            userId={user?._id ?? ""}
            userName={userName}
            userImage={userImage}
            loggedId={user?._id ?? ""}
            sortby="Newest"
            user={user}
            emptyTitle="No ads found"
            emptyStateSubtext="You have not created any ads yet."
            limit={20}
            collectionType="Ads_Organized"
            urlParamName="page"
            isAdCreator={true}
            onClose={() => router.push("/")}
            handleOpenBook={() => router.push("/bookmarks")}
            handleOpenPlan={() => router.push("/plan")}
            handleOpenChat={() => router.push("/profile-messages")}
            handleOpenSell={() => router.push("/create-ad")}
            handleOpenAbout={() => router.push("/about")}
            handleOpenTerms={() => router.push("/terms")}
            handleOpenPrivacy={() => router.push("/privacy")}
            handleOpenSafety={() => router.push("/safety")}
            handleAdEdit={(ad: any) => {
                const id = ad?._id || ad?.adId?._id || ad?.adId || ad?.id;
                if (!id) return;
                router.push(`/ads/${id}/update`);
            }}
            handleAdView={(ad: any) => {
                const id = ad?._id || ad?.adId?._id || ad?.adId || ad?.id;
                if (!id) return;
                router.push(`/ads/${id}`);
            }}
            handleOpenReview={(value: any) => {

                router.push(`/profile/${value}?tab=reviews`);
            }}
            handleOpenShop={(shopId: any) => {

                if (!shopId) return;
                router.push(`/profile/${shopId}`);
            }}
            handleOpenSettings={() => router.push("/settings")}
            handleOpenPerfomance={() => router.push("/performance")}
            handlePay={(id: string) => {
                if (!id) return;
                router.push(`/pay/${id}`);
            }}
        />
    );
}