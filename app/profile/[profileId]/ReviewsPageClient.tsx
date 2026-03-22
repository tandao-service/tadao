"use client";

import ReviewsComponent from "@/components/shared/ReviewsComponent";
import { useRouter } from "next/navigation";


type Props = {
    profileId: string;
    recipient: any;
    currentUser: any;
};

export default function ReviewsPageClient({
    profileId,
    recipient,
    currentUser,
}: Props) {
    const router = useRouter();

    const displayName =
        currentUser?.businessname ||
        `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
        currentUser?.username ||
        "User";

    const uid = String(currentUser?._id || "");
    const photoURL = currentUser?.imageUrl || currentUser?.photo || "";

    return (
        <ReviewsComponent
            displayName={displayName}
            uid={uid}
            photoURL={photoURL}
            user={currentUser}
            recipient={recipient}
            onClose={() => router.push(`/profile/${profileId}`)}
            handleOpenBook={() => router.push("/bookmarks")}
            handleOpenPlan={() => router.push("/plan")}
            handleOpenChat={() => router.push("/profile-messages")}
            handleOpenSell={() => router.push("/create-ad")}
            handleOpenAbout={() => router.push("/about")}
            handleOpenTerms={() => router.push("/terms")}
            handleOpenPrivacy={() => router.push("/privacy")}
            handleOpenSafety={() => router.push("/safety")}
            handleOpenSettings={() => router.push("/settings")}
            handleOpenChatId={(value: string) =>
                router.push(`/profile-messages/${value}`)
            }
            handleOpenReview={(value: string) => {
                const id = value || profileId;
                router.push(`/profile/${id}?tab=reviews`);
            }}
            handleOpenShop={(shopId: any) => {
                const id = shopId?._id || shopId?.id || shopId || profileId;
                router.push(`/profile/${id}`);
            }}
            handleOpenPerfomance={() => router.push("/performance")}
            handlePay={(id: string) => router.push(`/pay/${id}`)}
        />
    );
}