"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, Search } from "lucide-react";

import { useAuth } from "@/app/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbardashboard from "@/components/shared/Navbardashboard";
import {
    AdminFullscreenLoader,
    adminNavItems,
    AdminSidebarLinks,

} from "./AdminShared";

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const {
        authUser,
        user: appUser,
        appUserId,
        loading,
        profileLoading,
    } = useAuth();

    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [decided, setDecided] = useState(false);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (loading || profileLoading) return;

        if (!authUser) {
            router.replace("/");
            return;
        }

        const status = String(appUser?.status ?? "user").toLowerCase();
        if (status === "user") {
            router.replace("/");
            return;
        }

        setAllowed(true);
        setDecided(true);
    }, [authUser, appUser, loading, profileLoading, router]);

    const currentTitle = useMemo(() => {
        const match = adminNavItems.find((item) => item.href === pathname);
        return match?.label || "Admin";
    }, [pathname]);

    if (loading || profileLoading || !decided) {
        return <AdminFullscreenLoader label="Loading admin..." />;
    }

    if (!allowed) return null;

    const adminName =
        [appUser?.firstName, appUser?.lastName].filter(Boolean).join(" ") ||
        appUser?.businessname ||
        "Administrator";

    const adminImage = appUser?.photo || appUser?.imageUrl || "";
    const adminEmail = appUser?.email || authUser?.email || "";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="fixed top-0 z-40 w-full">
                <Navbardashboard userstatus="User" userId={appUserId || ""} />
            </div>

            <div className="flex min-h-screen pt-[60px]">
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                <aside
                    className={[
                        "fixed left-0 top-[60px] z-50 h-[calc(100vh-60px)] w-[290px] border-r border-white/10",
                        "bg-slate-950 text-white transition-transform duration-300",
                        "lg:translate-x-0",
                        mobileOpen ? "translate-x-0" : "-translate-x-full",
                    ].join(" ")}
                >
                    <div className="flex h-full flex-col">
                        <div className="border-b border-white/10 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-sm font-bold text-white shadow-lg">
                                        TM
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold tracking-wide text-white">
                                            Tadao Market
                                        </p>
                                        <p className="text-xs text-slate-400">Admin Console</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-xl p-2 text-slate-300 hover:bg-white/10 lg:hidden"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white/10">
                                        {adminImage ? (
                                            <Image
                                                src={adminImage}
                                                alt={adminName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                                                {adminName.slice(0, 1)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {adminName}
                                        </p>
                                        <p className="truncate text-xs text-slate-400">
                                            {adminEmail || "Administrator"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 px-3 py-4">
                            <AdminSidebarLinks onNavigate={() => setMobileOpen(false)} />
                        </ScrollArea>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 lg:pl-[290px]">
                    <header className="sticky top-[60px] z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setMobileOpen(true)}
                                    className="inline-flex rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-600">
                                        Admin Panel
                                    </p>
                                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                                        {currentTitle}
                                    </h1>
                                </div>
                            </div>

                            <div className="hidden items-center gap-3 md:flex">
                                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
                                    <Search className="h-4 w-4" />
                                    <span className="text-sm">Tadao admin workspace</span>
                                </div>
                                <button className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50">
                                    <Bell className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</div>
                </main>
            </div>
        </div>
    );
}