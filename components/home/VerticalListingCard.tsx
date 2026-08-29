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

    if (!Number.isFinite(n) || n <= 0) {
        return "Contact for price";
    }

    return `KSh ${n.toLocaleString()}`;
}

function truncateDescription(
    raw: any,
    charLimit = 90
) {
    const clean = sanitizeHtml(
        String(raw ?? ""),
        {
            allowedTags: [],
            allowedAttributes: {},
        }
    ).trim();

    if (!clean) return "";

    return clean.length > charLimit
        ? `${clean.slice(0, charLimit)}...`
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

function isFinancingAd(ad: any) {
    return (
        norm(
            ad?.data?.category ||
            ad?.category
        ) === "financing"
    );
}

function pickData(
    ad: any,
    keys: string[]
) {
    for (const key of keys) {
        const value =
            ad?.data?.[key] ??
            ad?.[key];

        if (safeStr(value)) {
            return safeStr(value);
        }
    }

    return "";
}

function financingInfo(ad: any) {
    return {
        subcategory: safeStr(
            ad?.data?.subcategory ||
            ad?.subcategory
        ),

        amount: pickData(ad, [
            "Loan Amount",
            "loanAmount",
            "LoanAmount",
            "Amount",
            "Asset Price",
            "Asset Value",
            "Financing Amount",
        ]),

        deposit: pickData(ad, [
            "Deposit Amount",
            "deposit",
            "Down Payment",
            "Deposit",
        ]),

        term: pickData(ad, [
            "Preferred Loan Term",
            "loanterm",
            "Loan Term",
            "Repayment Period",
            "Term",
        ]),

        income: pickData(ad, [
            "Monthly Income",
            "monthlyIncome",
        ]),
    };
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

export default function VerticalListingCard({
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
        truncateDescription(
            ad?.data?.description,
            95
        ) ||
        truncateDescription(
            ad?.description,
            95
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

    const isContactPrice =
        ad?.data?.contact ===
        "contact";

    const price = Number(
        ad?.data?.price ??
        ad?.price ??
        0
    );

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

    const noPriceNeeded =
        isDonationOrLostFoundAd(ad);

    const showFinancingInfo =
        isFinancingAd(ad);

    const financing =
        financingInfo(ad);

    const isOwner = Boolean(
        currentUserId &&
        ownerId ===
        String(currentUserId)
    );

    const canShowOwnerActions =
        showOwnerActions &&
        isOwner;

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
            className="group block h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-[#2D3236]"
        >
            <div className="relative w-full overflow-hidden">
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
                            width={700}
                            height={500}
                            className="h-[190px] w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-[210px]"
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
                    <div className="flex h-[190px] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-slate-100 to-orange-100 sm:h-[210px]">
                        <div className="flex flex-col items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Tadao"
                                width={44}
                                height={44}
                            />

                            <span className="text-[11px] font-bold text-orange-500">
                                {safeStr(
                                    ad?.data
                                        ?.category
                                ) ||
                                    safeStr(
                                        ad
                                            ?.category
                                    ) ||
                                    "Listing"}
                            </span>
                        </div>
                    </div>
                )}

                <div className="absolute left-0 top-0 flex flex-col gap-1">
                    {featuredActive && (
                        <span className="rounded-br-lg bg-orange-500 px-2 py-1 text-[10px] font-black text-white shadow-sm">
                            ⭐ FEATURED
                        </span>
                    )}

                    {topActive && (
                        <span className="rounded-br-lg bg-black/80 px-2 py-1 text-[10px] font-black text-white shadow-sm">
                            🔥 TOP
                        </span>
                    )}

                    {hasPaidPlan && (
                        <span
                            className="rounded-br-lg px-2 py-1 text-[10px] font-bold text-white shadow-sm"
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
                    <span className="absolute right-0 top-0 rounded-bl-lg bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                        Verified
                    </span>
                )}

                <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white">
                    <span className="flex items-center gap-1">
                        <IoCamera />
                        {imgCount}
                    </span>
                </div>

                {ad?.data?.[
                    "youtube-link"
                ] && (
                        <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white">
                            YouTube
                        </div>
                    )}
            </div>

            <div className="flex h-full flex-col p-3">
                <h2 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[#047034] dark:text-emerald-100">
                    {title}
                </h2>

                <div className="mt-1 line-clamp-1 text-[12px] font-medium text-slate-500 dark:text-slate-300">
                    {region}
                    {area
                        ? ` - ${area}`
                        : ""}
                </div>

                {description ? (
                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-500 dark:text-slate-300">
                        {description}
                    </p>
                ) : (
                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-400">
                        No description provided.
                    </p>
                )}

                {showFinancingInfo ? (
                    <div className="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {financing.subcategory && (
                            <div className="font-bold text-orange-600">
                                {
                                    financing.subcategory
                                }
                            </div>
                        )}

                        {financing.amount && (
                            <div>
                                <b>
                                    Amount:
                                </b>{" "}
                                {moneyKsh(
                                    financing.amount
                                )}
                            </div>
                        )}

                        {financing.deposit && (
                            <div>
                                <b>
                                    Deposit:
                                </b>{" "}
                                {moneyKsh(
                                    financing.deposit
                                )}
                            </div>
                        )}

                        {financing.term && (
                            <div>
                                <b>
                                    Term:
                                </b>{" "}
                                {
                                    financing.term
                                }
                            </div>
                        )}

                        {financing.income && (
                            <div>
                                <b>
                                    Income:
                                </b>{" "}
                                {moneyKsh(
                                    financing.income
                                )}
                            </div>
                        )}
                    </div>
                ) : !noPriceNeeded ? (
                    <div className="mt-3 text-base font-black text-[#fb540d] dark:text-orange-400">
                        {isContactPrice
                            ? "Contact for price"
                            : moneyKsh(
                                price
                            )}
                    </div>
                ) : null}

                {canShowOwnerActions && (
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={
                                handleBoost
                            }
                            disabled={
                                actioning !==
                                ""
                            }
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-50 px-2 py-2 text-[11px] font-bold text-sky-700 hover:bg-sky-100 disabled:opacity-60"
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
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-purple-50 px-2 py-2 text-[11px] font-bold text-purple-700 hover:bg-purple-100 disabled:opacity-60"
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
        </Link>
    );
}