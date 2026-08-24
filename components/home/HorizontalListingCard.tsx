"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    IoCamera,
    IoFlashOutline,
    IoSparklesOutline,
    IoLocationOutline,
} from "react-icons/io5";
import sanitizeHtml from "sanitize-html";

import { buildAdPath } from "@/app/_ad/ad-url";
import {
    boostAd,
    featureAd,
} from "@/lib/actions/dynamicAd.actions";

function safeStr(v: any) {
    return String(v ?? "").trim();
}

function norm(v: any) {
    return safeStr(v).toLowerCase();
}

function moneyKsh(v: any) {
    const n = Number(v);

    if (
        !Number.isFinite(n) ||
        n <= 0
    ) {
        return "Contact for price";
    }

    return `KSh ${n.toLocaleString()}`;
}

function cleanDescription(
    raw: any,
    max = 220
) {
    const clean = sanitizeHtml(
        String(raw ?? ""),
        {
            allowedTags: [],
            allowedAttributes: {},
        }
    )
        .replace(/\s+/g, " ")
        .trim();

    if (!clean) return "";

    return clean.length > max
        ? `${clean.slice(0, max)}...`
        : clean;
}

function isDonationOrLostFoundAd(ad: any) {
    const category = norm(
        ad?.data?.category ||
        ad?.category
    );

    const subcategory = norm(
        ad?.data?.subcategory ||
        ad?.subcategory
    );

    return (
        category === "donations" ||
        category === "lost and found" ||
        subcategory === "donated items" ||
        subcategory === "lost and found items"
    );
}

function isBoostActive(
    ad: any,
    kind: "featured" | "top"
) {
    const now = Date.now();
    const boost = ad?.boost || {};

    if (kind === "featured") {
        const until =
            boost?.featuredUntil
                ? new Date(
                    boost.featuredUntil
                ).getTime()
                : 0;

        return (
            boost?.isFeatured === true &&
            until > now
        );
    }

    const until =
        boost?.topUntil
            ? new Date(
                boost.topUntil
            ).getTime()
            : 0;

    return (
        boost?.isTop === true &&
        until > now
    );
}

type Props = {
    ad: any;
    regionFallback?: string;
    listingSlug?: string;
    currentUserId?: string;
    showOwnerActions?: boolean;
};

export default function HorizontalListingCard({
    ad,
    regionFallback,
    listingSlug,
    currentUserId,
    showOwnerActions = false,
}: Props) {
    const router = useRouter();

    const id = String(
        ad?._id ||
        ad?.id ||
        ""
    );

    const title =
        safeStr(ad?.data?.title) ||
        safeStr(ad?.title) ||
        "Listing";

    const region =
        safeStr(ad?.data?.region) ||
        safeStr(ad?.region) ||
        safeStr(regionFallback);

    const area =
        safeStr(ad?.data?.area) ||
        safeStr(ad?.area);

    const description =
        cleanDescription(
            ad?.data?.description ??
            ad?.description,
            240
        );

    const image =
        ad?.data?.coverThumbUrl ||
        (
            Array.isArray(
                ad?.data?.imageUrls
            ) &&
                ad.data.imageUrls.length > 0
                ? ad.data.imageUrls[0]
                : null
        ) ||
        ad?.image ||
        null;

    const imgCount =
        Array.isArray(
            ad?.data?.imageUrls
        )
            ? ad.data.imageUrls.length
            : Number(
                ad?.imagesCount ||
                0
            );

    const planName =
        safeStr(ad?.plan?.name);

    const planColor =
        safeStr(ad?.plan?.color);

    const hasPaidPlan =
        Boolean(
            planName &&
            planName.toLowerCase() !==
            "free" &&
            planColor
        );

    const cardBorderStyle =
        hasPaidPlan
            ? {
                borderColor:
                    planColor,
                borderWidth:
                    "2px",
                boxShadow:
                    `0 8px 24px ${planColor}22`,
            }
            : undefined;

    const isVerified =
        ad?.isVerifiedSeller === true ||
        ad?.organizer?.verified
            ?.accountverified === true ||
        ad?.organizer?.verified?.[0]
            ?.accountverified === true;

    const price = Number(
        ad?.data?.price ??
        ad?.price ??
        0
    );

    const isContactPrice =
        ad?.data?.contact ===
        "contact";

    const featuredActive =
        ad?.featuredActive === true ||
        ad?.isFeatured === true ||
        isBoostActive(
            ad,
            "featured"
        );

    const topActive =
        ad?.topActive === true ||
        ad?.isTop === true ||
        isBoostActive(
            ad,
            "top"
        );

    const ownerId = String(
        ad?.organizer?._id ||
        ad?.organizer ||
        ad?.organizerId ||
        ad?.userId ||
        ""
    );

    const isOwner = Boolean(
        currentUserId &&
        ownerId ===
        String(currentUserId)
    );

    const canShowOwnerActions =
        showOwnerActions &&
        isOwner;

    const noPriceNeeded =
        isDonationOrLostFoundAd(ad);

    const [
        imgLoading,
        setImgLoading,
    ] = useState(
        Boolean(image)
    );

    const [
        imgError,
        setImgError,
    ] = useState(false);

    const [
        actioning,
        setActioning,
    ] = useState<
        "boost" |
        "feature" |
        ""
    >("");

    const handleBoost = async (
        e: React.MouseEvent
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (
            !id ||
            !currentUserId
        ) {
            return;
        }

        try {
            setActioning("boost");

            const res =
                await boostAd({
                    adId: id,
                    userId:
                        currentUserId,
                    path:
                        "/dashboard/ads",
                });

            if (!res?.ok) {
                alert(
                    res?.message ||
                    "Unable to boost ad."
                );

                return;
            }

            router.refresh();
        } catch (error) {
            console.error(error);

            alert(
                "Failed to boost ad. Please try again."
            );
        } finally {
            setActioning("");
        }
    };

    const handleFeature = async (
        e: React.MouseEvent
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (
            !id ||
            !currentUserId
        ) {
            return;
        }

        try {
            setActioning(
                "feature"
            );

            const res =
                await featureAd({
                    adId: id,
                    userId:
                        currentUserId,
                    path:
                        "/dashboard/ads",
                });

            if (!res?.ok) {
                alert(
                    res?.message ||
                    "Unable to feature ad."
                );

                return;
            }

            router.refresh();
        } catch (error) {
            console.error(error);

            alert(
                "Failed to feature ad. Please try again."
            );
        } finally {
            setActioning("");
        }
    };

    return (
        <Link
            href={buildAdPath(
                ad,
                listingSlug
            )}
            style={cardBorderStyle}
            className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-[#2D3236]"
        >
            <div className="flex min-h-[170px] w-full">
                {/* IMAGE */}
                <div className="relative w-[145px] shrink-0 overflow-hidden sm:w-[190px] md:w-[220px] lg:w-[250px]">
                    {image &&
                        !imgError ? (
                        <>
                            {imgLoading && (
                                <div className="absolute inset-0 z-[2] flex items-center justify-center bg-slate-100">
                                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
                                </div>
                            )}

                            <Image
                                src={image}
                                alt={title}
                                fill
                                sizes="(max-width: 640px) 145px, (max-width: 1024px) 220px, 250px"
                                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                                unoptimized
                                onLoadingComplete={() =>
                                    setImgLoading(
                                        false
                                    )
                                }
                                onError={() => {
                                    setImgLoading(
                                        false
                                    );

                                    setImgError(
                                        true
                                    );
                                }}
                            />
                        </>
                    ) : (
                        <div className="flex h-full min-h-[170px] items-center justify-center bg-gradient-to-br from-orange-50 via-slate-100 to-orange-100">
                            <div className="flex flex-col items-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="Tadao"
                                    width={42}
                                    height={42}
                                />

                                <span className="text-[10px] font-bold text-orange-500">
                                    Listing
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="absolute left-0 top-0 flex flex-col gap-1">
                        {featuredActive && (
                            <span className="rounded-br-lg bg-orange-500 px-2 py-1 text-[9px] font-black text-white shadow-sm sm:text-[10px]">
                                ⭐ FEATURED
                            </span>
                        )}

                        {topActive && (
                            <span className="rounded-br-lg bg-black/80 px-2 py-1 text-[9px] font-black text-white shadow-sm sm:text-[10px]">
                                🔥 TOP
                            </span>
                        )}

                        {hasPaidPlan && (
                            <span
                                className="rounded-br-lg px-2 py-1 text-[9px] font-bold text-white shadow-sm sm:text-[10px]"
                                style={{
                                    backgroundColor:
                                        planColor,
                                }}
                            >
                                {planName}
                            </span>
                        )}
                    </div>

                    {isVerified && (
                        <span className="absolute right-0 top-0 hidden rounded-bl-lg bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700 sm:block">
                            Verified
                        </span>
                    )}

                    <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white">
                        <span className="flex items-center gap-1">
                            <IoCamera />
                            {imgCount}
                        </span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-950 dark:text-white sm:text-base lg:text-lg">
                                    {title}
                                </h2>

                                <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-300 sm:text-xs">
                                    <IoLocationOutline className="shrink-0 text-orange-500" />

                                    <span className="truncate">
                                        {region}
                                        {area
                                            ? ` - ${area}`
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {description && (
                            <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-500 dark:text-slate-300 sm:text-xs lg:line-clamp-3 lg:text-sm">
                                {
                                    description
                                }
                            </p>
                        )}

                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {ad?.data
                                ?.condition && (
                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600 sm:text-[10px]">
                                        {
                                            ad.data
                                                .condition
                                        }
                                    </span>
                                )}

                            {ad?.data
                                ?.transmission && (
                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600 sm:text-[10px]">
                                        {
                                            ad.data
                                                .transmission
                                        }
                                    </span>
                                )}

                            {ad?.data?.[
                                "engine-CC"
                            ] && (
                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600 sm:text-[10px]">
                                        {
                                            ad.data[
                                            "engine-CC"
                                            ]
                                        }
                                    </span>
                                )}

                            {ad?.data
                                ?.delivery && (
                                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600 sm:text-[10px]">
                                        Delivery
                                    </span>
                                )}
                        </div>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                        {!noPriceNeeded ? (
                            <div className="text-base font-black text-orange-600 sm:text-lg">
                                {isContactPrice
                                    ? "Contact for price"
                                    : moneyKsh(
                                        price
                                    )}
                            </div>
                        ) : (
                            <div />
                        )}

                        {canShowOwnerActions && (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        handleBoost
                                    }
                                    disabled={
                                        actioning !==
                                        ""
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-2 text-[10px] font-bold text-sky-700 hover:bg-sky-100 disabled:opacity-60"
                                >
                                    <IoFlashOutline />

                                    {actioning ===
                                        "boost"
                                        ? "Boosting..."
                                        : topActive
                                            ? "Boosted"
                                            : "Boost"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleFeature
                                    }
                                    disabled={
                                        actioning !==
                                        ""
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-2 text-[10px] font-bold text-purple-700 hover:bg-purple-100 disabled:opacity-60"
                                >
                                    <IoSparklesOutline />

                                    {actioning ===
                                        "feature"
                                        ? "Featuring..."
                                        : featuredActive
                                            ? "Featured"
                                            : "Feature"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}