"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    IoAdd,
    IoCallOutline,
    IoCheckmarkCircle,
    IoChatbubbleEllipsesOutline,
    IoEyeOutline,
    IoGlobeOutline,
    IoLogoWhatsapp,
    IoMailOutline,
    IoOpenOutline,
    IoPencilOutline,
    IoPersonCircleOutline,
    IoRocketOutline,
    IoSparklesOutline,
    IoStatsChartOutline,
    IoStorefrontOutline,
    IoTimeOutline,
    IoFlashOutline,
    IoTrashOutline,
} from "react-icons/io5";

import { useAuth } from "@/app/hooks/useAuth";
import { deleteAd } from "@/lib/actions/dynamicAd.actions";

type Props = {
    ads: any[];
    totals: {
        totalAds: number;
        active: number;
        pending: number;
        expired: number;
        views: number;
        calls: number;
        whatsapp: number;
        inquiries: number;
        shared: number;
    };
};

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return "Contact for price";
    return `KSh ${n.toLocaleString()}`;
}

function safeStr(v: any) {
    return String(v ?? "").trim();
}

function badgeClass(status: string) {
    if (status === "Active") {
        return "border border-emerald-200 bg-emerald-100 text-emerald-700";
    }
    if (status === "Pending") {
        return "border border-amber-200 bg-amber-100 text-amber-700";
    }
    if (status === "Expired") {
        return "border border-slate-300 bg-slate-200 text-slate-700";
    }
    return "border border-slate-200 bg-slate-100 text-slate-700";
}

function formatDate(input: any) {
    if (!input) return "—";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
}

function getVerification(user: any) {
    if (!user?.verified) return false;

    if (Array.isArray(user.verified)) {
        return user.verified.some((v: any) => v?.accountverified === true);
    }

    return user?.verified?.accountverified === true;
}

function getDeleteImages(ad: any): string[] {
    const keys = new Set<string>();

    const imageUrls = Array.isArray(ad?.data?.imageUrls) ? ad.data.imageUrls : [];
    imageUrls.forEach((item: any) => {
        const v = safeStr(item);
        if (v) keys.add(v);
    });

    const coverThumbUrl = safeStr(ad?.data?.coverThumbUrl);
    if (coverThumbUrl) keys.add(coverThumbUrl);

    return Array.from(keys);
}

export default function SellerAdsClient({ ads, totals }: Props) {
    const router = useRouter();
    const { authUser, user: currentUser, appUserId, loading, profileLoading } = useAuth();

    const [items, setItems] = useState<any[]>(ads || []);
    const [deletingId, setDeletingId] = useState<string>("");
    const [deleteError, setDeleteError] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setItems(ads || []);
    }, [ads]);

    const sellerName = useMemo(() => {
        return (
            safeStr(currentUser?.businessname) ||
            `${safeStr(currentUser?.firstName)} ${safeStr(currentUser?.lastName)}`.trim() ||
            authUser?.displayName ||
            "Seller"
        );
    }, [currentUser, authUser]);

    const sellerPhoto =
        safeStr(currentUser?.photo) ||
        safeStr(currentUser?.imageUrl) ||
        safeStr(authUser?.photoURL) ||
        "";

    const sellerEmail = safeStr(currentUser?.email) || safeStr(authUser?.email) || "";
    const sellerPhone = safeStr(currentUser?.phone);
    const sellerWhatsapp = safeStr(currentUser?.whatsapp);
    const sellerWebsite = safeStr(currentUser?.website);
    const sellerAddress = safeStr(currentUser?.businessaddress);
    const sellerAbout = safeStr(currentUser?.aboutbusiness);
    const verified = getVerification(currentUser);

    const computedTotals = useMemo(() => {
        return items.reduce(
            (acc: any, ad: any) => {
                acc.totalAds += 1;
                acc.active += ad?.adstatus === "Active" ? 1 : 0;
                acc.pending += ad?.adstatus === "Pending" ? 1 : 0;
                acc.expired += ad?.adstatus === "Expired" ? 1 : 0;
                acc.views += Number(ad?.views || 0);
                acc.calls += Number(ad?.calls || 0);
                acc.whatsapp += Number(ad?.whatsapp || 0);
                acc.inquiries += Number(ad?.inquiries || 0);
                acc.shared += Number(ad?.shared || 0);
                return acc;
            },
            {
                totalAds: 0,
                active: 0,
                pending: 0,
                expired: 0,
                views: 0,
                calls: 0,
                whatsapp: 0,
                inquiries: 0,
                shared: 0,
            }
        );
    }, [items]);

    const dashboardTotals = items.length ? computedTotals : totals;

    const activePercent =
        dashboardTotals.totalAds > 0
            ? Math.round((dashboardTotals.active / dashboardTotals.totalAds) * 100)
            : 0;

    const bestAd = useMemo(() => {
        if (!items?.length) return null;

        return [...items].sort((a, b) => {
            const scoreA =
                Number(a?.views || 0) +
                Number(a?.calls || 0) * 3 +
                Number(a?.whatsapp || 0) * 3 +
                Number(a?.inquiries || 0) * 4;

            const scoreB =
                Number(b?.views || 0) +
                Number(b?.calls || 0) * 3 +
                Number(b?.whatsapp || 0) * 3 +
                Number(b?.inquiries || 0) * 4;

            return scoreB - scoreA;
        })[0];
    }, [items]);

    const handleDelete = (ad: any) => {
        const adId = String(ad?._id || "");
        if (!adId) return;

        const confirmed = window.confirm(
            `Delete "${safeStr(ad?.data?.title) || "this ad"}"? This action cannot be undone.`
        );
        if (!confirmed) return;

        setDeleteError("");
        setDeletingId(adId);

        startTransition(async () => {
            try {
                const deleteImages = getDeleteImages(ad);

                await deleteAd({
                    adId,
                    deleteImages,
                    path: "/dashboard/ads",
                });

                setItems((prev) => prev.filter((item) => String(item?._id) !== adId));
                router.refresh();
            } catch (error) {
                console.error("Failed to delete ad:", error);
                setDeleteError("Failed to delete ad. Please try again.");
            } finally {
                setDeletingId("");
            }
        });
    };

    if (loading || profileLoading) {
        return (
            <div className="overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-sm">
                <div className="h-28 animate-pulse bg-gradient-to-r from-orange-100 via-orange-50 to-white" />
                <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <section className="overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 px-4 py-4 md:px-6 md:py-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_24%)]" />
                    <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[20px] border border-white/20 bg-white/10 shadow-lg backdrop-blur">
                                {sellerPhoto ? (
                                    <Image
                                        src={sellerPhoto}
                                        alt={sellerName}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-3xl text-white">
                                        <IoPersonCircleOutline />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1 text-white">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="truncate text-xl font-black md:text-2xl">
                                        {sellerName} Dashboard
                                    </h1>

                                    {verified ? (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-100">
                                            <IoCheckmarkCircle className="text-sm" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/85">
                                            Standard
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-white/80 md:text-sm">
                                    {sellerAbout || "Manage your ads, track performance, and grow your business from one premium dashboard."}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/80">
                                    {sellerEmail ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 backdrop-blur">
                                            <IoMailOutline className="text-sm" />
                                            {sellerEmail}
                                        </span>
                                    ) : null}

                                    {sellerPhone ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 backdrop-blur">
                                            <IoCallOutline className="text-sm" />
                                            {sellerPhone}
                                        </span>
                                    ) : null}

                                    {sellerAddress ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 backdrop-blur">
                                            <IoStorefrontOutline className="text-sm" />
                                            {sellerAddress}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/create-ad"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-orange-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
                            >
                                <IoAdd className="text-base" />
                                New Ad
                            </Link>

                            <Link
                                href="/chat"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                            >
                                <IoChatbubbleEllipsesOutline className="text-base" />
                                Chats
                            </Link>

                            <Link
                                href={appUserId ? `/seller/${appUserId}` : "#"}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                            >
                                <IoOpenOutline className="text-base" />
                                Public Profile
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 border-t border-orange-100 bg-gradient-to-b from-orange-50/60 to-white p-3 md:grid-cols-[1.25fr_0.95fr] md:p-4">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                App User ID
                            </div>
                            <div className="mt-1 line-clamp-1 text-xs font-extrabold text-slate-900">
                                {appUserId || "—"}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                    Package
                                </div>
                                <Link
                                    href="/plan"
                                    className="inline-flex items-center rounded-lg bg-orange-50 px-2 py-1 text-[10px] font-extrabold text-orange-700 hover:bg-orange-100"
                                >
                                    Upgrade
                                </Link>
                            </div>
                            <div className="mt-1 text-xs font-extrabold text-slate-900">
                                {safeStr(currentUser?.subscription?.planName) || "No active plan"}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                Expires
                            </div>
                            <div className="mt-1 text-xs font-extrabold text-slate-900">
                                {formatDate(currentUser?.subscription?.expiresAt)}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[22px] border border-orange-100 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">
                                    Seller Health
                                </div>
                                <div className="mt-1 text-base font-black text-slate-900">
                                    {activePercent}% active
                                </div>
                            </div>
                            <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                                <IoSparklesOutline className="text-xl" />
                            </div>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                                style={{ width: `${activePercent}%` }}
                            />
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl bg-emerald-50 p-2.5">
                                <div className="text-[10px] font-semibold text-emerald-600">Active</div>
                                <div className="mt-1 text-base font-black text-slate-900">
                                    {dashboardTotals.active}
                                </div>
                            </div>
                            <div className="rounded-xl bg-amber-50 p-2.5">
                                <div className="text-[10px] font-semibold text-amber-600">Pending</div>
                                <div className="mt-1 text-base font-black text-slate-900">
                                    {dashboardTotals.pending}
                                </div>
                            </div>
                            <div className="rounded-xl bg-slate-100 p-2.5">
                                <div className="text-[10px] font-semibold text-slate-600">Expired</div>
                                <div className="mt-1 text-base font-black text-slate-900">
                                    {dashboardTotals.expired}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
                <div className="rounded-[22px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">
                            Ads
                        </div>
                        <IoStorefrontOutline className="text-lg text-orange-500" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                        {dashboardTotals.totalAds}
                    </div>
                </div>

                <div className="rounded-[22px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">
                            Views
                        </div>
                        <IoEyeOutline className="text-lg text-emerald-600" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                        {dashboardTotals.views}
                    </div>
                </div>

                <div className="rounded-[22px] border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-sky-600">
                            Calls
                        </div>
                        <IoCallOutline className="text-lg text-sky-600" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                        {dashboardTotals.calls}
                    </div>
                </div>

                <div className="rounded-[22px] border border-green-100 bg-gradient-to-br from-green-50 to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-600">
                            WhatsApp
                        </div>
                        <IoLogoWhatsapp className="text-lg text-green-600" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                        {dashboardTotals.whatsapp}
                    </div>
                </div>

                <div className="rounded-[22px] border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-600">
                            Inquiries
                        </div>
                        <IoChatbubbleEllipsesOutline className="text-lg text-violet-600" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                        {dashboardTotals.inquiries}
                    </div>
                </div>
            </section>

            <section className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                            <IoStatsChartOutline className="text-lg" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900">Performance snapshot</h2>
                            <p className="text-xs text-slate-500">Compact overview of your seller activity.</p>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Avg Views / Ad
                            </div>
                            <div className="mt-1 text-xl font-black text-slate-900">
                                {dashboardTotals.totalAds > 0
                                    ? Math.round(dashboardTotals.views / dashboardTotals.totalAds)
                                    : 0}
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Call Rate
                            </div>
                            <div className="mt-1 text-xl font-black text-slate-900">
                                {dashboardTotals.views > 0
                                    ? `${Math.round((dashboardTotals.calls / dashboardTotals.views) * 100)}%`
                                    : "0%"}
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Shares
                            </div>
                            <div className="mt-1 text-xl font-black text-slate-900">
                                {dashboardTotals.shared}
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Remaining Ads
                            </div>
                            <div className="mt-1 text-xl font-black text-slate-900">
                                {currentUser?.subscription?.remainingAds ?? "—"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-base font-black text-slate-900">Best performing ad</h2>
                    <p className="mt-1 text-xs text-slate-500">Top listing by engagement.</p>

                    {bestAd ? (
                        <div className="mt-3 rounded-[20px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-3">
                            <div className="line-clamp-2 text-sm font-black text-slate-900">
                                {safeStr(bestAd?.data?.title) || "Listing"}
                            </div>

                            <div className="mt-1 text-base font-black text-orange-600">
                                {bestAd?.data?.contact === "contact"
                                    ? "Contact for price"
                                    : moneyKsh(bestAd?.data?.price)}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                                    <div className="text-[10px] text-slate-500">Views</div>
                                    <div className="mt-1 text-base font-black text-slate-900">
                                        {Number(bestAd?.views || 0)}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                                    <div className="text-[10px] text-slate-500">Inquiries</div>
                                    <div className="mt-1 text-base font-black text-slate-900">
                                        {Number(bestAd?.inquiries || 0)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <Link
                                    href={`/ads/${bestAd._id}`}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-700 hover:bg-white"
                                >
                                    View
                                </Link>
                                <Link
                                    href={`/ads/${bestAd._id}/update`}
                                    className="inline-flex h-9 items-center justify-center rounded-xl bg-orange-500 px-3 text-xs font-extrabold text-white hover:bg-orange-600"
                                >
                                    Improve
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                            No ads yet. Create your first listing to start tracking performance.
                        </div>
                    )}
                </div>
            </section>

            <section className="grid gap-3 lg:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
                    <h2 className="text-base font-black text-slate-900">Business & contact info</h2>
                    <p className="mt-1 text-xs text-slate-500">Useful account details buyers rely on.</p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Business
                            </div>
                            <div className="mt-1 text-xs font-extrabold text-slate-900">{sellerName}</div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Email
                            </div>
                            <div className="mt-1 break-all text-xs font-extrabold text-slate-900">
                                {sellerEmail || "—"}
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Phone
                            </div>
                            <div className="mt-1 text-xs font-extrabold text-slate-900">{sellerPhone || "—"}</div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                WhatsApp
                            </div>
                            <div className="mt-1 text-xs font-extrabold text-slate-900">
                                {sellerWhatsapp || "—"}
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Website
                            </div>
                            <div className="mt-1 break-all text-xs font-extrabold text-slate-900">
                                {sellerWebsite || "—"}
                            </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Verification
                            </div>
                            <div className="mt-1 text-xs font-extrabold text-slate-900">
                                {verified ? "Verified seller" : "Not verified"}
                            </div>
                        </div>
                    </div>

                    {sellerAbout ? (
                        <div className="mt-3 rounded-xl bg-slate-50 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                About business
                            </div>
                            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-700">
                                {sellerAbout}
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-base font-black text-slate-900">Quick tools</h2>

                    <div className="mt-3 space-y-2.5">
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                <IoPersonCircleOutline className="text-base" />
                            </span>
                            Edit Profile
                        </Link>

                        <Link
                            href="/create-ad"
                            className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-700 transition hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-sm"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600">
                                <IoAdd className="text-base" />
                            </span>
                            Add New Listing
                        </Link>

                        <Link
                            href="/chat"
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                <IoChatbubbleEllipsesOutline className="text-base" />
                            </span>
                            Open Chats
                        </Link>

                        <Link
                            href={appUserId ? `/seller/${appUserId}` : "#"}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                <IoOpenOutline className="text-base" />
                            </span>
                            Public Seller Page
                        </Link>

                        <Link
                            href="/plan"
                            className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-700 transition hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-sm"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600">
                                <IoRocketOutline className="text-base" />
                            </span>
                            Upgrade Package
                        </Link>

                        {sellerWebsite ? (
                            <a
                                href={sellerWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                            >
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                    <IoGlobeOutline className="text-base" />
                                </span>
                                Open Website
                            </a>
                        ) : null}

                        <div className="rounded-xl bg-slate-50 p-3">
                            <div className="flex items-center gap-2 text-slate-700">
                                <IoTimeOutline className="text-base" />
                                <span className="text-xs font-bold">Plan info</span>
                            </div>
                            <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                                <div className="flex items-center justify-between gap-3">
                                    <span>Plan</span>
                                    <span className="font-bold text-slate-900">
                                        {safeStr(currentUser?.subscription?.planName) || "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Remaining Ads</span>
                                    <span className="font-bold text-slate-900">
                                        {currentUser?.subscription?.remainingAds ?? "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span>Expires</span>
                                    <span className="font-bold text-slate-900">
                                        {formatDate(currentUser?.subscription?.expiresAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">My Listings</h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Manage, edit, boost, feature, or delete your ads.
                        </p>
                    </div>

                    <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                        {items.length} ads
                    </div>
                </div>

                {deleteError ? (
                    <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                        {deleteError}
                    </div>
                ) : null}

                {items.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                            <IoStorefrontOutline className="text-3xl" />
                        </div>
                        <h3 className="mt-3 text-lg font-black text-slate-900">No listings yet</h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Start selling by posting your first ad.
                        </p>
                        <Link
                            href="/create-ad"
                            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-extrabold text-white hover:bg-orange-600"
                        >
                            <IoAdd className="text-base" />
                            Post New Ad
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-[10px] uppercase tracking-[0.15em] text-slate-500">
                                    <th className="px-4 py-3">Ad</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Views</th>
                                    <th className="px-4 py-3">Calls</th>
                                    <th className="px-4 py-3">WA</th>
                                    <th className="px-4 py-3">Inquiries</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((ad: any) => {
                                    const adId = String(ad?._id || "");
                                    const cover =
                                        ad?.data?.coverThumbUrl ||
                                        (Array.isArray(ad?.data?.imageUrls) ? ad.data.imageUrls[0] : "");

                                    const isDeletingThis = deletingId === adId && isPending;

                                    return (
                                        <tr
                                            key={adId}
                                            className="border-t border-slate-100 align-top transition hover:bg-orange-50/40"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex min-w-[240px] items-center gap-3">
                                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                                        {cover ? (
                                                            <Image
                                                                src={cover}
                                                                alt={ad?.data?.title || "Ad image"}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                                <IoStorefrontOutline className="text-2xl" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="line-clamp-1 text-xs font-black text-slate-900 md:text-sm">
                                                            {safeStr(ad?.data?.title) || "Listing"}
                                                        </div>

                                                        <div className="mt-1 text-xs font-extrabold text-orange-600 md:text-sm">
                                                            {ad?.data?.contact === "contact"
                                                                ? "Contact for price"
                                                                : moneyKsh(ad?.data?.price)}
                                                        </div>

                                                        <div className="mt-1 text-[11px] text-slate-500">
                                                            {safeStr(ad?.data?.region)}
                                                            {safeStr(ad?.data?.area) ? ` • ${safeStr(ad?.data?.area)}` : ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${badgeClass(ad?.adstatus)}`}
                                                >
                                                    {ad?.adstatus || "Unknown"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-xs font-bold text-slate-700">
                                                {Number(ad?.views || 0)}
                                            </td>

                                            <td className="px-4 py-3 text-xs font-bold text-slate-700">
                                                {Number(ad?.calls || 0)}
                                            </td>

                                            <td className="px-4 py-3 text-xs font-bold text-slate-700">
                                                {Number(ad?.whatsapp || 0)}
                                            </td>

                                            <td className="px-4 py-3 text-xs font-bold text-slate-700">
                                                {Number(ad?.inquiries || 0)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex min-w-[420px] flex-wrap gap-2">
                                                    <Link
                                                        href={`/ads/${adId}`}
                                                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <IoOpenOutline className="text-sm" />
                                                        View
                                                    </Link>

                                                    <Link
                                                        href={`/ads/${adId}/update`}
                                                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 text-[11px] font-bold text-orange-700 transition hover:bg-orange-100"
                                                    >
                                                        <IoPencilOutline className="text-sm" />
                                                        Edit
                                                    </Link>

                                                    <Link
                                                        href={`/plan?adId=${adId}&intent=boost`}
                                                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 text-[11px] font-bold text-sky-700 transition hover:bg-sky-100"
                                                    >
                                                        <IoFlashOutline className="text-sm" />
                                                        Boost
                                                    </Link>

                                                    <Link
                                                        href={`/plan?adId=${adId}&intent=featured`}
                                                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 text-[11px] font-bold text-violet-700 transition hover:bg-violet-100"
                                                    >
                                                        <IoSparklesOutline className="text-sm" />
                                                        Feature
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(ad)}
                                                        disabled={isDeletingThis}
                                                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 text-[11px] font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                                                    >
                                                        <IoTrashOutline className="text-sm" />
                                                        {isDeletingThis ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}