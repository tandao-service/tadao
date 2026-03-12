// app/packages/PackagesPageClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
            <main className="min-h-screen bg-gray-50 dark:bg-[#131B1E] pt-6 pb-28">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-5">
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Choose Your Package
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Loading packages...
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[360px] animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1f272b]"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!user || !appUserId) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#131B1E] pt-6 pb-28">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-5">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        Choose Your Package
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Select the package that fits your posting needs and continue to payment.
                    </p>
                </div>

                <Listpackages
                    packagesList={packagesList}
                    userId={String(user._id)}
                    daysRemaining={daysRemaining}
                    packname={packname}
                    user={user}

                />
            </div>
        </main>
    );
}