"use client";

import { format, isToday, isYesterday } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    FaEdit,
    FaShareAlt,
    FaLink,
    FaFacebook,
    FaInstagram,
    FaWhatsapp,
    FaTwitter,
    FaTiktok,
    FaPhoneAlt,
    FaGlobe,
    FaBuilding,
    FaMapMarkerAlt,
    FaCrown,
} from "react-icons/fa";
import Ratingsmobile from "./ratingsmobile";
import Verification from "./Verification";
import ProgressPopup from "./ProgressPopup";
import { VerificationPackId } from "@/constants";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { v4 as uuidv4 } from "uuid";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

type CollectionProps = {
    userId: string;
    loggedId: string;
    user: any;
    daysRemaining: number;
    pack: string;
    color: string;
    handleOpenReview: (value: any) => void;
    handleOpenChatId: (value: string) => void;
    handleOpenSettings: () => void;
    handleOpenPlan: () => void;
    handlePay: (id: string) => void;
};

export default function SellerProfileSidebar({
    userId,
    loggedId,
    user,
    daysRemaining,
    color,
    pack,
    handlePay,
    handleOpenPlan,
    handleOpenReview,
    handleOpenChatId,
    handleOpenSettings,
}: CollectionProps) {
    const [activationfee, setactivationfee] = useState(500);
    const [showphone, setshowphone] = useState(false);
    const pathname = usePathname();
    const [showPhone, setShowPhone] = useState(false);
    const router = useRouter();
    const isAdCreator = userId === loggedId;

    const handlewhatsappClick = () => {
        window.location.href = `https://wa.me/${user.whatsapp}/`;
    };

    const handleShowPhoneClick = (e: any) => {
        setshowphone(true);
        window.location.href = `tel:${user.phone}`;
    };

    const handleDirectionClick = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${user.latitude},${user.longitude}`,
            "_blank"
        );
    };

    let formattedCreatedAt = "";
    try {
        const createdAtDate = new Date(user?.verified?.[0]?.verifieddate);
        if (isToday(createdAtDate)) {
            formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm");
        } else if (isYesterday(createdAtDate)) {
            formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm");
        } else {
            formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy");
        }

        if (!isToday(createdAtDate) && !isYesterday(createdAtDate)) {
            formattedCreatedAt += " " + format(createdAtDate, "HH:mm");
        }
    } catch { }

    const [isLoading, setIsLoading] = useState(true);
    const [isOpenP, setIsOpenP] = useState(false);

    const handleOpenP = () => {
        setIsOpenP(true);
    };

    const handleCloseP = () => {
        setIsOpenP(false);
    };

    const [copied, setCopied] = useState(false);

    const adUrl = process.env.NEXT_PUBLIC_DOMAIN_URL + "?Profile=" + user._id;

    const handleCopy = () => {
        navigator.clipboard.writeText(adUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShare = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                await Share.share({
                    title: "Check out this Profile!",
                    text: "Have a look at this Profile",
                    url: adUrl,
                    dialogTitle: "Share via",
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: "Check out this Profile!",
                    url: adUrl,
                });
            } else {
                alert("Sharing is not supported on this device.");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.[0]?.toUpperCase() || "";
        const last = lastName?.[0]?.toUpperCase() || "";
        return `${first}${last}`;
    };

    function isDefaultClerkAvatar(imageUrl: string): boolean {
        try {
            const base64 = imageUrl.split("/").pop();
            if (!base64) return false;
            const json = atob(base64);
            const data = JSON.parse(json);
            return data.type === "default";
        } catch (e) {
            return false;
        }
    }

    const handlePayNow = async (
        packIdInput: string,
        packNameInput: string,
        periodInput: string,
        priceInput: string
    ) => {
        setIsOpenP(true);
        const customerId = uuidv4();

        const trans = {
            orderTrackingId: customerId,
            amount: Number(priceInput),
            plan: packNameInput,
            planId: packIdInput,
            period: periodInput,
            buyerId: userId,
            merchantId: userId,
            status: "Pending",
            createdAt: new Date(),
        };

        const response = await createTransaction(trans);
        if (response.status === "Pending") {
            handlePay(response.orderTrackingId);
        }
        setIsOpenP(false);
    };

    const premiumRowClass =
        "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3";
    const socialBtnClass =
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600";
    const actionBtnClass =
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition";

    return (
        <aside className="w-full lg:w-[350px]">
            <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-6 text-white">
                    <div className="flex flex-col items-center text-center">
                        {user?.photo ? (
                            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/70 bg-white shadow-md">
                                <img
                                    src={user.photo}
                                    alt="Organizer avatar"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/70 bg-white text-2xl font-extrabold text-orange-600 shadow-md">
                                {getInitials(user?.firstName, user?.lastName)}
                            </div>
                        )}

                        <h2 className="mt-4 text-xl font-extrabold">
                            {user.firstName} {user.lastName}
                        </h2>

                        {user?.businessname ? (
                            <p className="mt-1 text-sm font-medium text-orange-50">
                                {user.businessname}
                            </p>
                        ) : null}

                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                            <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                                Seller Profile
                            </div>

                            {pack && (
                                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                                    <FaCrown className="h-3.5 w-3.5" />
                                    {pack}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Ratingsmobile
                                user={user}
                                recipientUid={user._id}
                                handleOpenReview={handleOpenReview}
                            />
                        </div>

                        <div className="mt-3 flex items-center justify-center">
                            <Verification
                                fee={user.fee}
                                user={user}
                                userId={userId}
                                isAdCreator={isAdCreator}
                                handlePayNow={handlePay}
                            />
                        </div>

                        {user?.businessaddress ? (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-orange-50 backdrop-blur-sm">
                                <FaMapMarkerAlt className="h-3.5 w-3.5" />
                                <span className="line-clamp-1">{user.businessaddress}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="space-y-5 p-5">
                    {/* Owner actions */}
                    {userId === loggedId ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                            {user.verified && user?.verified?.[0]?.accountverified === false ? (
                                <button
                                    onClick={() =>
                                        handlePayNow(
                                            VerificationPackId,
                                            "Verification",
                                            "0",
                                            user.fee
                                        )
                                    }
                                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                                >
                                    Verify Now
                                </button>
                            ) : null}

                            <button
                                onClick={() => handleOpenSettings()}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                            >
                                <FaEdit className="h-3.5 w-3.5" />
                                Edit Profile
                            </button>
                        </div>
                    ) : null}

                    {/* Business info */}
                    <div className="space-y-3">
                        <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                            Business Information
                        </div>

                        <div className={premiumRowClass}>
                            <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                                <FaBuilding className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Business
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-900">
                                    {user?.businessname ? user.businessname : "Not Provided"}
                                </p>
                            </div>
                        </div>

                        <div className={premiumRowClass}>
                            <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                                <FaGlobe className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Website
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-900 break-words">
                                    {user?.website ? (
                                        <a
                                            href={
                                                user.website.startsWith("http")
                                                    ? user.website
                                                    : `https://${user.website}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-600 hover:underline"
                                        >
                                            {user.website}
                                        </a>
                                    ) : (
                                        "Not Provided"
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className={premiumRowClass}>
                            <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <FaPhoneAlt className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Phone
                                </p>
                                <div className="mt-1">
                                    {user?.phone ? (
                                        showPhone ? (
                                            <div className="flex flex-col gap-2">
                                                <span className="text-sm font-bold text-slate-900">
                                                    {user.phone}
                                                </span>
                                                <a
                                                    href={`tel:${user.phone}`}
                                                    className="inline-flex w-fit items-center rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100"
                                                >
                                                    Call now
                                                </a>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowPhone(true)}
                                                className="text-sm font-semibold text-orange-600 hover:underline"
                                            >
                                                Click to show number
                                            </button>
                                        )
                                    ) : (
                                        <span className="text-sm font-medium text-slate-500">
                                            Not Provided
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {showPhone ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                                ⚠️ Never pay before meeting the seller and verifying the item.
                                Tadao Market does not offer payment protection. Report fraud:
                                <a
                                    href="mailto:support@tadaomarket.com"
                                    className="ml-1 font-semibold underline"
                                >
                                    support@tadaomarket.com
                                </a>
                            </div>
                        ) : null}
                    </div>

                    {/* Social */}
                    <div className="space-y-3 border-t border-slate-100 pt-5">
                        <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                            Social Media
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {user?.facebook ? (
                                <a
                                    href={user.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={socialBtnClass}
                                    aria-label="Facebook"
                                >
                                    <FaFacebook className="h-4 w-4" />
                                </a>
                            ) : null}

                            {user?.instagram ? (
                                <a
                                    href={user.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={socialBtnClass}
                                    aria-label="Instagram"
                                >
                                    <FaInstagram className="h-4 w-4" />
                                </a>
                            ) : null}

                            {user?.whatsapp ? (
                                <a
                                    href={`https://wa.me/${user.whatsapp}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={socialBtnClass}
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp className="h-4 w-4" />
                                </a>
                            ) : null}

                            {user?.twitter ? (
                                <a
                                    href={user.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={socialBtnClass}
                                    aria-label="Twitter"
                                >
                                    <FaTwitter className="h-4 w-4" />
                                </a>
                            ) : null}

                            {user?.tiktok ? (
                                <a
                                    href={user.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={socialBtnClass}
                                    aria-label="TikTok"
                                >
                                    <FaTiktok className="h-4 w-4" />
                                </a>
                            ) : null}
                        </div>
                    </div>

                    {/* Share */}
                    <div className="space-y-3 border-t border-slate-100 pt-5">
                        <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                            Share Profile
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                            >
                                <FaLink className="h-3.5 w-3.5" />
                                {copied ? "Copied!" : "Copy Link"}
                            </button>

                            <button
                                onClick={handleShare}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                            >
                                <FaShareAlt className="h-3.5 w-3.5" />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* Plan */}
                    {isAdCreator ? (
                        <div className="border-t border-slate-100 pt-5">
                            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-500">
                                            Current Plan
                                        </p>
                                        <p className="mt-1 text-lg font-extrabold text-slate-900">
                                            {pack}
                                        </p>
                                        {pack !== "Free" && daysRemaining && daysRemaining > 0 ? (
                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                                {daysRemaining} day{daysRemaining === 1 ? "" : "s"} left
                                            </p>
                                        ) : null}
                                    </div>

                                    <button
                                        onClick={() => handleOpenPlan()}
                                        className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                                    >
                                        Upgrade Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
        </aside>
    );
}