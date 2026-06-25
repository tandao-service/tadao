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
    Boxes,
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
        href: "/admin/products",
        label: "Products",
        icon: Boxes,
        description: "Posted listings",
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
    // {
    //   href: "/admin/payments",
    //    label: "Payments",
    //    icon: CreditCard,
    //     description: "Recorded payments",
    // },
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
            className={`rounded-xl border border-slate-200 bg-white p-2 shadow-sm ${className}`}
        >
            {children}
        </section>
    );
}

export function AdminSectionLoader({ label }: { label: string }) {
    return (
        <main className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
                <p className="text-sm font-semibold text-orange-600">{label}...</p>
            </div>
        </main>
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
                const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={[
                            "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all",
                            active
                                ? "bg-orange-50 text-orange-700 ring-1 ring-orange-100"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
                        ].join(" ")}
                    >
                        <div
                            className={[
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                                active
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-orange-600",
                            ].join(" ")}
                        >
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">
                                {item.label}
                            </p>
                            <p
                                className={[
                                    "truncate text-[11px]",
                                    active ? "text-orange-600/80" : "text-slate-400",
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