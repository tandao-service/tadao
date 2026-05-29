"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeDollarSign,
    BellRing,
    ChartNoAxesCombined,
    Eye,
    FileWarning,
    Gavel,
    Layers3,
    MessageCircleMore,
    ShieldAlert,
    Sparkles,
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

import TrendingAds from "@/components/shared/TrendingAds";
import SalesLineGraph from "@/components/shared/SalesLineGraph";

import { getUserAgragate } from "@/lib/actions/user.actions";
import { getTotalProducts } from "@/lib/actions/dynamicAd.actions";
import {
    checkExpiredLatestSubscriptionsPerUser,
    getStatusTrans,
} from "@/lib/actions/transactions.actions";
import { getallLaons } from "@/lib/actions/loan.actions";
import { getallReported } from "@/lib/actions/report.actions";

type OverviewState = {
    users: any;
    adSum: any;
    transactionSum: any[];
    subscriptionsExpirely: any;
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

                const [
                    users,
                    adSum,
                    transactionSum,
                    subscriptionsExpirely,
                    financeRequests,
                    reported,
                ] = await Promise.all([
                    getUserAgragate(20, 1),
                    getTotalProducts(),
                    getStatusTrans(),
                    checkExpiredLatestSubscriptionsPerUser(),
                    getallLaons(10, 1),
                    getallReported(10, 1),
                ]);

                if (cancelled) return;

                setData({
                    users,
                    adSum,
                    transactionSum: Array.isArray(transactionSum) ? transactionSum : [],
                    subscriptionsExpirely,
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
        const totalWorth = Number(data?.adSum?.totalWorth || 0);

        const usersList = Array.isArray(data?.users?.data) ? data.users.data : [];
        const totalUsers =
            Number(data?.users?.totalUsers) || Number(usersList.length) || 0;

        const reportedList = Array.isArray(data?.reported?.data)
            ? data.reported.data
            : [];

        const financeList = Array.isArray(data?.financeRequests?.data)
            ? data.financeRequests.data
            : [];

        const expiringSubsList = Array.isArray(data?.subscriptionsExpirely)
            ? data.subscriptionsExpirely
            : Array.isArray(data?.subscriptionsExpirely?.data)
                ? data.subscriptionsExpirely.data
                : [];

        const completedTransactions = (data?.transactionSum || []).reduce(
            (acc: number, item: any) => {
                const key = String(item?._id || "").toLowerCase();
                if (["completed", "paid", "success", "successful"].includes(key)) {
                    return acc + Number(item?.count || 0);
                }
                return acc;
            },
            0
        );

        const paidRevenue = (data?.transactionSum || []).reduce(
            (acc: number, item: any) => {
                const key = String(item?._id || "").toLowerCase();
                if (["completed", "paid", "success", "successful"].includes(key)) {
                    return acc + Number(item?.totalWorth || 0);
                }
                return acc;
            },
            0
        );

        return {
            totalAds,
            totalWorth,
            totalUsers,
            completedTransactions,
            paidRevenue,
            abuseReports: reportedList.length,
            loanRequests: financeList.length,
            expiringSubscriptions: expiringSubsList.length,
        };
    }, [data]);

    if (loading) {
        return <AdminSectionLoader label="Loading overview..." />;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Overview"
                title="Marketplace Overview"
                subtitle="A fast executive snapshot of Tadao Market performance, growth, risk, and action items."
                action={
                    <Link
                        href="/admin/transactions"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-500"
                    >
                        View transactions
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                }
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Ads"
                    value={formatNumber(overview.totalAds)}
                    hint="All marketplace listings"
                    icon={<Layers3 className="h-5 w-5" />}
                    tone="orange"
                />

                <StatCard
                    title="Users"
                    value={formatNumber(overview.totalUsers)}
                    hint="Registered users in current aggregate"
                    icon={<Users className="h-5 w-5" />}
                    tone="blue"
                />
                <StatCard
                    title="Paid Transactions"
                    value={formatNumber(overview.completedTransactions)}
                    hint="Completed or paid transaction count"
                    icon={<ChartNoAxesCombined className="h-5 w-5" />}
                    tone="violet"
                />
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Revenue"
                    value={formatCurrency(overview.paidRevenue)}
                    hint="From paid / completed transaction groups"
                    icon={<Sparkles className="h-5 w-5" />}
                    tone="amber"
                />
                <StatCard
                    title="Loan Requests"
                    value={formatNumber(overview.loanRequests)}
                    hint="Finance demand needing review"
                    icon={<Store className="h-5 w-5" />}
                    tone="sky"
                />
                <StatCard
                    title="Abuse Reports"
                    value={formatNumber(overview.abuseReports)}
                    hint="Moderation workload"
                    icon={<ShieldAlert className="h-5 w-5" />}
                    tone="rose"
                />
                <StatCard
                    title="Expiring Subscriptions"
                    value={formatNumber(overview.expiringSubscriptions)}
                    hint="Renewals to review"
                    icon={<BellRing className="h-5 w-5" />}
                    tone="slate"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
                <AdminCard>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                                Revenue & Activity Trend
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Quick trend view for marketplace business performance.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3">
                        <SalesLineGraph />
                    </div>
                </AdminCard>

                <AdminCard>
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                            Transaction Status Summary
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Grouped transaction health from your current status aggregate.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {Array.isArray(data?.transactionSum) && data.transactionSum.length > 0 ? (
                            data.transactionSum.map((item: any, index: number) => (
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
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatCurrency(Number(item?.totalWorth || 0))}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <AdminEmpty label="No transaction summary available." />
                        )}
                    </div>
                </AdminCard>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
                <AdminCard>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                                Trending Ads
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                High-visibility ads and strong marketplace activity.
                            </p>
                        </div>

                        <Link
                            href="/admin/categories"
                            className="text-sm font-medium text-orange-600 hover:text-orange-700"
                        >
                            Manage categories
                        </Link>
                    </div>

                    <TrendingAds />
                </AdminCard>

                <AdminCard>
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                            Needs Attention
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Quick actions for the most important admin work right now.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <ActionTile
                            href="/admin/loans"
                            title="Review Loan Requests"
                            value={formatNumber(overview.loanRequests)}
                            subtitle="Finance applications waiting for follow-up"
                            icon={<MessageCircleMore className="h-5 w-5" />}
                        />
                        <ActionTile
                            href="/admin/abuse"
                            title="Moderate Abuse Reports"
                            value={formatNumber(overview.abuseReports)}
                            subtitle="Reported ads or users requiring action"
                            icon={<FileWarning className="h-5 w-5" />}
                        />
                        <ActionTile
                            href="/admin/transactions"
                            title="Check Transaction Health"
                            value={formatNumber(overview.completedTransactions)}
                            subtitle="Review paid/completed marketplace activity"
                            icon={<BadgeDollarSign className="h-5 w-5" />}
                        />
                        <ActionTile
                            href="/admin/subscriptions"
                            title="Manage Subscriptions"
                            value={formatNumber(overview.expiringSubscriptions)}
                            subtitle="Open the dedicated subscription page"
                            icon={<BellRing className="h-5 w-5" />}
                        />
                    </div>
                </AdminCard>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <MiniMetricCard
                    title="Marketplace Reach"
                    value={formatNumber(overview.totalAds)}
                    subtitle="Current published inventory base"
                    icon={<Eye className="h-5 w-5" />}
                />
                <MiniMetricCard
                    title="Monetization Pulse"
                    value={formatCurrency(overview.paidRevenue)}
                    subtitle="Current paid transaction revenue group"
                    icon={<BadgeDollarSign className="h-5 w-5" />}
                />
                <MiniMetricCard
                    title="Risk Watch"
                    value={formatNumber(overview.abuseReports)}
                    subtitle="Moderation and abuse review workload"
                    icon={<Gavel className="h-5 w-5" />}
                />
            </section>

            {appUserId ? (
                <div className="hidden" data-admin-user-id={appUserId} />
            ) : null}
        </div>
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

function MiniMetricCard({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <AdminCard>
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                </div>
            </div>
        </AdminCard>
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