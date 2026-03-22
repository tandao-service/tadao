"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoCamera } from "react-icons/io5";
import sanitizeHtml from "sanitize-html";

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "KSh 0";
    return `KSh ${n.toLocaleString()}`;
}

function safeStr(v: any) {
    return (v ?? "").toString().trim();
}

function chip(label: string) {
    return (
        <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
            {label}
        </span>
    );
}

// ✅ boost fallback (if aggregate fields not present)
function isBoostActive(ad: any, kind: "featured" | "top") {
    const now = Date.now();
    const b = ad?.boost || {};
    if (kind === "featured") {
        const until = b?.featuredUntil ? new Date(b.featuredUntil).getTime() : 0;
        return b?.isFeatured === true && until > now;
    }
    const until = b?.topUntil ? new Date(b.topUntil).getTime() : 0;
    return b?.isTop === true && until > now;
}

// ✅ sanitize + truncate (borrowed from VerticalCard)
function truncateDescription(raw: any, charLimit = 90) {
    const safe = sanitizeHtml(String(raw ?? ""), {
        allowedTags: [],
        allowedAttributes: {},
    }).trim();

    if (!safe) return "";
    return safe.length > charLimit ? `${safe.slice(0, charLimit)}...` : safe;
}

type Props = {
    ad: any;
    regionFallback?: string;
    descLimit?: number;
};

export default function SmartPropertyCardWithDesc({
    ad,
    regionFallback,
    descLimit = 90,
}: Props) {
    const id = String(ad?._id || "");

    const title = safeStr(ad?.data?.title) || "Listing";
    const region = safeStr(ad?.data?.region) || safeStr(regionFallback);
    const area = safeStr(ad?.data?.area);

    const description = truncateDescription(ad?.data?.description, descLimit);

    const image =
        ad?.data?.coverThumbUrl ||
        (Array.isArray(ad?.data?.imageUrls) && ad.data.imageUrls.length > 0
            ? ad.data.imageUrls[0]
            : null);

    const imgCount = Array.isArray(ad?.data?.imageUrls) ? ad.data.imageUrls.length : 0;

    const planName = safeStr(ad?.plan?.name);
    const planColor = safeStr(ad?.plan?.color);

    // ✅ verified can be array OR object depending on populate
    const isVerified =
        ad?.organizer?.verified?.accountverified === true ||
        ad?.organizer?.verified?.[0]?.accountverified === true;

    const isContactPrice = ad?.data?.contact === "contact";
    const price = Number(ad?.data?.price || 0);

    const isRent = Boolean(ad?.data?.period || ad?.data?.per);
    const condition = safeStr(ad?.data?.condition);
    const landType = safeStr(ad?.data?.["land-Type"]);
    const landArea = safeStr(ad?.data?.["land-Area(acres)"]);
    const hasDelivery = Boolean(ad?.data?.["delivery"]);
    const hasBulk = Boolean(ad?.data?.["bulkprice"]);

    // ✅ badges: prefer aggregate computed fields, fallback to boost dates
    const featuredActive = ad?.featuredActive === true ? true : isBoostActive(ad, "featured");
    const topActive = ad?.topActive === true ? true : isBoostActive(ad, "top");

    // ✅ Image loading overlay state
    const [imgLoading, setImgLoading] = useState<boolean>(Boolean(image));
    const [imgError, setImgError] = useState<boolean>(false);

    return (
        <Link
            href={`/ads/${id}`}
            className="group block overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-[#2D3236]"
        >
            {/* Image */}
            <div
                className="relative w-full"
                style={
                    planName && planName !== "Free" && planColor
                        ? { border: "2px solid", borderColor: planColor }
                        : undefined
                }
            >
                {image && !imgError ? (
                    <>
                        {/* ✅ Loading overlay */}
                        {imgLoading && (
                            <div className="absolute inset-0 z-[2] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                            </div>
                        )}

                        <Image
                            src={image}
                            alt={title}
                            width={800}
                            height={450}
                            className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            unoptimized
                            onLoadingComplete={() => setImgLoading(false)}
                            onError={() => {
                                setImgLoading(false);
                                setImgError(true);
                            }}
                        />
                    </>
                ) : (
                    <div className="flex h-[200px] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-gray-100 to-orange-100 dark:from-[#1b1f22] dark:via-[#242a2e] dark:to-[#1b1f22]">
                        <div className="flex flex-col items-center gap-2">
                            <Image src="/logo.png" alt="Tadao" width={40} height={40} />
                            <p className="text-[11px] font-bold text-orange-500">
                                {safeStr(ad?.data?.category) || "Listing"}
                            </p>
                        </div>
                    </div>
                )}

                {/* LEFT stack badges */}
                <div className="absolute left-0 top-0 flex flex-col gap-1">
                    {featuredActive && (
                        <div className="rounded-br-lg rounded-tl-sm bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white shadow-lg">
                            ⭐ FEATURED
                        </div>
                    )}

                    {topActive && (
                        <div className="rounded-br-lg rounded-tl-sm bg-black/80 px-2 py-1 text-[10px] font-extrabold text-white shadow-lg">
                            🔥 TOP
                        </div>
                    )}

                    {planName && planName !== "Free" && (
                        <div
                            className="rounded-br-lg rounded-tl-sm px-2 py-1 text-[10px] font-semibold text-white shadow-lg"
                            style={{ backgroundColor: planColor || "#111827" }}
                        >
                            {planName}
                        </div>
                    )}
                </div>

                {/* Verified badge */}
                {isVerified && (
                    <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Verified
                    </div>
                )}

                {/* Bottom badges */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2">
                    <div className="rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">
                        <div className="flex items-center gap-1">
                            <IoCamera /> {imgCount}
                        </div>
                    </div>

                    {ad?.data?.["youtube-link"] && (
                        <div className="rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">
                            YouTube
                        </div>
                    )}

                    {ad?.data?.["virtualTourLink"] && (
                        <div className="rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">
                            3D Tour
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-3">
                <h2 className="line-clamp-2 text-sm font-semibold">{title}</h2>

                <div className="mt-1 line-clamp-1 text-[12px] text-gray-600 dark:text-gray-300">
                    {region}
                    {area ? ` - ${area}` : ""}
                </div>

                {description ? (
                    <p className="mt-2 line-clamp-2 text-[12px] text-gray-600 dark:text-gray-300">
                        {description}
                    </p>
                ) : (
                    <p className="mt-2 line-clamp-2 text-[12px] text-gray-400 dark:text-gray-500">
                        No description provided.
                    </p>
                )}

                <div className="mt-2 font-bold text-orange-500">
                    {isContactPrice ? "Contact for price" : price > 0 ? moneyKsh(price) : "KSh 0"}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {isRent && chip("Rent")}
                    {condition && chip(condition)}
                    {landType && chip(landType)}
                    {landArea && chip(landArea)}
                    {hasBulk && chip("Bulk Price")}
                    {hasDelivery && chip("Delivery")}
                </div>
            </div>
        </Link>
    );
}