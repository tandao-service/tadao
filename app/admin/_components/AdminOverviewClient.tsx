"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeDollarSign,
    BellRing,
    FileWarning,
    Layers3,
    PackageCheck,
    ShieldAlert,
    Store,
    Users,
} from "lucide-react";

import { useAuth } from "@/app/hooks/useAuth";
import {
    AdminCard,
    AdminEmpty,
    AdminPageHeader,
    AdminSectionLoader,
    formatCurrency,
    formatNumber,
} from "./AdminShared";

import { getUserAgragate } from "@/lib/actions/user.actions";
import { getTotalProducts } from "@/lib/actions/dynamicAd.actions";
import { getStatusTrans } from "@/lib/actions/transactions.actions";
import { getallLaons } from "@/lib/actions/loan.actions";
import { getallReported } from "@/lib/actions/report.actions";

type OverviewState = {
    users: any;
    adSum: any;
    transactionSum: any[];
    financeRequests: any;
    reported: any;
};

export default function AdminOverviewClient() {
    const { appUserId } = useAuth();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<OverviewState | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);

                const [users, adSum, transactionSum, financeRequests, reported] =
                    await Promise.all([
                        getUserAgragate(5, 1),
                        getTotalProducts(),
                        getStatusTrans(),
                        getallLaons(5, 1),
                        getallReported(5, 1),
                    ]);

                if (cancelled) return;

                setData({
                    users,
                    adSum,
                    transactionSum: Array.isArray(transactionSum) ? transactionSum : [],
                    financeRequests,
                    reported,
                });
            } catch (error) {
                console.error("Failed to load admin overview:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const overview = useMemo(() => {
        const totalAds = Number(data?.adSum?.totalProducts || 0);

        const usersList = Array.isArray(data?.users?.data) ? data.users.data : [];
        const totalUsers =
            Number(data?.users?.totalUsers) || Number(usersList.length) || 0;

        const reportedList = Array.isArray(data?.reported?.data)
            ? data.reported.data
            : [];

        const financeList = Array.isArray(data?.financeRequests?.data)
            ? data.financeRequests.data
            : [];

        const paidStatuses = ["completed", "paid", "success", "successful", "active"];

        const paidTransactions = (data?.transactionSum || []).reduce(
            (acc: number, item: any) => {
                const key = String(item?._id || "").toLowerCase();
                return paidStatuses.includes(key) ? acc + Number(item?.count || 0) : acc;
            },
            0
        );

        const paidRevenue = (data?.transactionSum || []).reduce(
            (acc: number, item: any) => {
                const key = String(item?._id || "").toLowerCase();
                return paidStatuses.includes(key)
                    ? acc + Number(item?.totalWorth || 0)
                    : acc;
            },
            0
        );

        return {
            totalAds,
            totalUsers,
            paidTransactions,
            paidRevenue,
            loanRequests: financeList.length,
            abuseReports: reportedList.length,
        };
    }, [data]);

    if (loading) {
        return <AdminSectionLoader label="Loading admin overview..." />;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Overview"
                title="Admin Dashboard"
                subtitle="Fast summary of users, ads, payments, and actions that need attention."
                action={
                    <Link
                        href="/admin/transactions"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-500"
                    >
                        Payments
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                }
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Ads"
                    value={formatNumber(overview.totalAds)}
                    hint="Active marketplace inventory"
                    icon={<Layers3 className="h-5 w-5" />}
                    tone="orange"
                    href="/admin/categories"
                />

                <StatCard
                    title="Users"
                    value={formatNumber(overview.totalUsers)}
                    hint="Registered marketplace users"
                    icon={<Users className="h-5 w-5" />}
                    tone="blue"
                    href="/admin/users"
                />

                <StatCard
                    title="Paid Payments"
                    value={formatNumber(overview.paidTransactions)}
                    hint="Successful payment records"
                    icon={<BadgeDollarSign className="h-5 w-5" />}
                    tone="emerald"
                    href="/admin/transactions"
                />

                <StatCard
                    title="Revenue"
                    value={formatCurrency(overview.paidRevenue)}
                    hint="Successful payment value"
                    icon={<PackageCheck className="h-5 w-5" />}
                    tone="amber"
                    href="/admin/payments"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <AdminCard>
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                            Needs Attention
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Important admin work shortcuts.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <ActionTile
                            href="/admin/loans"
                            title="Loan Requests"
                            value={formatNumber(overview.loanRequests)}
                            subtitle="Finance requests requiring review"
                            icon={<Store className="h-5 w-5" />}
                        />

                        <ActionTile
                            href="/admin/abuse"
                            title="Abuse Reports"
                            value={formatNumber(overview.abuseReports)}
                            subtitle="Reported listings or users"
                            icon={<ShieldAlert className="h-5 w-5" />}
                        />

                        <ActionTile
                            href="/admin/subscriptions"
                            title="Subscriptions"
                            value="Open"
                            subtitle="Manage active subscriptions and remaining ads"
                            icon={<BellRing className="h-5 w-5" />}
                        />

                        <ActionTile
                            href="/admin/packages"
                            title="Packages"
                            value="Edit"
                            subtitle="Edit pricing, listings, and package benefits"
                            icon={<PackageCheck className="h-5 w-5" />}
                        />
                    </div>
                </AdminCard>

                <AdminCard>
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                            Payment Status Summary
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Quick payment health summary. Pending records should not be shown
                            as revenue.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {Array.isArray(data?.transactionSum) &&
                            data.transactionSum.length > 0 ? (
                            data.transactionSum.map((item: any, index: number) => {
                                const status = String(item?._id || "Unknown");
                                const isPending = status.toLowerCase().includes("pending");

                                return (
                                    <div
                                        key={`${status}-${index}`}
                                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {status}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {formatNumber(Number(item?.count || 0))} records
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {isPending
                                                    ? "Not revenue"
                                                    : formatCurrency(Number(item?.totalWorth || 0))}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <AdminEmpty label="No payment summary available." />
                        )}
                    </div>
                </AdminCard>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ShortcutCard
                    href="/admin/users"
                    title="Manage Users"
                    subtitle="View and manage seller accounts"
                />
                <ShortcutCard
                    href="/admin/categories"
                    title="Manage Categories"
                    subtitle="Edit categories and subcategories"
                />
                <ShortcutCard
                    href="/admin/packages"
                    title="Manage Packages"
                    subtitle="Edit advert packages"
                />
                <ShortcutCard
                    href="/admin/verification"
                    title="Verification Fee"
                    subtitle="Manage seller verification pricing"
                />
            </section>

            {appUserId ? <div className="hidden" data-admin-user-id={appUserId} /> : null}
        </div>
    );
}

function StatCard({
    title,
    value,
    hint,
    icon,
    tone = "orange",
    href,
}: {
    title: string;
    value: string;
    hint: string;
    icon: React.ReactNode;
    tone?: "orange" | "emerald" | "blue" | "violet" | "amber" | "sky" | "rose" | "slate";
    href: string;
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
        <Link
            href={href}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
                    {icon}
                </div>
            </div>

            <p className="text-2xl font-semibold tracking-tight text-slate-950">
                {value}
            </p>
            <p className="mt-2 text-xs text-slate-500">{hint}</p>
        </Link>
    );
}

function ActionTile({
    href,
    title,
    value,
    subtitle,
    icon,
}: {
    href: string;
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-orange-200 hover:bg-orange-50/50"
        >
            <div className="flex min-w-0 gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>

            <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-medium text-orange-600 group-hover:text-orange-700">
                    Open
                </p>
            </div>
        </Link>
    );
}

function ShortcutCard({
    href,
    title,
    subtitle,
}: {
    href: string;
    title: string;
    subtitle: string;
}) {
    return (
        <Link
            href={href}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/40"
        >
            <p className="text-sm font-semibold text-slate-950">{title}</p>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </Link>
    );
}