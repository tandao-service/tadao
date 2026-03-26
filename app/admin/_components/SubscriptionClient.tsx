"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    AlertTriangle,
    ArrowRight,
    BadgeDollarSign,
    BellRing,
    CalendarClock,
    CheckCircle2,
    CreditCard,
    Layers3,
    RefreshCcw,
    Search,
    Trash2,
    Users,
    Sparkles,
    X,
} from "lucide-react";

import {
    AdminCard,
    AdminEmpty,
    AdminPageHeader,
    AdminSectionLoader,
    formatCurrency,
    formatNumber,
} from "./AdminShared";

import {
    deletePendingSubscriptionTransaction,
    deleteUserPendingSubscription,
    extendUserSubscription,
    getAllPackagesSimple,
    getSubscriptionOverview,
    getSubscriptionsTable,
    markExpiredSubscriptions,
    updateUserSubscriptionPlan,
} from "@/lib/actions/subscription.actions";

type TableFilter = "all" | "active" | "expired" | "expiring" | "inactive";

type PlanModalState = {
    open: boolean;
    userId: string;
    userName: string;
    currentPlan: string;
};

export default function SubscriptionClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const filter = (searchParams.get("filter") || "all") as TableFilter;
    const search = searchParams.get("search") || "";

    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<any>(null);
    const [table, setTable] = useState<any>(null);
    const [packagesList, setPackagesList] = useState<any[]>([]);

    const [searchInput, setSearchInput] = useState(search);
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    const [planModal, setPlanModal] = useState<PlanModalState>({
        open: false,
        userId: "",
        userName: "",
        currentPlan: "",
    });
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("1 month");

    const [isMutating, startTransition] = useTransition();
    const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);

                const [overviewRes, tableRes, packagesRes] = await Promise.all([
                    getSubscriptionOverview(),
                    getSubscriptionsTable({ page, limit, filter, search }),
                    getAllPackagesSimple(),
                ]);

                if (cancelled) return;

                setOverview(overviewRes?.overview || null);
                setTable(tableRes || null);
                setPackagesList(Array.isArray(packagesRes?.data) ? packagesRes.data : []);
            } catch (error) {
                console.error("Failed to load subscription data:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [page, limit, filter, search]);

    const quickStats = useMemo(() => {
        return {
            totalUsers: Number(overview?.totalUsers || 0),
            activeSubscriptions: Number(overview?.activeSubscriptions || 0),
            expiredSubscriptions: Number(overview?.expiredSubscriptions || 0),
            expiringSoon: Number(overview?.expiringSoon || 0),
            inactiveSubscriptions: Number(overview?.inactiveSubscriptions || 0),
            lowRemainingAds: Number(overview?.lowRemainingAds || 0),
            totalRevenue: Number(overview?.revenueSummary?.totalRevenue || 0),
            paidRevenue: Number(overview?.revenueSummary?.paidRevenue || 0),
            totalTransactions: Number(overview?.revenueSummary?.totalTransactions || 0),
            paidTransactions: Number(overview?.revenueSummary?.paidTransactions || 0),
        };
    }, [overview]);

    function buildUrl(updates: Record<string, string | number | null | undefined>) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        return `/admin/subscription?${params.toString()}`;
    }

    function setFilterValue(value: TableFilter) {
        router.push(
            buildUrl({
                filter: value,
                page: 1,
            }),
            { scroll: false }
        );
    }

    function goToPage(nextPage: number) {
        router.push(
            buildUrl({
                page: nextPage,
            }),
            { scroll: false }
        );
    }

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.push(
            buildUrl({
                search: searchInput.trim(),
                page: 1,
            }),
            { scroll: false }
        );
    }

    function handleClearSearch() {
        setSearchInput("");
        router.push(
            buildUrl({
                search: null,
                page: 1,
            }),
            { scroll: false }
        );
    }
    function handleDeletePendingTransaction(transactionId: string) {
        const confirmed = window.confirm(
            "Delete this pending subscription transaction?"
        );
        if (!confirmed) return;

        setPendingTransactionId(transactionId);

        startTransition(async () => {
            try {
                const result = await deletePendingSubscriptionTransaction(transactionId);

                if (!result?.success) {
                    alert(result?.message || "Failed to delete transaction.");
                    return;
                }

                await refreshAfterMutation();
            } catch (error) {
                console.error("Failed to delete pending transaction:", error);
                alert("Failed to delete transaction.");
            } finally {
                setPendingTransactionId(null);
            }
        });
    }
    async function refreshAfterMutation() {
        const [overviewRes, tableRes] = await Promise.all([
            getSubscriptionOverview(),
            getSubscriptionsTable({ page, limit, filter, search }),
        ]);

        setOverview(overviewRes?.overview || null);
        setTable(tableRes || null);
    }

    function handleQuickExtend(userId: string) {
        setPendingUserId(userId);

        startTransition(async () => {
            try {
                await extendUserSubscription({
                    userId,
                    addDays: 30,
                });

                await refreshAfterMutation();
            } catch (error) {
                console.error("Failed to extend subscription:", error);
            } finally {
                setPendingUserId(null);
            }
        });
    }

    async function handleDeletePending(userId: string) {
        const confirmed = window.confirm(
            "Delete this pending/inactive subscription? Active subscriptions will not be deleted."
        );
        if (!confirmed) return;

        setPendingUserId(userId);

        startTransition(async () => {
            try {
                const result = await deleteUserPendingSubscription(userId);

                if (!result?.success) {
                    alert(result?.message || "Failed to delete pending subscription.");
                    return;
                }

                alert(result?.message || "Pending subscription deleted.");
                await refreshAfterMutation();
            } catch (error) {
                console.error("Failed to delete pending subscription:", error);
                alert("Failed to delete pending subscription.");
            } finally {
                setPendingUserId(null);
            }
        });
    }

    function handleMarkExpired() {
        startTransition(async () => {
            try {
                await markExpiredSubscriptions();
                await refreshAfterMutation();
            } catch (error) {
                console.error("Failed to mark expired subscriptions:", error);
            }
        });
    }

    function openPlanModal(item: any) {
        const displayName =
            [item?.firstName, item?.lastName].filter(Boolean).join(" ") ||
            item?.businessname ||
            item?.email ||
            "User";

        setPlanModal({
            open: true,
            userId: String(item?._id || ""),
            userName: displayName,
            currentPlan: item?.subscription?.planName || "No plan",
        });
        setSelectedPlanId("");
        setSelectedPeriod("1 month");
    }

    function closePlanModal() {
        setPlanModal({
            open: false,
            userId: "",
            userName: "",
            currentPlan: "",
        });
        setSelectedPlanId("");
        setSelectedPeriod("1 month");
    }

    function handlePlanChange() {
        if (!planModal.userId || !selectedPlanId) return;

        setPendingUserId(planModal.userId);

        startTransition(async () => {
            try {
                await updateUserSubscriptionPlan({
                    userId: planModal.userId,
                    planId: selectedPlanId,
                    period: selectedPeriod,
                });

                closePlanModal();
                await refreshAfterMutation();
            } catch (error) {
                console.error("Failed to update subscription plan:", error);
            } finally {
                setPendingUserId(null);
            }
        });
    }

    if (loading) {
        return <AdminSectionLoader label="Loading subscriptions..." />;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Subscriptions"
                title="Subscription Command Center"
                subtitle="Monitor active plans, renewals, expiry risk, package distribution, and subscription revenue."
                action={
                    <button
                        type="button"
                        onClick={handleMarkExpired}
                        disabled={isMutating}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-500 disabled:opacity-60"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Mark expired
                    </button>
                }
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Active Subscriptions"
                    value={formatNumber(quickStats.activeSubscriptions)}
                    hint="Users with active plan and valid expiry"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    tone="emerald"
                />
                <StatCard
                    title="Expired"
                    value={formatNumber(quickStats.expiredSubscriptions)}
                    hint="Subscriptions already past expiry"
                    icon={<AlertTriangle className="h-5 w-5" />}
                    tone="rose"
                />
                <StatCard
                    title="Expiring in 7 Days"
                    value={formatNumber(quickStats.expiringSoon)}
                    hint="Renewal follow-up watch list"
                    icon={<BellRing className="h-5 w-5" />}
                    tone="amber"
                />
                <StatCard
                    title="Inactive / No Plan"
                    value={formatNumber(quickStats.inactiveSubscriptions)}
                    hint="Users without active subscription"
                    icon={<Users className="h-5 w-5" />}
                    tone="slate"
                />
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Paid Revenue"
                    value={formatCurrency(quickStats.paidRevenue)}
                    hint="Paid/completed subscription revenue"
                    icon={<BadgeDollarSign className="h-5 w-5" />}
                    tone="orange"
                />
                <StatCard
                    title="All Revenue"
                    value={formatCurrency(quickStats.totalRevenue)}
                    hint="Across all subscription transactions"
                    icon={<CreditCard className="h-5 w-5" />}
                    tone="blue"
                />
                <StatCard
                    title="Paid Transactions"
                    value={formatNumber(quickStats.paidTransactions)}
                    hint="Successful subscription purchases"
                    icon={<CalendarClock className="h-5 w-5" />}
                    tone="violet"
                />
                <StatCard
                    title="Low Remaining Ads"
                    value={formatNumber(quickStats.lowRemainingAds)}
                    hint="Active users nearly out of quota"
                    icon={<Layers3 className="h-5 w-5" />}
                    tone="sky"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <AdminCard>
                    <SectionTitle
                        title="Package Distribution"
                        subtitle="How users are distributed across plans."
                    />

                    {Array.isArray(overview?.planDistribution) && overview.planDistribution.length > 0 ? (
                        <div className="space-y-3">
                            {overview.planDistribution.map((item: any, index: number) => (
                                <div
                                    key={`${item?._id || "plan"}-${index}`}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {item?._id || "Unnamed Plan"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Active: {formatNumber(Number(item?.active || 0))}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-950">
                                            {formatNumber(Number(item?.total || 0))}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">users</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AdminEmpty label="No package distribution data available." />
                    )}
                </AdminCard>

                <AdminCard>
                    <SectionTitle
                        title="Transaction Status Summary"
                        subtitle="Subscription payments grouped by status."
                    />

                    {Array.isArray(overview?.transactionStatusSummary) &&
                        overview.transactionStatusSummary.length > 0 ? (
                        <div className="space-y-3">
                            {overview.transactionStatusSummary.map((item: any, index: number) => (
                                <div
                                    key={`${item?._id || "status"}-${index}`}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {String(item?._id || "Unknown")}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {formatNumber(Number(item?.count || 0))} transactions
                                        </p>
                                    </div>

                                    <div className="text-right text-sm font-semibold text-slate-950">
                                        {formatCurrency(Number(item?.totalAmount || 0))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AdminEmpty label="No transaction summary available." />
                    )}
                </AdminCard>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <AdminCard>
                    <SectionTitle
                        title="Recent Renewals"
                        subtitle="Latest subscription-related transactions."
                    />

                    {Array.isArray(overview?.recentRenewals) && overview.recentRenewals.length > 0 ? (
                        <div className="space-y-3">
                            {overview.recentRenewals.map((item: any) => {
                                const buyer = item?.buyer;
                                const displayName =
                                    [buyer?.firstName, buyer?.lastName].filter(Boolean).join(" ") ||
                                    buyer?.businessname ||
                                    buyer?.email ||
                                    "User";

                                return (
                                    <div
                                        key={String(item?._id)}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {displayName}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Plan: {item?.planId?.name || item?.plan || "Unknown plan"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Status: {item?.status || "Unknown"}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-semibold text-slate-950">
                                                    {formatCurrency(Number(item?.amount || 0))}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {item?.createdAt
                                                        ? new Date(item.createdAt).toLocaleDateString()
                                                        : ""}
                                                </p>
                                            </div>
                                            {String(item?.status || "").toLowerCase() === "pending" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePendingTransaction(String(item?._id))}
                                                    disabled={isMutating && pendingTransactionId === String(item?._id)}
                                                    className="mt-2 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    {isMutating && pendingTransactionId === String(item?._id)
                                                        ? "Deleting..."
                                                        : "Delete pending"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <AdminEmpty label="No recent renewal activity found." />
                    )}
                </AdminCard>

                <AdminCard>
                    <SectionTitle
                        title="Upcoming Expiries"
                        subtitle="Users who may need renewal follow-up soon."
                    />

                    {Array.isArray(overview?.upcomingExpiries) && overview.upcomingExpiries.length > 0 ? (
                        <div className="space-y-3">
                            {overview.upcomingExpiries.map((item: any) => {
                                const displayName =
                                    [item?.firstName, item?.lastName].filter(Boolean).join(" ") ||
                                    item?.businessname ||
                                    item?.email ||
                                    "User";

                                const userId = String(item?._id || "");

                                return (
                                    <div
                                        key={userId}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {displayName}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Plan: {item?.subscription?.planName || "No plan"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Remaining ads:{" "}
                                                    {formatNumber(Number(item?.subscription?.remainingAds || 0))}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-semibold text-slate-950">
                                                    {item?.subscription?.expiresAt
                                                        ? new Date(item.subscription.expiresAt).toLocaleDateString()
                                                        : "No expiry"}
                                                </p>

                                                <div className="mt-2 flex flex-wrap justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuickExtend(userId)}
                                                        disabled={isMutating && pendingUserId === userId}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-orange-500 disabled:opacity-60"
                                                    >
                                                        <RefreshCcw className="h-3.5 w-3.5" />
                                                        Extend 30 days
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => openPlanModal(item)}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        Change plan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <AdminEmpty label="No upcoming expiries found." />
                    )}
                </AdminCard>
            </section>

            <AdminCard>
                <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <SectionTitle
                        title="All Subscriptions"
                        subtitle="View all, active, expired, expiring soon, or inactive subscriptions."
                    />

                    <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search email, phone, business, or plan"
                                className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white hover:bg-orange-500"
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Clear
                        </button>
                    </form>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                    <FilterButton active={filter === "all"} onClick={() => setFilterValue("all")}>
                        All
                    </FilterButton>
                    <FilterButton active={filter === "active"} onClick={() => setFilterValue("active")}>
                        Active
                    </FilterButton>
                    <FilterButton active={filter === "expired"} onClick={() => setFilterValue("expired")}>
                        Expired
                    </FilterButton>
                    <FilterButton active={filter === "expiring"} onClick={() => setFilterValue("expiring")}>
                        Expiring Soon
                    </FilterButton>
                    <FilterButton active={filter === "inactive"} onClick={() => setFilterValue("inactive")}>
                        Inactive
                    </FilterButton>
                </div>

                {Array.isArray(table?.data) && table.data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr>
                                    <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        User
                                    </th>
                                    <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Plan
                                    </th>
                                    <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>
                                    <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Expires
                                    </th>
                                    <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Remaining Ads
                                    </th>
                                    <th className="px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {table.data.map((item: any) => {
                                    const displayName =
                                        [item?.firstName, item?.lastName].filter(Boolean).join(" ") ||
                                        item?.businessname ||
                                        item?.email ||
                                        "User";

                                    const activeNow =
                                        Boolean(item?.subscription?.active) &&
                                        item?.subscription?.expiresAt &&
                                        new Date(item.subscription.expiresAt) > new Date();

                                    const userId = String(item?._id || "");

                                    return (
                                        <tr key={userId}>
                                            <td className="rounded-l-2xl bg-slate-50 px-4 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                                                    <p className="mt-1 text-xs text-slate-500">{item?.email || "-"}</p>
                                                </div>
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                                {item?.subscription?.planName || "No plan"}
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4">
                                                <span
                                                    className={[
                                                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                                        activeNow
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-rose-100 text-rose-700",
                                                    ].join(" ")}
                                                >
                                                    {activeNow ? "Active" : "Inactive / Expired"}
                                                </span>
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                                {item?.subscription?.expiresAt
                                                    ? new Date(item.subscription.expiresAt).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                                {formatNumber(Number(item?.subscription?.remainingAds || 0))}
                                            </td>

                                            <td className="rounded-r-2xl bg-slate-50 px-4 py-4">
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuickExtend(userId)}
                                                        disabled={isMutating && pendingUserId === userId}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-orange-500 disabled:opacity-60"
                                                    >
                                                        Extend
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => openPlanModal(item)}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        Change plan
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Page {table?.page || 1} of {table?.totalPages || 1}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={(table?.page || 1) <= 1}
                                    onClick={() => goToPage((table?.page || 1) - 1)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={(table?.page || 1) >= (table?.totalPages || 1)}
                                    onClick={() => goToPage((table?.page || 1) + 1)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AdminEmpty label="No subscriptions found for this filter." />
                )}
            </AdminCard>

            {planModal.open && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                                    Change plan
                                </p>
                                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                                    Update Subscription Plan
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    User: <span className="font-medium text-slate-700">{planModal.userName}</span>
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Current plan: <span className="font-medium text-slate-700">{planModal.currentPlan}</span>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closePlanModal}
                                className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Select package
                                </label>
                                <select
                                    value={selectedPlanId}
                                    onChange={(e) => setSelectedPlanId(e.target.value)}
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-orange-400"
                                >
                                    <option value="">Choose package</option>
                                    {packagesList.map((pkg: any) => (
                                        <option key={String(pkg?._id)} value={String(pkg?._id)}>
                                            {pkg?.name || "Unnamed Plan"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Subscription period
                                </label>
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-orange-400"
                                >
                                    <option value="1 week">1 week</option>
                                    <option value="2 weeks">2 weeks</option>
                                    <option value="1 month">1 month</option>
                                    <option value="3 months">3 months</option>
                                    <option value="6 months">6 months</option>
                                    <option value="1 year">1 year</option>
                                </select>
                            </div>

                            {selectedPlanId ? (
                                <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                                    The selected plan will replace the user’s current subscription and refresh
                                    their entitlements based on the package settings.
                                </div>
                            ) : null}

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closePlanModal}
                                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePlanChange}
                                    disabled={!selectedPlanId || (isMutating && pendingUserId === planModal.userId)}
                                    className="h-11 rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60"
                                >
                                    {isMutating && pendingUserId === planModal.userId
                                        ? "Updating..."
                                        : "Update plan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SectionTitle({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
    );
}

function FilterButton({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                active
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function StatCard({
    title,
    value,
    hint,
    icon,
    tone = "orange",
}: {
    title: string;
    value: string;
    hint: string;
    icon: React.ReactNode;
    tone?: "orange" | "emerald" | "blue" | "violet" | "amber" | "sky" | "rose" | "slate";
}) {
    const tones: Record<string, string> = {
        orange: "bg-orange-50 text-orange-600",
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        violet: "bg-violet-50 text-violet-600",
        amber: "bg-amber-50 text-amber-600",
        sky: "bg-sky-50 text-sky-600",
        rose: "bg-rose-50 text-rose-600",
        slate: "bg-slate-100 text-slate-700",
    };

    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
                    {icon}
                </div>
            </div>

            <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
            <p className="mt-2 text-xs text-slate-500">{hint}</p>
        </div>
    );
}