"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSellSubscriptionCheckout } from "@/lib/actions/sell.actions";
import PackageSelector, { type PackageSelectorPackage } from "./PackageSelector";

type Props = {
    open: boolean;
    onClose: () => void;
    packagesList: PackageSelectorPackage[];
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
    user,
    daysRemaining = 0,
    packname = "",
}: Props) {
    const router = useRouter();

    const [activePackage, setActivePackage] = useState<PackageSelectorPackage | null>(null);
    const [activeButton, setActiveButton] = useState(1);
    const [activeButtonTitle, setActiveButtonTitle] = useState("1 month");
    const [periodInput, setPeriodInput] = useState("1 month");
    const [loading, setLoading] = useState(false);

    const remainingAds = Number(user?.subscription?.remainingAds ?? 0);

    useEffect(() => {
        if (!open || !packagesList.length) return;

        const starter =
            packagesList.find((p) => String(p.name).toLowerCase() !== "free") ||
            packagesList[0] ||
            null;

        setActivePackage(starter);
        setActiveButton(1);
        setActiveButtonTitle("1 month");
        setPeriodInput("1 month");
    }, [open, packagesList]);

    const selectedSubCategory = ""; // modal is generic; no assets-financing logic here unless you pass it in

    const selectedAmount = useMemo(() => {
        if (!activePackage) return 0;
        const prices = activePackage.price || [];
        const row = prices[activeButton];
        return Number(row?.amount || 0);
    }, [activePackage, activeButton]);

    const handleSelectPackage = (pack: PackageSelectorPackage) => {
        setActivePackage(pack);

        const prices = pack.price || [];
        const row = prices[activeButton];
        if (row?.period) {
            setPeriodInput(row.period);
        }
    };

    const handleSelectPeriod = (index: number, title: string) => {
        setActiveButton(index);
        setActiveButtonTitle(title);

        if (!activePackage) return;
        const prices = activePackage.price || [];
        const row = prices[index];
        setPeriodInput(row?.period || title);
    };

    const handleContinue = async () => {
        if (!activePackage) return;

        try {
            setLoading(true);

            const result = await createSellSubscriptionCheckout({
                userId,
                packageId: activePackage._id,
                period: periodInput || activeButtonTitle || "1 month",
                returnUrl: "/sell?payStatus=success",
            });

            if (!result?.ok || !result?.transactionId) {
                throw new Error(result?.message || "Failed to create checkout");
            }

            router.push(`/pay/${result.transactionId}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3">
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#1E2528] shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Subscription required
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your current package cannot post more ads. Choose a package to continue.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2D3236]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    <PackageSelector
                        packagesList={packagesList}
                        selectedSubCategory={selectedSubCategory}
                        activePackage={activePackage}
                        activeButton={activeButton}
                        activeButtonTitle={activeButtonTitle}
                        currentPlanName={packname}
                        remainingAds={remainingAds}
                        daysRemaining={daysRemaining}
                        showFree={false}
                        compact
                        onSelectPackage={handleSelectPackage}
                        onSelectPeriod={handleSelectPeriod}
                    />

                    <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-[#2D3236] dark:border-orange-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Selected package</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                    {activePackage?.name || "—"}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                                <p className="font-semibold text-orange-600">
                                    Ksh {selectedAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!activePackage || loading}
                        className="mt-4 w-full rounded-lg bg-black text-white py-3 hover:bg-gray-900 disabled:opacity-60"
                    >
                        {loading ? "Preparing checkout..." : "Continue to payment"}
                    </button>
                </div>
            </div>
        </div>
    );
}