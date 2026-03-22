"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/home/TopBar.client";
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

        if (orderTrackingId) {
            loadTransaction();
        } else {
            setTrans([]);
            setPageLoading(false);
        }

        return () => {
            mounted = false;
        };
    }, [orderTrackingId]);

    if (loading || profileLoading || pageLoading) {
        return (
            <>
                <TopBar />
                <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
                        <div className="rounded-[28px] border border-orange-100 bg-white p-10 text-center shadow-sm">
                            <h1 className="text-2xl font-extrabold text-slate-900">
                                Loading payment...
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Please wait while we fetch your transaction details.
                            </p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!user || !appUserId) return null;

    if (!trans.length) {
        return (
            <>
                <TopBar />
                <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
                        <div className="rounded-[28px] border border-orange-100 bg-white p-10 text-center shadow-sm">
                            <h1 className="text-2xl font-extrabold text-slate-900">
                                Transaction not found
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                We could not find this payment request.
                            </p>
                        </div>
                    </div>
                </main>
            </>
        );
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