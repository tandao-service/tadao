
import { redirect } from "next/navigation";
import DashboardSell from "@/components/home/DashboardSell";
import { getAdById } from "@/lib/actions/dynamicAd.actions";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { useAuth } from "@/app/hooks/useAuth";
import { useSellCategoryTree } from "@/app/hooks/useSellCategoryTree";
import { useEffect, useState } from "react";

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
    const { authUser, user, appUserId, loading } = useAuth();
    const { subcategoryList, ensureCategoryTree } = useSellCategoryTree();
    const [treeReady, setTreeReady] = useState(subcategoryList.length > 0);

    useEffect(() => {
        let mounted = true;

        async function boot() {
            if (subcategoryList.length > 0) {
                if (mounted) setTreeReady(true);
                return;
            }

            const tree = await ensureCategoryTree();
            if (mounted) setTreeReady(Array.isArray(tree) && tree.length > 0);
        }

        boot();

        return () => {
            mounted = false;
        };
    }, [subcategoryList.length, ensureCategoryTree]);


    if (!user) {
        redirect(`/auth?returnTo=/ads/${params.id}/update`);
    }


    if (!user) {
        redirect("/auth");
    }
    const ad: any = await getAdById(params.id).catch(() => null);
    if (!ad) {
        redirect("/");
    }

    const organizerId =
        String(ad?.organizer?._id || ad?.organizer?.id || "").trim();
    const currentUserId = String(user?._id || "").trim();

    if (!organizerId || organizerId !== currentUserId) {
        redirect(`/ads/${params.id}`);
    }

    return (
        <DashboardSell
            userId={String(user._id)}
            user={user}
            userImage={user?.imageUrl || user?.photo || ""}
            userName={
                user?.businessname ||
                `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                user?.username ||
                "User"
            }
            type="Update"
            ad={ad}
            adId={String(ad._id)}
            packagesList={[]}
            category={ad?.data?.category || ""}
            subcategory={ad?.data?.subcategory || ""}
            subcategoryList={Array.isArray(subcategoryList) ? subcategoryList : []}
            payStatus=""
            tx=""
        />
    );
}