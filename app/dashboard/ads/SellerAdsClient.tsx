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
    IoFlashOutline,
    IoLogoWhatsapp,
    IoOpenOutline,
    IoPencilOutline,
    IoPersonCircleOutline,
    IoRocketOutline,
    IoSparklesOutline,
    IoStorefrontOutline,
    IoTimeOutline,
    IoTrashOutline,
} from "react-icons/io5";

import { useAuth } from "@/app/hooks/useAuth";
import {
    boostAd,
    deleteAd,
    featureAd,
} from "@/lib/actions/dynamicAd.actions";
import Verification from "@/components/shared/Verification";

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

function safeStr(v: any) {
    return String(v ?? "").trim();
}

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return "Contact for price";
    return `KSh ${n.toLocaleString()}`;
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

function badgeClass(status: string) {
    if (status === "Active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "Pending") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "Expired") return "bg-slate-100 text-slate-700 border-slate-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
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

function MiniStat({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: any;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {label}
                </p>
                <p className="text-lg font-black text-slate-950">{value}</p>
            </div>
        </div>
    );
}

export default function SellerAdsClient({ ads, totals }: Props) {
    const router = useRouter();
    const { authUser, user: currentUser, appUserId, loading, profileLoading } = useAuth();

    const [items, setItems] = useState<any[]>(ads || []);
    const [deletingId, setDeletingId] = useState("");
    const [actioningId, setActioningId] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [actionError, setActionError] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [query, setQuery] = useState("");
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

    const verified = getVerification(currentUser);

    const dashboardTotals = useMemo(() => {
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

    const activePercent =
        dashboardTotals.totalAds > 0
            ? Math.round((dashboardTotals.active / dashboardTotals.totalAds) * 100)
            : 0;

    const filteredItems = useMemo(() => {
        return items.filter((ad) => {
            const title = safeStr(ad?.data?.title).toLowerCase();
            const status = safeStr(ad?.adstatus);

            const matchStatus =
                statusFilter === "All" || status.toLowerCase() === statusFilter.toLowerCase();

            const matchQuery =
                !query.trim() || title.includes(query.trim().toLowerCase());

            return matchStatus && matchQuery;
        });
    }, [items, statusFilter, query]);

    const handleBoost = (ad: any) => {
        const adId = String(ad?._id || "");
        if (!adId || !appUserId) return;

        setActionError("");
        setActioningId(adId);

        startTransition(async () => {
            try {
                const result = await boostAd({
                    adId,
                    userId: appUserId,
                    path: "/dashboard/ads",
                });

                if (!result?.ok) {
                    setActionError(result?.message || "Unable to boost ad.");
                    return;
                }

                router.refresh();
            } catch (error) {
                console.error(error);
                setActionError("Failed to boost ad. Please try again.");
            } finally {
                setActioningId("");
            }
        });
    };

    const handleFeature = (ad: any) => {
        const adId = String(ad?._id || "");
        if (!adId || !appUserId) return;

        setActionError("");
        setActioningId(adId);

        startTransition(async () => {
            try {
                const result = await featureAd({
                    adId,
                    userId: appUserId,
                    path: "/dashboard/ads",
                });

                if (!result?.ok) {
                    setActionError(result?.message || "Unable to feature ad.");
                    return;
                }

                router.refresh();
            } catch (error) {
                console.error(error);
                setActionError("Failed to feature ad. Please try again.");
            } finally {
                setActioningId("");
            }
        });
    };

    const handleDelete = (ad: any) => {
        const adId = String(ad?._id || "");
        if (!adId) return;

        const confirmed = window.confirm(
            `Delete "${safeStr(ad?.data?.title) || "this ad"}"?`
        );

        if (!confirmed) return;

        setDeleteError("");
        setDeletingId(adId);

        startTransition(async () => {
            try {
                await deleteAd({
                    adId,
                    deleteImages: getDeleteImages(ad),
                    path: "/dashboard/ads",
                });

                setItems((prev) => prev.filter((item) => String(item?._id) !== adId));
                router.refresh();
            } catch (error) {
                console.error(error);
                setDeleteError("Failed to delete ad. Please try again.");
            } finally {
                setDeletingId("");
            }
        });
    };

    if (loading || profileLoading) {
        return (
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-100" />
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">


            <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                {/* Sidebar */}
                <aside className="space-y-4 lg:sticky lg:top-[calc(var(--topbar-h,64px)+16px)] lg:self-start">
                    {/* Header */}
                    <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-600 p-5 text-white">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
                                        {sellerPhoto ? (
                                            <Image
                                                src={sellerPhoto}
                                                alt={sellerName}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-4xl">
                                                <IoPersonCircleOutline />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-xl font-black md:text-2xl">
                                                {sellerName}
                                            </h1>
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                                {verified ? "Verified Seller" : "Standard Seller"}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-white/75">
                                            Manage listings, boost ads, and track buyer engagement.
                                        </p>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </section>
                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-black text-slate-950">Seller summary</h2>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <MiniStat
                                label="Ads"
                                value={dashboardTotals.totalAds}
                                icon={<IoStorefrontOutline className="text-lg text-orange-600" />}
                                color="bg-orange-50"
                            />
                            <MiniStat
                                label="Views"
                                value={dashboardTotals.views}
                                icon={<IoEyeOutline className="text-lg text-blue-600" />}
                                color="bg-blue-50"
                            />
                            <MiniStat
                                label="Calls"
                                value={dashboardTotals.calls}
                                icon={<IoCallOutline className="text-lg text-sky-600" />}
                                color="bg-sky-50"
                            />
                            <MiniStat
                                label="WhatsApp"
                                value={dashboardTotals.whatsapp}
                                icon={<IoLogoWhatsapp className="text-lg text-emerald-600" />}
                                color="bg-emerald-50"
                            />
                        </div>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                <span>Seller health</span>
                                <span>{activePercent}% active</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"
                                    style={{ width: `${activePercent}%` }}
                                />
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-xl bg-emerald-50 p-2">
                                    <p className="text-[10px] font-bold text-emerald-600">Active</p>
                                    <p className="font-black">{dashboardTotals.active}</p>
                                </div>
                                <div className="rounded-xl bg-amber-50 p-2">
                                    <p className="text-[10px] font-bold text-amber-600">Pending</p>
                                    <p className="font-black">{dashboardTotals.pending}</p>
                                </div>
                                <div className="rounded-xl bg-slate-100 p-2">
                                    <p className="text-[10px] font-bold text-slate-600">Expired</p>
                                    <p className="font-black">{dashboardTotals.expired}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-black text-slate-950">Plan & verification</h2>

                        <div className="mt-3 space-y-2 rounded-2xl bg-slate-50 p-3 text-xs">
                            <div className="flex justify-between gap-3">
                                <span className="text-slate-500">Plan</span>
                                <span className="font-black">
                                    {safeStr(currentUser?.subscription?.planName) || "No active plan"}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-slate-500">Remaining Ads</span>
                                <span className="font-black">
                                    {currentUser?.subscription?.remainingAds ?? "—"}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-slate-500">Expires</span>
                                <span className="font-black">
                                    {formatDate(currentUser?.subscription?.expiresAt)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-3">
                            <Verification
                                user={currentUser}
                                userId={currentUser?._id ?? ""}
                                isAdCreator={true}
                                handlePayNow={() =>
                                    router.push("/verify/?redirect_url=dashboard/ads")
                                }
                            />
                        </div>

                        <Link
                            href="/plan"
                            className="mt-3 flex h-11 items-center justify-center gap-2 rounded-2xl bg-purple-50 text-sm font-black text-purple-700 hover:bg-purple-100"
                        >
                            <IoRocketOutline />
                            Upgrade Package
                        </Link>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-black text-slate-950">Quick tools</h2>

                        <div className="mt-3 space-y-2">
                            <Link
                                href="/create-ad"
                                className="flex items-center gap-3 rounded-2xl bg-orange-50 p-3 text-sm font-bold text-orange-700 hover:bg-orange-100"
                            >
                                <IoAdd />
                                Add New Listing
                            </Link>

                            <Link
                                href="/chat"
                                className="flex items-center gap-3 rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
                            >
                                <IoChatbubbleEllipsesOutline />
                                Open Chats
                            </Link>

                            <Link
                                href={appUserId ? `/seller/${appUserId}` : "#"}
                                className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
                            >
                                <IoOpenOutline />
                                Public Seller Page
                            </Link>
                        </div>
                    </section>
                </aside>

                {/* Ads content */}
                <section className="min-w-0 rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-4">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-950">
                                    My Listings
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Manage, edit, boost, feature, or delete your ads.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search your ads..."
                                    className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {deleteError ? (
                        <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {deleteError}
                        </div>
                    ) : null}

                    {actionError ? (
                        <div className="border-b border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            {actionError}
                        </div>
                    ) : null}

                    {filteredItems.length === 0 ? (
                        <div className="px-4 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                                <IoStorefrontOutline className="text-3xl" />
                            </div>
                            <h3 className="mt-4 text-lg font-black text-slate-950">
                                No listings found
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Create a new ad or change your filter.
                            </p>
                            <Link
                                href="/create-ad"
                                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600"
                            >
                                <IoAdd />
                                Post New Ad
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredItems.map((ad: any) => {
                                const adId = String(ad?._id || "");
                                const cover =
                                    ad?.data?.coverThumbUrl ||
                                    (Array.isArray(ad?.data?.imageUrls)
                                        ? ad.data.imageUrls[0]
                                        : "");

                                const isDeletingThis = deletingId === adId && isPending;
                                const isActioningThis = actioningId === adId;

                                const isFeaturedNow =
                                    Boolean(ad?.boost?.isFeatured) &&
                                    ad?.boost?.featuredUntil &&
                                    new Date(ad.boost.featuredUntil).getTime() > Date.now();

                                const isBoostedNow =
                                    Boolean(ad?.boost?.isTop) &&
                                    ad?.boost?.topUntil &&
                                    new Date(ad.boost.topUntil).getTime() > Date.now();

                                return (
                                    <article
                                        key={adId}
                                        className="grid gap-4 p-4 transition hover:bg-orange-50/30 md:grid-cols-[120px_minmax(0,1fr)]"
                                    >
                                        <div className="relative h-36 overflow-hidden rounded-2xl bg-slate-100 md:h-28">
                                            {cover ? (
                                                <Image
                                                    src={cover}
                                                    alt={ad?.data?.title || "Ad image"}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-3xl text-slate-400">
                                                    <IoStorefrontOutline />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0">
                                                    <h3 className="line-clamp-1 text-base font-black text-slate-950">
                                                        {safeStr(ad?.data?.title) || "Listing"}
                                                    </h3>

                                                    <p className="mt-1 text-lg font-black text-orange-600">
                                                        {ad?.data?.contact === "contact"
                                                            ? "Contact for price"
                                                            : moneyKsh(ad?.data?.price)}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {safeStr(ad?.data?.region)}
                                                        {safeStr(ad?.data?.area)
                                                            ? ` • ${safeStr(ad?.data?.area)}`
                                                            : ""}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black ${badgeClass(ad?.adstatus)}`}
                                                >
                                                    {ad?.adstatus || "Unknown"}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                                    {Number(ad?.views || 0)} views
                                                </span>
                                                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                                                    {Number(ad?.calls || 0)} calls
                                                </span>
                                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                                    {Number(ad?.whatsapp || 0)} WhatsApp
                                                </span>
                                                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                                                    {Number(ad?.inquiries || 0)} inquiries
                                                </span>
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {isBoostedNow ? (
                                                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-black text-sky-700">
                                                        Boosted until {formatDate(ad.boost.topUntil)}
                                                    </span>
                                                ) : null}

                                                {isFeaturedNow ? (
                                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-black text-purple-700">
                                                        Featured until {formatDate(ad.boost.featuredUntil)}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <Link
                                                    href={`/ads/${adId}`}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-700 hover:bg-white"
                                                >
                                                    <IoOpenOutline />
                                                    View
                                                </Link>

                                                <Link
                                                    href={`/ads/${adId}/update`}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-orange-50 px-3 text-xs font-black text-orange-700 hover:bg-orange-100"
                                                >
                                                    <IoPencilOutline />
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleBoost(ad)}
                                                    disabled={isPending || isActioningThis || isDeletingThis}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-sky-50 px-3 text-xs font-black text-sky-700 hover:bg-sky-100 disabled:opacity-60"
                                                >
                                                    <IoFlashOutline />
                                                    {isActioningThis
                                                        ? "Please wait..."
                                                        : isBoostedNow
                                                            ? "Boosted"
                                                            : "Boost"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleFeature(ad)}
                                                    disabled={isPending || isActioningThis || isDeletingThis}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-purple-50 px-3 text-xs font-black text-purple-700 hover:bg-purple-100 disabled:opacity-60"
                                                >
                                                    <IoSparklesOutline />
                                                    {isActioningThis
                                                        ? "Please wait..."
                                                        : isFeaturedNow
                                                            ? "Featured"
                                                            : "Feature"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(ad)}
                                                    disabled={isDeletingThis || isActioningThis}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-50 px-3 text-xs font-black text-red-700 hover:bg-red-100 disabled:opacity-60"
                                                >
                                                    <IoTrashOutline />
                                                    {isDeletingThis ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}