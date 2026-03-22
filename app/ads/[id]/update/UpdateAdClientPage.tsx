"use client";

import { useEffect, useState } from "react";
import DashboardSell from "@/components/home/DashboardSell";
import { useSellCategoryTree } from "@/app/hooks/useSellCategoryTree";

type Props = {
    ad: any;
    user: any;
};

export default function UpdateAdClientPage({ ad, user }: Props) {
    const { subcategoryList, ensureCategoryTree } = useSellCategoryTree();
    const [treeReady, setTreeReady] = useState(
        Array.isArray(subcategoryList) && subcategoryList.length > 0
    );

    useEffect(() => {
        let mounted = true;

        async function boot() {
            if (Array.isArray(subcategoryList) && subcategoryList.length > 0) {
                if (mounted) setTreeReady(true);
                return;
            }

            try {
                const tree = await ensureCategoryTree();
                if (mounted) {
                    setTreeReady(Array.isArray(tree) && tree.length > 0);
                }
            } catch (error) {
                if (mounted) setTreeReady(false);
            }
        }

        boot();

        return () => {
            mounted = false;
        };
    }, [subcategoryList, ensureCategoryTree]);

    return (
        <DashboardSell
            userId={String(user?._id || "")}
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
            adId={String(ad?._id || "")}
            packagesList={[]}
            category={ad?.data?.category || ""}
            subcategory={ad?.data?.subcategory || ""}
            subcategoryList={treeReady && Array.isArray(subcategoryList) ? subcategoryList : []}
            payStatus=""
            tx=""
        />
    );
}