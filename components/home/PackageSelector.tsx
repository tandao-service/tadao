"use client";

import React, { useMemo } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

type PackagePrice = {
    amount: number;
    period: string;
};

type PackageFeature = {
    title?: string;
};

export type PackageSelectorPackage = {
    imageUrl?: string;
    name: string;
    _id: string;
    description?: string;
    price: PackagePrice[];
    features: PackageFeature[] | string[];
    color?: string;
    priority: number;
    price2?: PackagePrice[];
};

type PackageSelectorProps = {
    packagesList: PackageSelectorPackage[];
    selectedSubCategory: string;
    activePackage: PackageSelectorPackage | null;
    activeButton: number;
    activeButtonTitle: string;
    currentPlanName?: string;
    remainingAds?: number;
    daysRemaining?: number;
    title?: string;
    subtitle?: string;
    showFree?: boolean;
    compact?: boolean;
    onSelectPackage: (pack: PackageSelectorPackage) => void;
    onSelectPeriod: (index: number, title: string) => void;
};

const PERIOD_LABELS_NON_FINANCING = [
    { index: 0, label: "1 week" },
    { index: 1, label: "1 month" },
    { index: 2, label: "3 months" },
    { index: 3, label: "6 months" },
    { index: 4, label: "1 year" },
];

const PERIOD_LABELS_FINANCING = [
    { index: 0, label: "1 month" },
    { index: 1, label: "3 months" },
    { index: 2, label: "6 months" },
    { index: 3, label: "1 year" },
];

function getFeatureText(feature: string | PackageFeature) {
    return typeof feature === "string" ? feature : feature?.title || "";
}

export default function PackageSelector({
    packagesList,
    selectedSubCategory,
    activePackage,
    activeButton,
    activeButtonTitle,
    currentPlanName = "",
    remainingAds = 0,
    daysRemaining = 0,
    title = "Promote your ad",
    subtitle = "Select a package for normal posting or more visibility",
    showFree = true,
    compact = false,
    onSelectPackage,
    onSelectPeriod,
}: PackageSelectorProps) {
    const isFinancing =
        String(selectedSubCategory || "").toLowerCase() === "assets financing";

    const visiblePackages = useMemo(() => {
        return packagesList.filter((pack) => {
            if (!showFree && String(pack.name).toLowerCase() === "free") return false;
            if (isFinancing && String(pack.name).toLowerCase() === "free") return false;
            return true;
        });
    }, [packagesList, showFree, isFinancing]);

    const getPackagePrices = (pack: PackageSelectorPackage | null | undefined) => {
        if (!pack) return [];
        return isFinancing ? pack.price2 || [] : pack.price || [];
    };

    const periodOptions = isFinancing
        ? PERIOD_LABELS_FINANCING
        : PERIOD_LABELS_NON_FINANCING;

    return (
        <div className="rounded-lg mt-4 p-0">
            <div className="w-full mt-2 p-0 dark:text-gray-100 rounded-lg">
                {!compact && (
                    <div className="flex flex-col mb-5">
                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-xl">
                            {title}
                        </p>
                        <p className="text-gray-600 text-sm dark:text-gray-500">
                            {subtitle}
                        </p>
                    </div>
                )}

                <div className="w-full">
                    {visiblePackages.map((pack, index) => {
                        const isSamePlan = currentPlanName === pack.name;
                        const isActive = activePackage?._id === pack._id;
                        const prices = getPackagePrices(pack);

                        return (
                            <div
                                key={index}
                                className={`mb-2 dark:bg-[#2D3236] border bg-white rounded-lg cursor-pointer ${isActive ? "bg-[#F2FFF2] border-orange-600 border-2" : ""
                                    }`}
                            >
                                <div
                                    onClick={() => onSelectPackage(pack)}
                                    className="flex justify-between items-center w-full"
                                >
                                    <div className="p-3">
                                        <p className="text-gray-700 font-semibold dark:text-gray-300">
                                            {pack.name}
                                        </p>

                                        <ul className="flex flex-col gap-1 p-1">
                                            {(pack.features || []).slice(0, compact ? 2 : 1).map((feature, i) => (
                                                <li key={i} className="flex items-center gap-1">
                                                    <DoneOutlinedIcon fontSize="small" />
                                                    <p className="text-sm">{getFeatureText(feature)}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="p-3">
                                        <div className="text-gray-600 mb-1">
                                            <div className="flex gap-2 text-sm justify-end">
                                                {daysRemaining > 0 && isSamePlan && (
                                                    <div className="p-1 rounded-full bg-orange-500">
                                                        <p className="text-white text-xs">Active</p>
                                                    </div>
                                                )}

                                                {String(pack.name).toLowerCase() === "free" &&
                                                    isSamePlan &&
                                                    remainingAds > 0 && (
                                                        <div className="p-1 rounded-full bg-orange-500">
                                                            <p className="text-white text-xs">Active</p>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            {String(pack.name).toLowerCase() !== "free" && (
                                                <div className="text-gray-800 font-bold mb-0">
                                                    <ul className="flex flex-col items-center gap-0 py-0">
                                                        {prices.map((price, i) => (
                                                            <li
                                                                key={i}
                                                                className={`flex items-center gap-0 ${i !== activeButton ? "hidden" : ""
                                                                    }`}
                                                            >
                                                                <p
                                                                    className={`font-semibold ${isActive
                                                                        ? "text-orange-500"
                                                                        : "text-gray-800 dark:text-gray-400"
                                                                        }`}
                                                                >
                                                                    Ksh {Number(price.amount).toLocaleString()}/{" "}
                                                                    {activeButtonTitle.trim()}
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {String(pack.name).toLowerCase() !== "free" && isActive && (
                                    <div className="flex flex-wrap justify-end items-center p-2">
                                        {periodOptions.map((period) => (
                                            <button
                                                key={period.label}
                                                type="button"
                                                className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === period.index
                                                    ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                                    : "border border-orange-500 text-orange-500 rounded-full p-2"
                                                    }`}
                                                onClick={() => onSelectPeriod(period.index, period.label)}
                                            >
                                                {period.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}