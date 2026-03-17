"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSellSubscriptionCheckout } from "@/lib/actions/sell.actions";

type PriceRow = {
    amount: number;
    period: string;
};

type Package = {
    _id: string;
    name: string;
    description?: string;
    features?: { title?: string }[] | string[];
    price?: PriceRow[];
    price2?: PriceRow[];
    color?: string;
    priority?: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    packagesList: Package[];
    userId: string;
    user: any;
    daysRemaining?: number;
    packname?: string;
};

export default function SubscriptionRequiredModal({
    open,
    onClose,
    packagesList,
    userId,
}: Props) {
    const router = useRouter();
    const [selectedPackageId, setSelectedPackageId] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("1 month");
    const [loading, setLoading] = useState(false);

    const paidPackages = useMemo(
        () => packagesList.filter((p) => String(p.name).toLowerCase() !== "free"),
        [packagesList]
    );

    const selectedPackage = paidPackages.find((p) => p._id === selectedPackageId);

    const selectedAmount = useMemo(() => {
        const prices = selectedPackage?.price || [];
        const row = prices.find(
            (x) => String(x.period).toLowerCase() === String(selectedPeriod).toLowerCase()
        );
        return Number(row?.amount || 0);
    }, [selectedPackage, selectedPeriod]);

    if (!open) return null;

    const handleContinue = async () => {
        if (!selectedPackageId) return;

        try {
            setLoading(true);

            const res = await createSellSubscriptionCheckout({
                userId,
                packageId: selectedPackageId,
                period: selectedPeriod,
                returnUrl: "/sell?payStatus=success",
            });

            if (!res?.ok || !res.transactionId) {
                throw new Error(res?.message || "Unable to create payment.");
            }

            router.push(`/pay/${res.transactionId}?returnTo=/sell?payStatus=success&tx=${res.transactionId}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#1f2428] shadow-xl p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-semibold">Subscription required</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Your free package has reached its maximum listings. Select a package to continue posting.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 rounded border text-sm"
                    >
                        Close
                    </button>
                </div>

                <div className="mt-4 grid gap-3">
                    {paidPackages.map((pack) => (
                        <button
                            key={pack._id}
                            onClick={() => setSelectedPackageId(pack._id)}
                            className={`text-left border rounded-lg p-4 transition ${selectedPackageId === pack._id
                                ? "border-orange-500 ring-2 ring-orange-200"
                                : "border-gray-200 dark:border-gray-700"
                                }`}
                        >
                            <div className="font-semibold">{pack.name}</div>
                            {pack.description && (
                                <div className="text-sm text-gray-500 mt-1">{pack.description}</div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="text-sm font-medium block mb-2">Choose period</label>
                    <div className="flex flex-wrap gap-2">
                        {["1 week", "1 month", "3 months", "6 months", "1 year"].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-3 py-2 rounded-full text-sm border ${selectedPeriod === period
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "border-gray-300 dark:border-gray-700"
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-5 rounded-lg bg-gray-50 dark:bg-[#2b3137] p-4">
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="text-2xl font-bold">
                        KES {selectedAmount.toLocaleString()}
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedPackageId || loading}
                        className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50"
                    >
                        {loading ? "Preparing payment..." : "Continue to Pay"}
                    </button>
                </div>
            </div>
        </div>
    );
}