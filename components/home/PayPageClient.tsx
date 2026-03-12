"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/hooks/useAuth";
import { getpayTransaction } from "@/lib/actions/transactions.actions";
import DashboardPay from "../shared/dashboardPay";


type Props = {
    orderTrackingId: string;
    returnTo: string;
};

export default function PayPageClient({ orderTrackingId, returnTo }: Props) {
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
                setTrans(data ? [data] : []);
            } catch (error) {
                console.error("Failed to load transaction:", error);
                if (mounted) setTrans([]);
            } finally {
                if (mounted) setPageLoading(false);
            }
        };

        loadTransaction();

        return () => {
            mounted = false;
        };
    }, [orderTrackingId]);

    if (loading || profileLoading || pageLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading payment...</div>;
    }

    if (!user || !appUserId) return null;

    if (!trans.length) {
        return <div className="min-h-screen flex items-center justify-center">Transaction not found.</div>;
    }

    return (
        <DashboardPay
            userId={String(user._id)}
            trans={trans}
            user={user}
            callbackurl={returnTo}

        />
    );
}