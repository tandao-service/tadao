import type { Metadata } from "next";
import { redirect } from "next/navigation";
// adjust these imports to your exact action paths if needed
import { getUserById, getUserByClerkId } from "@/lib/actions/user.actions";
import ProfilePageClient from "./ProfilePageClient";

type Props = {
    params: {
        profileId: string;
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

export default async function ProfilePage({ params }: Props) {

    const [appUser] = await Promise.all([
        getUserById(params.profileId).catch(() => null)
    ]);

    // keep this fallback shape safe for DashboardMyads
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

    // if later you have a real loans action, replace this
    const loans = {
        data: [],
        totalPages: 0,
    };

    return (
        <ProfilePageClient
            profileId={params.profileId}
            shopAcc={currentUser}
            loans={loans}
        />
    );
}