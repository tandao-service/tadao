// app/pay/[orderTrackingId]/PayPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import DashboardPay from "../shared/dashboardPay";
import { getpayTransaction } from "@/lib/actions/transactions.actions";


type Props = {
    orderTrackingId: string;
};

export default function PayPageClient({ orderTrackingId }: Props) {
    const router = useRouter();
    const { user, appUserId, loading, profileLoading } = useAuth();

    const [trans, setTrans] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!loading && !profileLoading && !appUserId) {
            router.replace("/auth");
        }
    }, [loading, profileLoading, appUserId, router]);

    useEffect(() => {
        let mounted = true;

        const loadTransaction = async () => {
            try {
                setPageLoading(true);

                const data = await getpayTransaction(orderTrackingId);
                if (!mounted) return;

                if (data) {
                    setTrans([data]);
                } else {
                    setTrans([]);
                }
            } catch (error) {
                console.error("Failed to load transaction:", error);
                if (mounted) setTrans([]);
            } finally {
                if (mounted) setPageLoading(false);
            }
        };

        if (orderTrackingId) {
            loadTransaction();
        }

        return () => {
            mounted = false;
        };
    }, [orderTrackingId]);

    if (loading || profileLoading || pageLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#131B1E]">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Loading payment...
                </div>
            </main>
        );
    }

    if (!user || !appUserId) return null;

    if (!trans.length) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#131B1E]">
                <div className="rounded-xl border bg-white p-6 dark:bg-[#1f272b]">
                    <h1 className="text-lg font-bold">Transaction not found</h1>
                </div>
            </main>
        );
    }

    return (
        <DashboardPay
            userId={String(user._id)}
            recipientUid=""
            trans={trans}
            user={user}
        />
    );
}