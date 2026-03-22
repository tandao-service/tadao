import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";

import ProfilePageClient from "./ProfilePageClient";
import ReviewsPageClient from "./ReviewsPageClient";


type Props = {
    params: {
        profileId: string;
    };
    searchParams?: {
        tab?: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const shopAcc: any = await getUserById(params.profileId).catch(() => null);

    const sellerName =
        shopAcc?.businessname ||
        `${shopAcc?.firstName || ""} ${shopAcc?.lastName || ""}`.trim() ||
        shopAcc?.username ||
        "Seller";

    return {
        title: `${sellerName} | Tadao Market`,
        description: `Browse listings from ${sellerName} on Tadao Market.`,
    };
}

export default async function ProfilePage({ params, searchParams }: Props) {
    const tab = searchParams?.tab || "ads";

    const [appUser] = await Promise.all([
        getUserById(params.profileId).catch(() => null),
    ]);

    if (!appUser) {
        redirect("/");
    }

    const currentUser =
        appUser || {
            _id: "",
            firstName: "",
            lastName: "",
            username: "",
            imageUrl: "",
            photo: "",
            currentpack: { name: "Free", color: "#f97316" },
            transaction: null,
            user: null,
        };

    const loans = {
        data: [],
        totalPages: 0,
    };

    // ✅ NEW: Reviews route handling
    if (tab === "reviews") {
        return (
            <ReviewsPageClient
                profileId={params.profileId}
                recipient={currentUser}
                currentUser={currentUser}
            />
        );
    }

    // ✅ DEFAULT: existing profile page
    return (
        <ProfilePageClient
            profileId={params.profileId}
            shopAcc={currentUser}
            loans={loans}
        />
    );
}