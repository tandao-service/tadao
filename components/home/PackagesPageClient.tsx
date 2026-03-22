"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DiamondIcon from "@mui/icons-material/Diamond";
import TopBar from "@/components/home/TopBar.client";
import Listpackages from "@/components/shared/listpackages";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { useAuth } from "@/app/hooks/useAuth";

function getDaysRemaining(expiresAt?: string | Date | null) {
    if (!expiresAt) return 0;

    const now = new Date();
    const exp = new Date(expiresAt);
    const diff = exp.getTime() - now.getTime();

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function PackagesPageClient() {
    const router = useRouter();
    const { user, appUserId, loading, profileLoading } = useAuth();

    const [packagesList, setPackagesList] = useState<any[]>([]);
    const [packagesLoading, setPackagesLoading] = useState(true);

    useEffect(() => {
        if (!loading && !profileLoading && !appUserId) {
            router.replace("/auth");
        }
    }, [loading, profileLoading, appUserId, router]);

    useEffect(() => {
        let mounted = true;

        const loadPackages = async () => {
            try {
                setPackagesLoading(true);
                const data = await getAllPackages();

                if (mounted) {
                    setPackagesList(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to load packages:", error);
                if (mounted) setPackagesList([]);
            } finally {
                if (mounted) setPackagesLoading(false);
            }
        };

        loadPackages();

        return () => {
            mounted = false;
        };
    }, []);

    const subscription = user?.subscription || {};
    const isActive = Boolean(subscription?.active);
    const packname = isActive ? String(subscription?.planName || "Free") : "Free";
    const daysRemaining =
        isActive && subscription?.expiresAt
            ? getDaysRemaining(subscription.expiresAt)
            : 0;

    const isBusy = loading || profileLoading || packagesLoading;

    if (isBusy) {
        return (
            <>
                <TopBar />
                <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                    <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
                        <section className="overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-r from-orange-500 to-orange-400 shadow-sm">
                            <div className="px-6 py-8 text-white md:px-10 md:py-10">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                                    <DiamondIcon fontSize="small" />
                                    Packages
                                </div>

                                <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
                                    Choose Your Package
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
                                    Loading packages and preparing your subscription options.
                                </p>
                            </div>
                        </section>

                        <section className="mt-6 rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                                    Available packages
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Choose the best package for your ads.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-[360px] animate-pulse rounded-[24px] border border-orange-100 bg-gradient-to-b from-orange-50 to-white"
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </>
        );
    }

    if (!user || !appUserId) {
        return null;
    }

    return (
        <>
            <TopBar />

            <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
                    <section className="overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-r from-orange-500 to-orange-400 shadow-sm">
                        <div className="px-6 py-8 text-white md:px-10 md:py-10">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                                        <DiamondIcon fontSize="small" />
                                        Subscription plans
                                    </div>

                                    <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
                                        Choose Your Package
                                    </h1>

                                    <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
                                        Select the package that fits your posting needs and continue
                                        to payment.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">
                                        Current plan
                                    </p>
                                    <p className="mt-1 text-2xl font-extrabold text-white">
                                        {packname}
                                    </p>
                                    <p className="mt-1 text-sm text-orange-50">
                                        {isActive
                                            ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`
                                            : "You are currently on the free plan"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
                        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                                    Available packages
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Upgrade your visibility and promote your ads more effectively.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
                                <DiamondIcon fontSize="small" />
                                Tadao Market plans
                            </div>
                        </div>

                        <Listpackages
                            packagesList={packagesList}
                            userId={String(user._id)}
                            daysRemaining={daysRemaining}
                            packname={packname}
                            user={user}
                        />
                    </section>
                </div>
            </main>
        </>
    );
}