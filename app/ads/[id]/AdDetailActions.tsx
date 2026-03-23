"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { useAuth } from "@/app/hooks/useAuth";
import Bidding from "@/components/shared/Bidding";
import ProgressPopup from "@/components/shared/ProgressPopup";
import { ReportUnavailable } from "@/components/shared/ReportUnavailable";

import { RequestFinancing } from "@/components/shared/RequestFinancing";
import { ReportAbuse } from "@/components/shared/ReportAbuseProps";

type Props = {
    ad: any;
};

export default function AdDetailActions({ ad }: Props) {
    const router = useRouter();
    const { user: currentUser } = useAuth();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpenAAv, setIsPopupOpenAAv] = useState(false);
    const [isPopupOpenLoan, setIsPopupOpenLoan] = useState(false);
    const [isOpenP, setIsOpenP] = useState(false);

    const organizer = ad?.organizer || {};

    const userId = currentUser?._id || "";

    const userName =
        currentUser?.businessname ||
        `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
        "User";

    const userImage =
        currentUser?.photo || currentUser?.imageUrl || "/assets/profile.png";

    const biddingEnabled = Boolean(ad?.biddingEnabled ?? ad?.data?.biddingEnabled);
    const bidIncrement = Number(ad?.bidIncrement ?? ad?.data?.bidIncrement ?? 0);

    const category = String(ad?.data?.category || "").trim();
    const isFinanceCategory = category === "Property" || category === "Vehicle";

    const hasActiveBidding = useMemo(() => {
        if (!biddingEnabled) return false;

        const endsAt = ad?.biddingEndsAt ? new Date(ad.biddingEndsAt) : null;
        if (!endsAt || Number.isNaN(endsAt.getTime())) return true;

        return endsAt.getTime() > Date.now();
    }, [ad?.biddingEndsAt, biddingEnabled]);

    const handleClosePopup = () => setIsPopupOpen(false);
    const handleClosePopupAv = () => setIsPopupOpenAAv(false);
    const handleClosePopupLoan = () => setIsPopupOpenLoan(false);
    const handleCloseP = () => setIsOpenP(false);

    const requireAuth = () => {
        if (!currentUser) {
            setIsOpenP(true);
            router.push(`/auth?redirect_url=${encodeURIComponent(`/ads/${ad?._id}`)}`);
            return false;
        }
        return true;
    };

    const handleOpenPopupLoan = () => {
        if (!requireAuth()) return;
        setIsPopupOpenLoan(true);
    };

    const handleOpenReportAbuse = () => {
        if (!requireAuth()) return;
        setIsPopupOpen(true);
    };

    const handleOpenReportUnavailable = () => {
        if (!requireAuth()) return;
        setIsPopupOpenAAv(true);
    };

    return (
        <div className="space-y-4">
            {hasActiveBidding ? (
                <>
                    {bidIncrement > 0 ? (
                        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                            Minimum bid increment:{" "}
                            <span className="font-bold">KSh {bidIncrement.toLocaleString()}</span>
                        </div>
                    ) : null}

                    <Bidding ad={ad} userId={userId} user={organizer} />
                </>
            ) : null}

            {!biddingEnabled && isFinanceCategory ? (
                <button
                    onClick={handleOpenPopupLoan}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-base font-bold text-white transition hover:bg-orange-600"
                >
                    <SellOutlinedIcon />
                    Request Financing for This Property
                </button>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={handleOpenReportAbuse}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 transition hover:bg-red-100"
                >
                    <ReportGmailerrorredOutlinedIcon sx={{ fontSize: 18 }} />
                    Report Ad
                </button>

                <button
                    type="button"
                    onClick={handleOpenReportUnavailable}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 transition hover:bg-blue-100"
                >
                    <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
                    Confirm Unavailable
                </button>
            </div>

            <ReportUnavailable
                userId={userId}
                ad={ad}
                isOpen={isPopupOpenAAv}
                onClose={handleClosePopupAv}
                userName={userName}
                userImage={userImage}
            />

            <ReportAbuse
                userId={userId}
                ad={ad}
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                userName={userName}
                userImage={userImage}
            />

            <RequestFinancing
                userId={userId}
                ad={ad}
                isOpen={isPopupOpenLoan}
                onClose={handleClosePopupLoan}
                userName={userName}
                userImage={userImage}
            />

            <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
        </div>
    );
}