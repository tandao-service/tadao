"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import {
    LayoutDashboard,
    Users,
    ReceiptText,
    CreditCard,
    FolderTree,
    Package2,
    ShieldCheck,
    AlertTriangle,
    MessageSquare,
    HandCoins,
    CalendarClock,
} from "lucide-react";

export type AdminNavItem = {
    href: string;
    label: string;
    icon: React.ElementType;
    description: string;
};

export const adminNavItems: AdminNavItem[] = [
    {
        href: "/admin",
        label: "Overview",
        icon: LayoutDashboard,
        description: "Platform summary",
    },
    {
        href: "/admin/users",
        label: "Users",
        icon: Users,
        description: "Manage accounts",
    },
    {
        href: "/admin/subscription",
        label: "Subscriptions",
        icon: CalendarClock,
        description: "Plans, expiry, renewals",
    },
    {
        href: "/admin/transactions",
        label: "Transactions",
        icon: ReceiptText,
        description: "Orders and status",
    },
    {
        href: "/admin/payments",
        label: "Payments",
        icon: CreditCard,
        description: "Recorded payments",
    },
    {
        href: "/admin/categories",
        label: "Categories",
        icon: FolderTree,
        description: "Category management",
    },
    {
        href: "/admin/packages",
        label: "Packages",
        icon: Package2,
        description: "Boosts and plans",
    },
    {
        href: "/admin/verification",
        label: "Verification",
        icon: ShieldCheck,
        description: "Verification fee",
    },
    {
        href: "/admin/loans",
        label: "Loans",
        icon: HandCoins,
        description: "Finance requests",
    },
    {
        href: "/admin/communication",
        label: "Communication",
        icon: MessageSquare,
        description: "Broadcast tools",
    },
    {
        href: "/admin/abuse",
        label: "Abuse",
        icon: AlertTriangle,
        description: "Reported content",
    },
];

export function AdminPageHeader({
    eyebrow,
    title,
    subtitle,
    action,
}: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                {eyebrow ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                        {eyebrow}
                    </p>
                ) : null}
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                    {title}
                </h1>
                {subtitle ? (
                    <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                ) : null}
            </div>

            {action ? <div>{action}</div> : null}
        </div>
    );
}

export function AdminCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm ${className}`}
        >
            {children}
        </section>
    );
}

export function AdminSectionLoader({ label }: { label: string }) {
    return (
        <div className="flex min-h-[260px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
                <CircularProgress sx={{ color: "gray" }} size={22} />
                <span>{label}</span>
            </div>
        </div>
    );
}

export function AdminFullscreenLoader({ label }: { label: string }) {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <CircularProgress sx={{ color: "gray" }} size={24} />
                <span className="text-sm font-medium text-slate-700">{label}</span>
            </div>
        </div>
    );
}

export function AdminEmpty({ label }: { label: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            {label}
        </div>
    );
}

export function AdminSidebarLinks({
    onNavigate,
}: {
    onNavigate?: () => void;
}) {
    const pathname = usePathname();

    return (
        <nav className="space-y-1">
            {adminNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={[
                            "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all",
                            active
                                ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg"
                                : "text-slate-300 hover:bg-white/10 hover:text-white",
                        ].join(" ")}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{item.label}</p>
                            <p
                                className={[
                                    "truncate text-[11px]",
                                    active ? "text-orange-50/90" : "text-slate-500",
                                ].join(" ")}
                            >
                                {item.description}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}

export function formatNumber(value: number) {
    return new Intl.NumberFormat().format(Number(value || 0));
}

export function formatCurrency(value: number) {
    return `KES ${new Intl.NumberFormat().format(Number(value || 0))}`;
}