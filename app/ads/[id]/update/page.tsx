import { redirect } from "next/navigation";
import { getAdById } from "@/lib/actions/dynamicAd.actions";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import UpdateAdClientPage from "./UpdateAdClientPage";
import { useAuth } from "@/app/hooks/useAuth";

type Props = {
    params: {
        id: string;
    };
};

export const metadata = {
    title: "Update Ad | Tadao Market",
    description: "Edit and update your ad on Tadao Market.",
};

export default async function UpdateAdPage({ params }: Props) {
    const { user } = await useAuth();

    if (!user) {
        redirect(`/auth?returnTo=/ads/${params.id}/update`);
    }

    if (!user) {
        redirect(`/auth?returnTo=/ads/${params.id}/update`);
    }

    const ad: any = await getAdById(params.id).catch(() => null);

    if (!ad) {
        redirect("/");
    }

    const organizerId = String(ad?.organizer?._id || ad?.organizer?.id || "").trim();
    const currentUserId = String(user?._id || "").trim();

    if (!organizerId || organizerId !== currentUserId) {
        redirect(`/ads/${params.id}`);
    }

    return (
        <UpdateAdClientPage
            ad={ad}
            user={user}
        />
    );
}