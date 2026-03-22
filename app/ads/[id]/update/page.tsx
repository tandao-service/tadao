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


    const ad: any = await getAdById(params.id).catch(() => null);

    if (!ad) {
        redirect("/");
    }

    return (
        <UpdateAdClientPage
            ad={ad}

        />
    );
}