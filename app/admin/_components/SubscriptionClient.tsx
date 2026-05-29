"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowRight,
    RefreshCcw,
    Search,
    Sparkles,
    X,
} from "lucide-react";

import {
    AdminCard,
    AdminEmpty,
    AdminPageHeader,
    AdminSectionLoader,
    formatNumber,
} from "./AdminShared";

import {
    extendUserSubscription,
    getAllPackagesSimple,
    getSubscriptionsTable,
    updateUserSubscriptionPlan,
} from "@/lib/actions/subscription.actions";

type PlanModalState = {
    open: boolean;
    userId: string;
    userName: string;
    currentPlan: string;
};

export default function SubscriptionClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [confirmExtend, setConfirmExtend] = useState<{
        open: boolean;
        userId: string;
        userName: string;
    }>({
        open: false,
        userId: "",
        userName: "",
    });
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";

    const [loading, setLoading] = useState(true);
    const [table, setTable] = useState<any>(null);
    const [packagesList, setPackagesList] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState(search);
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);
    const [isMutating, startTransition] = useTransition();

    const [planModal, setPlanModal] = useState<PlanModalState>({
        open: false,
        userId: "",
        userName: "",
        currentPlan: "",
    });

    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("1 month");

    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);

                const [tableRes, packagesRes] = await Promise.all([
                    getSubscriptionsTable({
                        page,
                        limit,
                        search,
                    }),
                    getAllPackagesSimple(),
                ]);

                if (cancelled) return;

                setTable(tableRes || null);
                setPackagesList(Array.isArray(packagesRes?.data) ? packagesRes.data : []);
            } catch (error) {
                console.error("Failed to load active subscriptions:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [page, limit, search]);

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

    function goToPage(nextPage: number) {
        router.push(buildUrl({ page: nextPage }), { scroll: false });
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

    async function refreshAfterMutation() {
        const tableRes = await getSubscriptionsTable({
            page,
            limit,
            search,
        });

        setTable(tableRes || null);
    }

    function openExtendModal(userId: string, userName: string) {
        setConfirmExtend({
            open: true,
            userId,
            userName,
        });
    }

    function closeExtendModal() {
        setConfirmExtend({
            open: false,
            userId: "",
            userName: "",
        });
    }

    function handleQuickExtend() {
        if (!confirmExtend.userId) return;

        setPendingUserId(confirmExtend.userId);

        startTransition(async () => {
            try {
                const result = await extendUserSubscription({
                    userId: confirmExtend.userId,
                    addDays: 30,
                });

                if (result && result.success === false) {
                    alert(result.message || "Failed to extend subscription.");
                    return;
                }

                closeExtendModal();
                await refreshAfterMutation();
            } catch (error) {
                console.error("Failed to extend subscription:", error);
                alert("Failed to extend subscription.");
            } finally {
                setPendingUserId(null);
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
                const result = await updateUserSubscriptionPlan({
                    userId: planModal.userId,
                    planId: selectedPlanId,
                    period: selectedPeriod,
                });

                if (result && result.success === false) {
                    alert(result.message || "Failed to update subscription plan.");
                    return;
                }

                closePlanModal();
                await refreshAfterMutation();
            } catch (error) {
                console.error("Failed to update subscription plan:", error);
                alert("Failed to update subscription plan.");
            } finally {
                setPendingUserId(null);
            }
        });
    }

    if (loading) {
        return <AdminSectionLoader label="Loading active subscriptions..." />;
    }

    return (
        <div className="space-y-6">

            <AdminCard>
                <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <SectionTitle
                        title="Active Subscribers"
                        subtitle="Search active subscribers and manage their package or expiry."
                    />

                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
                    >
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

                                    const userId = String(item?._id || "");

                                    return (
                                        <tr key={userId}>
                                            <td className="rounded-l-2xl bg-slate-50 px-4 py-4">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {displayName}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {item?.email || "-"}
                                                </p>
                                                {item?.phone ? (
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {item.phone}
                                                    </p>
                                                ) : null}
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                                {item?.subscription?.planName || "No plan"}
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
                                                        onClick={() => openExtendModal(userId, displayName)}
                                                        disabled={isMutating && pendingUserId === userId}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-orange-500 disabled:opacity-60"
                                                    >
                                                        {isMutating && pendingUserId === userId
                                                            ? "Extending..."
                                                            : "Extend 30 days"}
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
                    <AdminEmpty label="No active subscriptions found." />
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
                                    User:{" "}
                                    <span className="font-medium text-slate-700">
                                        {planModal.userName}
                                    </span>
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Current plan:{" "}
                                    <span className="font-medium text-slate-700">
                                        {planModal.currentPlan}
                                    </span>
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
                                    disabled={
                                        !selectedPlanId ||
                                        (isMutating && pendingUserId === planModal.userId)
                                    }
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
            {confirmExtend.open && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="mb-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                                Confirm Extension
                            </p>

                            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                                Extend subscription?
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                This will add <span className="font-semibold text-slate-900">30 days</span>{" "}
                                to{" "}
                                <span className="font-semibold text-slate-900">
                                    {confirmExtend.userName}
                                </span>
                                ’s current subscription.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                            The new expiry date will be calculated from the current expiry date if
                            still active, otherwise from today.
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeExtendModal}
                                disabled={isMutating}
                                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleQuickExtend}
                                disabled={isMutating && pendingUserId === confirmExtend.userId}
                                className="h-11 rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60"
                            >
                                {isMutating && pendingUserId === confirmExtend.userId
                                    ? "Extending..."
                                    : "Yes, extend 30 days"}
                            </button>
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
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
    );
}