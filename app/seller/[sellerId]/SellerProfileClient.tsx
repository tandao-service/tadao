"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LeaveSellerReview from "./LeaveSellerReview";
import SellerReviewsList from "./SellerReviewsList";
import {
    IoCallOutline,
    IoChatbubbleEllipsesOutline,
    IoCheckmarkCircle,
    IoChevronDown,
    IoFilterOutline,
    IoGridOutline,
    IoLogoWhatsapp,
    IoMailOutline,
    IoOpenOutline,
    IoSearchOutline,
    IoSparklesOutline,
    IoStar,
    IoStorefrontOutline,
    IoTimeOutline,
} from "react-icons/io5";

type Props = {
    seller: any;
    ads: any[];
    sellerId: string;
    ratingSummary: {
        averageRating: number;
        totalRatings: number;
        fiveStar: number;
        fourStar: number;
        threeStar: number;
        twoStar: number;
        oneStar: number;
    };
    profileStats: {
        joinedAt: string | null;
        totalAds: number;
        totalViews: number;
        totalCalls: number;
        totalWhatsapp: number;
        totalInquiries: number;
        responseLabel: string;
    };
    reviews: any[];
};

const PAGE_SIZE = 12;

function safeStr(v: any) {
    return String(v ?? "").trim();
}

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return "Contact for price";
    return `KSh ${n.toLocaleString()}`;
}

function getVerification(user: any) {
    if (!user?.verified) return false;
    if (Array.isArray(user.verified)) {
        return user.verified.some((v: any) => v?.accountverified === true);
    }
    return user?.verified?.accountverified === true;
}

function formatDate(input: any) {
    if (!input) return "—";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
}

function getPercent(part: number, total: number) {
    if (!total) return 0;
    return Math.round((part / total) * 100);
}

export default function SellerProfileClient({
    seller,
    ads,
    sellerId,
    ratingSummary,
    profileStats,
    reviews,
}: Props) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("new");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [query, category, sortBy]);

    if (!seller) {
        return (
            <div className="rounded-[24px] border border-orange-100 bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-black text-slate-900">Seller not found</h1>
                <p className="mt-2 text-sm text-slate-500">
                    This seller may have no active ads right now.
                </p>
                <Link
                    href="/"
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-extrabold text-white hover:bg-orange-600"
                >
                    Go Home
                </Link>
            </div>
        );
    }

    const sellerName =
        safeStr(seller?.businessname) ||
        `${safeStr(seller?.firstName)} ${safeStr(seller?.lastName)}`.trim() ||
        "Seller";

    const sellerPhoto = safeStr(seller?.photo) || safeStr(seller?.imageUrl) || "";
    const sellerEmail = safeStr(seller?.email);
    const sellerPhone = safeStr(seller?.phone);
    const sellerWhatsapp = safeStr(seller?.whatsapp);
    const sellerAbout = safeStr(seller?.aboutbusiness);
    const sellerAddress = safeStr(seller?.businessaddress);
    const verified = getVerification(seller);

    const categories = useMemo(() => {
        const set = new Set<string>();
        ads.forEach((ad) => {
            const value = safeStr(ad?.data?.category) || safeStr(ad?.data?.subcategory);
            if (value) set.add(value);
        });
        return ["all", ...Array.from(set)];
    }, [ads]);

    const filteredAds = useMemo(() => {
        let data = [...ads];

        if (query.trim()) {
            const q = query.toLowerCase();
            data = data.filter((ad) => {
                const title = safeStr(ad?.data?.title).toLowerCase();
                const desc = safeStr(ad?.data?.description).toLowerCase();
                const cat = safeStr(ad?.data?.category).toLowerCase();
                const sub = safeStr(ad?.data?.subcategory).toLowerCase();
                return (
                    title.includes(q) ||
                    desc.includes(q) ||
                    cat.includes(q) ||
                    sub.includes(q)
                );
            });
        }

        if (category !== "all") {
            data = data.filter((ad) => {
                const cat = safeStr(ad?.data?.category);
                const sub = safeStr(ad?.data?.subcategory);
                return cat === category || sub === category;
            });
        }

        if (sortBy === "lowest") {
            data.sort((a, b) => Number(a?.data?.price || 0) - Number(b?.data?.price || 0));
        } else if (sortBy === "highest") {
            data.sort((a, b) => Number(b?.data?.price || 0) - Number(a?.data?.price || 0));
        } else {
            data.sort(
                (a, b) =>
                    new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
            );
        }

        return data;
    }, [ads, query, category, sortBy]);

    const visibleAds = filteredAds.slice(0, visibleCount);
    const canLoadMore = visibleCount < filteredAds.length;

    return (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-4">
                <section className="overflow-hidden rounded-[26px] border border-orange-100 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 px-4 py-5 md:px-6 md:py-6">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_24%)]" />
                        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] border border-white/20 bg-white/10 shadow-lg">
                                    {sellerPhoto ? (
                                        <Image
                                            src={sellerPhoto}
                                            alt={sellerName}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white">
                                            {sellerName.slice(0, 1).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 text-white">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="truncate text-xl font-black md:text-2xl">
                                            {sellerName}
                                        </h1>

                                        {verified ? (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-100">
                                                <IoCheckmarkCircle className="text-sm" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/85">
                                                Seller
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/85 md:text-xs">
                                        <span>{profileStats.totalAds} Active Ads</span>
                                        <span>•</span>
                                        <span>Joined {formatDate(profileStats.joinedAt)}</span>
                                        {sellerAddress ? (
                                            <>
                                                <span>•</span>
                                                <span>{sellerAddress}</span>
                                            </>
                                        ) : null}
                                    </div>

                                    {sellerAbout ? (
                                        <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-relaxed text-white/80 md:text-sm">
                                            {sellerAbout}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                                {sellerPhone ? (
                                    <a
                                        href={`tel:${sellerPhone}`}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-orange-600 shadow-sm hover:bg-orange-50"
                                    >
                                        <IoCallOutline className="text-base" />
                                        Call
                                    </a>
                                ) : null}

                                <Link
                                    href={`/profile-messages/${sellerId}`}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-extrabold text-white backdrop-blur hover:bg-white/15"
                                >
                                    <IoChatbubbleEllipsesOutline className="text-base" />
                                    Chat
                                </Link>

                                {sellerWhatsapp ? (
                                    <a
                                        href={`https://wa.me/${String(sellerWhatsapp).replace(/[^\d]/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-extrabold text-white backdrop-blur hover:bg-white/15"
                                    >
                                        <IoLogoWhatsapp className="text-base" />
                                        WhatsApp
                                    </a>
                                ) : null}

                                {sellerEmail ? (
                                    <a
                                        href={`mailto:${sellerEmail}`}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-extrabold text-white backdrop-blur hover:bg-white/15"
                                    >
                                        <IoMailOutline className="text-base" />
                                        Email
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-orange-100 bg-gradient-to-b from-orange-50/60 to-white p-3 md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Active Ads
                            </div>
                            <div className="mt-1 text-xl font-black text-slate-900">
                                {profileStats.totalAds}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Rating
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-sm font-black text-slate-900">
                                <IoStar className="text-amber-400" />
                                {ratingSummary.averageRating.toFixed(1)} / 5
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                                {ratingSummary.totalRatings} review{ratingSummary.totalRatings === 1 ? "" : "s"}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Response
                            </div>
                            <div className="mt-1 text-sm font-black text-slate-900">
                                {profileStats.responseLabel}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Member Since
                            </div>
                            <div className="mt-1 text-sm font-black text-slate-900">
                                {formatDate(profileStats.joinedAt)}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Total Views
                            </div>
                            <div className="mt-1 text-lg font-black text-slate-900">
                                {profileStats.totalViews}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Buyer Contacts
                            </div>
                            <div className="mt-1 text-lg font-black text-slate-900">
                                {profileStats.totalCalls + profileStats.totalWhatsapp + profileStats.totalInquiries}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Review Quality
                            </div>
                            <div className="mt-1 text-lg font-black text-slate-900">
                                {ratingSummary.totalRatings > 0
                                    ? `${getPercent(ratingSummary.fiveStar + ratingSummary.fourStar, ratingSummary.totalRatings)}% positive`
                                    : "No reviews yet"}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-black text-slate-900">Seller listings</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {filteredAds.length} result{filteredAds.length === 1 ? "" : "s"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="relative min-w-[220px]">
                                <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search seller ads..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-orange-300"
                                />
                            </div>

                            <div className="relative min-w-[160px]">
                                <IoFilterOutline className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm outline-none transition focus:border-orange-300"
                                >
                                    {categories.map((item) => (
                                        <option key={item} value={item}>
                                            {item === "all" ? "All categories" : item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-10 min-w-[150px] rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-orange-300"
                            >
                                <option value="new">Newest</option>
                                <option value="lowest">Lowest price</option>
                                <option value="highest">Highest price</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section>
                    {filteredAds.length === 0 ? (
                        <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                                <IoGridOutline className="text-2xl" />
                            </div>
                            <h3 className="mt-3 text-lg font-black text-slate-900">No matching ads</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Try a different search or category filter.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                                {visibleAds.map((ad: any) => {
                                    const cover =
                                        safeStr(ad?.data?.coverThumbUrl) ||
                                        (Array.isArray(ad?.data?.imageUrls) && ad.data.imageUrls[0]) ||
                                        "";

                                    return (
                                        <Link
                                            key={ad._id}
                                            href={`/ads/${ad._id}`}
                                            className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            <div className="relative h-40 bg-slate-100 md:h-48">
                                                {cover ? (
                                                    <Image
                                                        src={cover}
                                                        alt={safeStr(ad?.data?.title) || "Ad image"}
                                                        fill
                                                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                        <IoStorefrontOutline className="text-3xl" />
                                                    </div>
                                                )}

                                                {safeStr(ad?.data?.subcategory) ? (
                                                    <div className="absolute left-2 top-2 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                                                        {safeStr(ad?.data?.subcategory)}
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div className="p-3">
                                                <div className="line-clamp-2 text-xs font-extrabold text-slate-900 md:text-sm">
                                                    {safeStr(ad?.data?.title) || "Listing"}
                                                </div>

                                                <div className="mt-1.5 text-sm font-black text-orange-600 md:text-base">
                                                    {ad?.data?.contact === "contact"
                                                        ? "Contact for price"
                                                        : moneyKsh(ad?.data?.price)}
                                                </div>

                                                <div className="mt-1 text-[11px] text-slate-500 md:text-xs">
                                                    {safeStr(ad?.data?.region)}
                                                    {safeStr(ad?.data?.area) ? ` • ${safeStr(ad?.data?.area)}` : ""}
                                                </div>

                                                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-orange-600">
                                                    <IoOpenOutline className="text-sm" />
                                                    View details
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {canLoadMore ? (
                                <div className="mt-5 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-5 text-sm font-extrabold text-orange-700 transition hover:bg-orange-100"
                                    >
                                        Load more
                                        <IoChevronDown className="text-base" />
                                    </button>
                                </div>
                            ) : null}
                        </>
                    )}
                </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-[calc(var(--topbar-h,64px)+12px)] lg:self-start">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                            <IoSparklesOutline className="text-lg" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900">Contact seller</h3>
                            <p className="text-xs text-slate-500">Quick ways to reach this seller</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2.5">
                        {sellerPhone ? (
                            <a
                                href={`tel:${sellerPhone}`}
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                            >
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                    <IoCallOutline className="text-base" />
                                </span>
                                Call seller
                            </a>
                        ) : null}

                        <Link
                            href={`/profile-messages/${sellerId}`}
                            className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-700 transition hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-sm"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600">
                                <IoChatbubbleEllipsesOutline className="text-base" />
                            </span>
                            Inbuilt Chat
                        </Link>

                        {sellerWhatsapp ? (
                            <a
                                href={`https://wa.me/${String(sellerWhatsapp).replace(/[^\d]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-bold text-green-700 transition hover:-translate-y-0.5 hover:bg-green-100 hover:shadow-sm"
                            >
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-600">
                                    <IoLogoWhatsapp className="text-base" />
                                </span>
                                WhatsApp seller
                            </a>
                        ) : null}

                        {sellerEmail ? (
                            <a
                                href={`mailto:${sellerEmail}`}
                                className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs font-bold text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-sm"
                            >
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-sky-600">
                                    <IoMailOutline className="text-base" />
                                </span>
                                Email seller
                            </a>
                        ) : null}
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                            Seller info
                        </div>
                        <div className="mt-2 space-y-2 text-xs text-slate-600">
                            <div className="flex items-center justify-between gap-3">
                                <span>Name</span>
                                <span className="font-bold text-slate-900">{sellerName}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Joined</span>
                                <span className="font-bold text-slate-900">
                                    {formatDate(profileStats.joinedAt)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Status</span>
                                <span className="font-bold text-slate-900">
                                    {verified ? "Verified" : "Standard"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Response</span>
                                <span className="font-bold text-slate-900">
                                    {profileStats.responseLabel}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                            <IoStar className="text-amber-400" />
                            <span className="text-xs font-black text-slate-900">Rating summary</span>
                        </div>

                        <div className="space-y-2">
                            {[
                                { label: "5★", value: ratingSummary.fiveStar },
                                { label: "4★", value: ratingSummary.fourStar },
                                { label: "3★", value: ratingSummary.threeStar },
                                { label: "2★", value: ratingSummary.twoStar },
                                { label: "1★", value: ratingSummary.oneStar },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center gap-2 text-xs">
                                    <span className="w-6 font-bold text-slate-700">{row.label}</span>
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full rounded-full bg-amber-400"
                                            style={{
                                                width: `${getPercent(row.value, ratingSummary.totalRatings)}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="w-7 text-right font-bold text-slate-700">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                            <IoTimeOutline className="text-slate-700" />
                            <span className="text-xs font-black text-slate-900">Engagement</span>
                        </div>
                        <div className="space-y-2 text-xs text-slate-600">
                            <div className="flex items-center justify-between">
                                <span>Calls</span>
                                <span className="font-bold text-slate-900">{profileStats.totalCalls}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>WhatsApp</span>
                                <span className="font-bold text-slate-900">{profileStats.totalWhatsapp}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Inquiries</span>
                                <span className="font-bold text-slate-900">{profileStats.totalInquiries}</span>
                            </div>
                        </div>
                    </div>

                </div>
                <LeaveSellerReview
                    sellerId={sellerId}
                    sellerName={sellerName}
                />

                <SellerReviewsList reviews={reviews} />
            </aside>
        </div>
    );
}