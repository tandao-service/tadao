"use client";

import { useRouter } from "next/navigation";
import SettingsComponent from "@/components/shared/SettingsComponent";
import { useAuth } from "../hooks/useAuth";


export default function SettingsPageClient() {
    const router = useRouter();
    const { authUser, user, appUserId, loading } = useAuth();

    return (
        <SettingsComponent
            userId={user?._id ?? ""}
            user={user}
            onClose={() => router.push("/")}
            handleOpenSell={() => router.push("/create-ad")}
            handleOpenBook={() => router.push("/bookmarks")}
            handleOpenPlan={() => router.push("/plan")}
            handleOpenChat={() => router.push("/profile-messages")}
            handleOpenAbout={() => router.push("/about")}
            handleOpenTerms={() => router.push("/terms")}
            handleOpenPrivacy={() => router.push("/privacy")}
            handleOpenSafety={() => router.push("/safety")}
            handleOpenSettings={() => router.push("/settings")}
            handleOpenShop={(shopId: string) => {
                router.push(`/profile/${shopId}`);
            }}
            handlePay={(id: string) => {
                if (!id) return;
                router.push(`/pay/${id}`);
            }}
            handleCategory={(value: string) => {

            }}
            handleOpenPerfomance={() => router.push("/performance")}
            handleOpenSearchTab={(value: string) => {

            }}
        />
    );
}