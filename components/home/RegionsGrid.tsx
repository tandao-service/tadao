"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import type { HomeRegion } from "@/lib/home/home.data";
import { cn } from "@/lib/utils";

function useRegionNavigation() {
    const [pendingHref, setPendingHref] = React.useState<string | null>(null);

    const startNavigation = React.useCallback((href: string) => {
        setPendingHref(href);
    }, []);

    React.useEffect(() => {
        const clearPending = () => {
            setPendingHref(null);
        };

        window.addEventListener("pageshow", clearPending);

        return () => {
            window.removeEventListener("pageshow", clearPending);
        };
    }, []);

    return {
        pendingHref,
        startNavigation,
    };
}

export default function RegionsGrid({
    regions,
    listingSlug,
}: {
    regions: HomeRegion[];
    listingSlug: string;
}) {
    const slug = String(listingSlug || "")
        .trim()
        .toLowerCase();

    const { pendingHref, startNavigation } = useRegionNavigation();

    const allRegionsHref = slug ? `/${slug}` : "/";

    return (
        <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold">
                    Browse by Region
                </h2>

                <Link
                    href={allRegionsHref}
                    prefetch
                    aria-busy={pendingHref === allRegionsHref}
                    onClick={() => startNavigation(allRegionsHref)}
                    className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-orange-600 transition hover:underline",
                        pendingHref === allRegionsHref &&
                        "pointer-events-none opacity-80"
                    )}
                >
                    {pendingHref === allRegionsHref ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Opening...
                        </>
                    ) : (
                        "All regions"
                    )}
                </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {regions.map((r) => {
                    const href = slug
                        ? `/r/${r.slug}/${slug}`
                        : `/r/${r.slug}`;

                    const isLoading = pendingHref === href;

                    return (
                        <Link
                            key={r.slug}
                            href={href}
                            prefetch
                            aria-busy={isLoading}
                            onClick={() => startNavigation(href)}
                            className={cn(
                                "group relative rounded-xl border bg-slate-50 px-3 py-3 transition",
                                "hover:border-orange-300 hover:bg-orange-50 hover:shadow-sm",
                                "active:scale-[0.98]",
                                isLoading &&
                                "pointer-events-none border-orange-400 bg-orange-50 ring-2 ring-orange-200"
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <div
                                        className={cn(
                                            "truncate text-sm font-extrabold text-slate-900",
                                            isLoading && "text-orange-700"
                                        )}
                                    >
                                        {isLoading ? "Opening..." : r.name}
                                    </div>

                                    <div className="mt-0.5 text-xs text-slate-500">
                                        {isLoading
                                            ? "Loading ads..."
                                            : `${Number(
                                                r.count || 0
                                            ).toLocaleString()} ads`}
                                    </div>
                                </div>

                                {isLoading && (
                                    <Loader2 className="h-5 w-5 shrink-0 animate-spin text-orange-600" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}