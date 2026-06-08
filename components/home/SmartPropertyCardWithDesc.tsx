"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    IoCamera,
    IoFlashOutline,
    IoSparklesOutline,
} from "react-icons/io5";
import sanitizeHtml from "sanitize-html";

import { buildAdPath } from "@/app/_ad/ad-url";
import { boostAd, featureAd } from "@/lib/actions/dynamicAd.actions";

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "KSh 0";
    return `KSh ${n.toLocaleString()}`;
}

function safeStr(v: any) {
    return (v ?? "").toString().trim();
}

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
    listingSlug?: string;
    currentUserId?: string;
    showOwnerActions?: boolean;
};

export default function SmartPropertyCardWithDesc({
    ad,
    regionFallback,
    listingSlug,
    descLimit = 90,
    currentUserId,
    showOwnerActions = false,
}: Props) {
    const router = useRouter();

    const id = String(ad?._id || ad?.id || "");

    const title = safeStr(ad?.data?.title) || safeStr(ad?.title) || "Listing";
    const region =
        safeStr(ad?.data?.region) ||
        safeStr(ad?.region) ||
        safeStr(regionFallback);
    const area = safeStr(ad?.data?.area) || safeStr(ad?.area);

    const description =
        truncateDescription(ad?.data?.description, descLimit) ||
        truncateDescription(ad?.description, descLimit);

    const image =
        ad?.data?.coverThumbUrl ||
        (Array.isArray(ad?.data?.imageUrls) && ad.data.imageUrls.length > 0
            ? ad.data.imageUrls[0]
            : null) ||
        ad?.image ||
        null;

    const imgCount = Array.isArray(ad?.data?.imageUrls)
        ? ad.data.imageUrls.length
        : Number(ad?.imagesCount || 0);

    const planName = safeStr(ad?.plan?.name);
    const planColor = safeStr(ad?.plan?.color);

    const isVerified =
        ad?.isVerifiedSeller === true ||
        ad?.organizer?.verified?.accountverified === true ||
        ad?.organizer?.verified?.[0]?.accountverified === true;

    const isContactPrice = ad?.data?.contact === "contact";
    const price = Number(ad?.data?.price ?? ad?.price ?? 0);

    const featuredActive =
        ad?.featuredActive === true ||
        ad?.isFeatured === true ||
        isBoostActive(ad, "featured");

    const topActive =
        ad?.topActive === true ||
        ad?.isTop === true ||
        isBoostActive(ad, "top");

    const ownerId = String(
        ad?.organizer?._id ||
        ad?.organizer ||
        ad?.organizerId ||
        ad?.userId ||
        ""
    );

    const isOwner = Boolean(currentUserId && ownerId === String(currentUserId));
    const canShowOwnerActions = showOwnerActions && isOwner;

    const [imgLoading, setImgLoading] = useState<boolean>(Boolean(image));
    const [imgError, setImgError] = useState<boolean>(false);
    const [actioning, setActioning] = useState<"boost" | "feature" | "">("");

    const handleBoost = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id || !currentUserId) return;

        try {
            setActioning("boost");

            const res = await boostAd({
                adId: id,
                userId: currentUserId,
                path: "/dashboard/ads",
            });

            if (!res?.ok) {
                alert(res?.message || "Unable to boost ad.");
                return;
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to boost ad. Please try again.");
        } finally {
            setActioning("");
        }
    };

    const handleFeature = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id || !currentUserId) return;

        try {
            setActioning("feature");

            const res = await featureAd({
                adId: id,
                userId: currentUserId,
                path: "/dashboard/ads",
            });

            if (!res?.ok) {
                alert(res?.message || "Unable to feature ad.");
                return;
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to feature ad. Please try again.");
        } finally {
            setActioning("");
        }
    };

    return (
        <Link
            href={buildAdPath(ad, listingSlug)}
            className="group block overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-[#2D3236]"
        >
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
                                {safeStr(ad?.data?.category) ||
                                    safeStr(ad?.category) ||
                                    "Listing"}
                            </p>
                        </div>
                    </div>
                )}

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

                {isVerified && (
                    <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Verified
                    </div>
                )}

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

                <div className="mt-2 font-bold text-black">
                    {isContactPrice
                        ? "Contact for price"
                        : price > 0
                            ? moneyKsh(price)
                            : "KSh 0"}
                </div>

                {canShowOwnerActions && (
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={handleBoost}
                            disabled={actioning !== ""}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-50 px-2 py-2 text-[11px] font-bold text-sky-700 hover:bg-sky-100 disabled:opacity-60"
                        >
                            <IoFlashOutline />
                            {actioning === "boost"
                                ? "Boosting..."
                                : topActive
                                    ? "Boosted"
                                    : "Boost"}
                        </button>

                        <button
                            type="button"
                            onClick={handleFeature}
                            disabled={actioning !== ""}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-purple-50 px-2 py-2 text-[11px] font-bold text-purple-700 hover:bg-purple-100 disabled:opacity-60"
                        >
                            <IoSparklesOutline />
                            {actioning === "feature"
                                ? "Featuring..."
                                : featuredActive
                                    ? "Featured"
                                    : "Feature"}
                        </button>
                    </div>
                )}
            </div>
        </Link>
    );
}