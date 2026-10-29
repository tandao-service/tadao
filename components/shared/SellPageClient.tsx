"use client";

import { useEffect, useState } from "react";
import DashboardSell from "@/components/home/DashboardSell";
import TopBar from "@/components/home/TopBar.client";
import { useAuth } from "@/app/hooks/useAuth";
import { useSellCategoryTree } from "@/app/hooks/useSellCategoryTree";
import { Loader2 } from "lucide-react";

type Props = {
    category?: string;
    subcategory?: string;
    packagesList?: any[];
    payStatus?: string;
    tx?: string;
};

function SellPageState({ title, subtitle, busy = false }: {
    title: string;
    subtitle: string;
    busy?: boolean;
}) {
    return (
        <div className="min-h-screen bg-[#EBEEF2] dark:bg-[#131B1E]">
            <TopBar />
            <main className="mx-auto w-full max-w-[1120px] px-3 pt-2 sm:px-4 lg:px-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1B2225] sm:p-8">
                    <div className="flex items-center gap-3">
                        {busy ? (
                            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-orange-500" />
                        ) : (
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">!</span>
                        )}
                        <div>
                            <h1 className="text-base font-bold text-slate-900 dark:text-white">{title}</h1>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function SellPageClient({
    category = "",
    subcategory = "",
    packagesList = [],
    payStatus = "",
    tx = "",
}: Props) {
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
        void boot();
        return () => { mounted = false; };
    }, [subcategoryList.length, ensureCategoryTree]);

    if (loading) {
        return <SellPageState title="Loading your session" subtitle="Checking your Tadao Market account." busy />;
    }

    if (!authUser || !user || !appUserId) {
        return <SellPageState title="Sign in to continue" subtitle="Please sign in to create or edit an advertisement." />;
    }

    if (!treeReady || !subcategoryList.length) {
        return <SellPageState title="Preparing ad categories" subtitle="Loading the available categories and listing fields." busy />;
    }

    return (
        <DashboardSell
            userId={appUserId}
            user={user}
            userName={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
            userImage={user?.photo || user?.imageUrl || authUser?.photoURL || ""}
            type="Create"
            packagesList={packagesList}
            category={category}
            subcategory={subcategory}
            subcategoryList={subcategoryList}
            payStatus={payStatus}
            tx={tx}
        />
    );
}
