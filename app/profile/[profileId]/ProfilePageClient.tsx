"use client";

import { useAuth } from "@/app/hooks/useAuth";
import DashboardMyads from "@/components/home/dashboardMyads";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    profileId: string;
    shopAcc: any;
    loans: any;
};

export default function ProfilePageClient({
    profileId,
    shopAcc,
    loans,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { authUser, user, appUserId, loading } = useAuth();
    const sortby = searchParams.get("sortby") || "Newest";

    const resolveAdId = (ad: any) =>
        ad?._id || ad?.adId?._id || ad?.adId || ad?.id || "";

    const resolveUserId = String(user?._id || "");
    const userName =
        user?.businessname ||
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
        user?.username ||
        "User";

    return (
        <DashboardMyads
            userId={resolveUserId}
            shopAcc={shopAcc}
            sortby={sortby}
            userImage={user?.imageUrl || user?.photo || ""}
            userName={userName}
            user={user}
            loans={loans}
            emptyTitle="No ads have been created yet"
            emptyStateSubtext="This seller has not posted any ads yet."
            limit={20}
            queryObject={{ profileId, sortby }}
            collectionType="Ads_Organized"
            urlParamName="adsPage"
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
                const id = resolveAdId(ad);
                if (!id) return;
                router.push(`/ads/${id}/update`);
            }}
            handleAdView={(ad: any) => {
                const id = resolveAdId(ad);
                if (!id) return;
                router.push(`/ads/${id}`);
            }}
            handleOpenReview={(value: any) => {
                const id = value?._id || value?.id || profileId;
                router.push(`/profile/${id}?tab=reviews`);
            }}
            handleOpenChatId={(value: string) => {
                const id = value || profileId;
                if (!id) return;
                router.push(`/profile-messages/${id}`);
            }}
            handleOpenSettings={() => router.push("/settings")}
            handleOpenShop={(shopId: any) => {
                const id = shopId?._id || shopId?.id || shopId || "";
                if (!id) return;
                router.push(`/profile/${id}`);
            }}
            handleOpenPerfomance={() => router.push("/performance")}
            handlePay={(id: string) => {
                if (!id) return;
                router.push(`/pay/${id}`);
            }}
        />
    );
}