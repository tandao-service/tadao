"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/home/TopBar.client";

/* =========================================================
   COMMON
========================================================= */

function SkeletonLine({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`overflow-hidden rounded-md bg-slate-200/80 ${className}`}
        >
            <div className="skeleton-shimmer h-full w-full" />
        </div>
    );
}

/* =========================================================
   LISTING GRID CARD
========================================================= */

function GridCardSkeleton({
    index,
}: {
    index: number;
}) {
    return (
        <div
            className="listing-loading-card overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            style={{
                animationDelay: `${Math.min(index, 10) * 30}ms`,
            }}
        >
            <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-orange-100 via-slate-100 to-emerald-100">
                <div className="skeleton-image-glow absolute inset-0" />

                <div className="absolute bottom-2 left-2 h-6 w-10 rounded-md bg-black/20">
                    <div className="skeleton-shimmer h-full w-full" />
                </div>
            </div>

            <div className="p-3">
                <SkeletonLine className="h-4 w-[90%]" />

                <SkeletonLine className="mt-2 h-4 w-[68%]" />

                <div className="mt-3 flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-orange-100" />

                    <SkeletonLine className="h-3 w-[55%]" />
                </div>

                <SkeletonLine className="mt-3 h-3 w-[85%]" />

                <SkeletonLine className="mt-2 h-3 w-[65%]" />

                <div className="mt-4 h-6 w-[55%] rounded-lg bg-orange-100">
                    <div className="skeleton-shimmer h-full w-full" />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   LISTING MOBILE LIST CARD
========================================================= */

function ListCardSkeleton({
    index,
}: {
    index: number;
}) {
    return (
        <div
            className="listing-loading-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            style={{
                animationDelay: `${Math.min(index, 10) * 30}ms`,
            }}
        >
            <div className="flex min-h-[165px]">
                <div className="relative w-[140px] shrink-0 overflow-hidden bg-gradient-to-br from-orange-100 via-slate-100 to-emerald-100">
                    <div className="skeleton-image-glow absolute inset-0" />

                    <div className="absolute bottom-2 left-2 h-6 w-10 rounded bg-black/20">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                    <div>
                        <SkeletonLine className="h-4 w-[92%]" />

                        <SkeletonLine className="mt-2 h-4 w-[70%]" />

                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-orange-100" />

                            <SkeletonLine className="h-3 w-[55%]" />
                        </div>

                        <SkeletonLine className="mt-3 h-3 w-[90%]" />

                        <SkeletonLine className="mt-2 h-3 w-[72%]" />
                    </div>

                    <div className="mt-3 h-6 w-[50%] rounded-lg bg-orange-100">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

function ProductImageSkeleton() {
    return (
        <div className="relative overflow-hidden bg-black lg:rounded-[38px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[1.65/1]">
                {/* Fake central product image */}
                <div className="absolute inset-x-[18%] inset-y-0 overflow-hidden bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300">
                    <div className="absolute inset-0 opacity-60">
                        <div className="absolute left-[12%] top-[10%] h-[40%] w-[76%] rounded-[24px] bg-slate-300/80" />

                        <div className="absolute bottom-[15%] left-[16%] h-[32%] w-[68%] rounded-[28px] bg-white/55" />
                    </div>

                    <div className="skeleton-image-glow absolute inset-0" />
                </div>

                {/* Category badge */}
                <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2">
                    <SkeletonLine className="h-4 w-32 bg-white/30" />
                </div>

                {/* Photo counter */}
                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2">
                    <div className="h-4 w-4 rounded-full bg-white/80" />

                    <SkeletonLine className="h-4 w-10 bg-white/30" />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   PRODUCT DESKTOP BREADCRUMB
========================================================= */

function ProductBreadcrumbSkeleton() {
    return (
        <div className="hidden items-center justify-between rounded-[22px] border border-orange-100 bg-white px-5 py-4 shadow-sm lg:flex">
            <div className="flex items-center gap-3">
                <SkeletonLine className="h-5 w-14" />

                <span className="text-slate-300">
                    /
                </span>

                <SkeletonLine className="h-5 w-40" />

                <span className="text-slate-300">
                    /
                </span>

                <SkeletonLine className="h-5 w-16" />

                <span className="text-slate-300">
                    /
                </span>

                <SkeletonLine className="h-5 w-16" />
            </div>

            <SkeletonLine className="h-5 w-20" />
        </div>
    );
}

/* =========================================================
   PRODUCT DESKTOP SIDEBAR
========================================================= */

function ProductDesktopSidebarSkeleton() {
    return (
        <aside className="hidden lg:block">
            <div className="space-y-4">
                {/* Price */}
                <div className="rounded-[34px] border border-orange-100 bg-white p-7 shadow-sm">
                    <SkeletonLine className="h-5 w-16" />

                    <SkeletonLine className="mt-4 h-10 w-44 bg-slate-800/15" />
                </div>

                {/* Seller */}
                <div className="rounded-[34px] border border-orange-100 bg-white p-7 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-orange-50">
                            <div className="skeleton-shimmer absolute inset-0" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <SkeletonLine className="h-5 w-40" />

                            <SkeletonLine className="mt-2 h-4 w-32" />
                        </div>
                    </div>

                    <div className="mt-7 space-y-4">
                        {Array.from({
                            length: 3,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-2xl border border-slate-200 px-4 py-3"
                            >
                                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-emerald-50">
                                    <div className="skeleton-shimmer absolute inset-0" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <SkeletonLine className="h-4 w-20" />

                                    <SkeletonLine className="mt-2 h-5 w-44" />
                                </div>
                            </div>
                        ))}

                        {/* Share */}
                        <div className="flex items-center gap-4 rounded-[22px] bg-orange-500 px-4 py-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/20">
                                <div className="skeleton-shimmer absolute inset-0 opacity-50" />
                            </div>

                            <div className="flex-1">
                                <SkeletonLine className="h-4 w-16 bg-white/30" />

                                <SkeletonLine className="mt-2 h-5 w-24 bg-white/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

/* =========================================================
   PRODUCT MOBILE DETAILS
========================================================= */

function ProductMobileInfoSkeleton() {
    return (
        <div className="bg-white px-5 py-5 lg:hidden">
            <SkeletonLine className="h-8 w-[65%] bg-slate-800/15" />

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <SkeletonLine className="h-4 w-16" />

                <span className="text-slate-300">
                    •
                </span>

                <SkeletonLine className="h-4 w-14" />

                <span className="text-slate-300">
                    •
                </span>

                <SkeletonLine className="h-4 w-20" />
            </div>

            {/* Price */}
            <div className="mt-7 rounded-[24px] bg-orange-50 px-5 py-4">
                <SkeletonLine className="h-4 w-16 bg-orange-200/70" />

                <SkeletonLine className="mt-3 h-8 w-36 bg-orange-200/70" />
            </div>

            {/* Contact rows */}
            <div className="mt-5 space-y-3">
                {Array.from({
                    length: 3,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200 px-4 py-3"
                    >
                        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-emerald-50">
                            <div className="skeleton-shimmer absolute inset-0" />
                        </div>

                        <div className="flex-1">
                            <SkeletonLine className="h-4 w-20" />

                            <SkeletonLine className="mt-2 h-5 w-40" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================
   PRODUCT DESKTOP TITLE
========================================================= */

function ProductDesktopTitleSkeleton() {
    return (
        <div className="mt-5 hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm lg:block">
            <SkeletonLine className="h-9 w-[48%] bg-slate-800/15" />

            <div className="mt-4 flex items-center gap-2">
                <SkeletonLine className="h-4 w-20" />

                <span className="text-slate-300">
                    •
                </span>

                <SkeletonLine className="h-4 w-16" />

                <span className="text-slate-300">
                    •
                </span>

                <SkeletonLine className="h-4 w-24" />
            </div>
        </div>
    );
}

/* =========================================================
   PRODUCT LOADING PAGE
========================================================= */

function ProductLoadingView() {
    return (
        <div className="min-h-screen bg-white lg:bg-slate-50">
            <TopBar />

            <main className="pt-[var(--topbar-h,64px)] lg:pt-[calc(var(--topbar-h,64px)+12px)]">
                {/* Desktop */}
                <div className="hidden lg:block">
                    <div className="mx-auto max-w-[1620px] px-5 pb-10">
                        <ProductBreadcrumbSkeleton />

                        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_460px] gap-5">
                            <section className="min-w-0">
                                <ProductImageSkeleton />

                                <ProductDesktopTitleSkeleton />
                            </section>

                            <ProductDesktopSidebarSkeleton />
                        </div>
                    </div>
                </div>

                {/* Mobile */}
                <div className="lg:hidden">
                    <ProductImageSkeleton />

                    <ProductMobileInfoSkeleton />

                    <div className="h-6 bg-slate-50" />
                </div>
            </main>
        </div>
    );
}

/* =========================================================
   LISTING LOADING PAGE
========================================================= */

function ListingLoadingView() {
    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />

            <div className="pt-[calc(var(--topbar-h,64px)+12px)]">
                <main className="mx-auto max-w-[1440px] px-3 pb-8 sm:px-4 lg:px-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)]">
                        {/* Sidebar */}
                        <aside className="hidden md:block">
                            <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
                                <div className="text-sm font-bold text-slate-900">
                                    Category
                                </div>

                                <div className="mt-4 space-y-3">
                                    <SkeletonLine className="h-11 w-full rounded-xl" />

                                    <SkeletonLine className="h-4 w-[80%]" />

                                    <SkeletonLine className="h-4 w-[72%]" />

                                    <SkeletonLine className="h-4 w-[88%]" />

                                    <SkeletonLine className="h-4 w-[65%]" />
                                </div>
                            </div>
                        </aside>

                        <section className="min-w-0">
                            {/* Header */}
                            <div className="rounded-[30px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                                <SkeletonLine className="h-9 w-[65%] md:w-[48%]" />

                                <div className="mt-3 flex gap-2">
                                    <SkeletonLine className="h-4 w-20" />

                                    <SkeletonLine className="h-4 w-16" />
                                </div>

                                {/* Search */}
                                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_140px]">
                                    <SkeletonLine className="h-14 w-full rounded-2xl" />

                                    <SkeletonLine className="h-14 w-full rounded-2xl" />

                                    <div className="h-14 overflow-hidden rounded-2xl bg-emerald-300">
                                        <div className="skeleton-shimmer h-full w-full" />
                                    </div>
                                </div>

                                {/* Price chips */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {Array.from({
                                        length: 5,
                                    }).map((_, index) => (
                                        <SkeletonLine
                                            key={index}
                                            className="h-9 w-24 rounded-xl"
                                        />
                                    ))}
                                </div>

                                {/* Brands */}
                                <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-7">
                                    {Array.from({
                                        length: 7,
                                    }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white"
                                        >
                                            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-orange-100">
                                                <div className="skeleton-shimmer absolute inset-0" />
                                            </div>

                                            <SkeletonLine className="h-3 w-12" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                <SkeletonLine className="h-4 w-36" />

                                <div className="flex items-center gap-3">
                                    <SkeletonLine className="h-4 w-14" />

                                    <SkeletonLine className="h-12 w-36 rounded-2xl" />
                                </div>
                            </div>

                            {/* Mobile LIST */}
                            <div className="mt-4 flex flex-col gap-3 md:hidden">
                                {Array.from({
                                    length: 8,
                                }).map((_, index) => (
                                    <ListCardSkeleton
                                        key={index}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {/* Desktop GRID */}
                            <div className="mt-4 hidden grid-cols-2 gap-3 md:grid lg:grid-cols-4 2xl:grid-cols-5">
                                {Array.from({
                                    length: 16,
                                }).map((_, index) => (
                                    <GridCardSkeleton
                                        key={index}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

/* =========================================================
   MAIN
========================================================= */

export default function Loading() {
    const pathname = usePathname();

    const segments = React.useMemo(() => {
        return String(pathname || "")
            .split("?")[0]
            .split("/")
            .filter(Boolean);
    }, [pathname]);

    /*
     * Examples:
     *
     * /cars-vans-pickups
     * segments = ["cars-vans-pickups"]
     * => LISTING
     *
     * /cars-vans-pickups/toyota-hiace
     * segments = [
     *   "cars-vans-pickups",
     *   "toyota-hiace"
     * ]
     * => PRODUCT
     */
    const isProductRoute =
        segments.length >= 2;

    return (
        <>
            <style>{`
                @keyframes skeleton-shimmer {
                    0% {
                        transform: translateX(-120%);
                    }

                    100% {
                        transform: translateX(120%);
                    }
                }

                .skeleton-shimmer {
                    position: relative;
                    overflow: hidden;
                }

                .skeleton-shimmer::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-120%);

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,0.70),
                            transparent
                        );

                    animation:
                        skeleton-shimmer
                        1.4s
                        ease-in-out
                        infinite;
                }

                @keyframes skeleton-image-glow {
                    0% {
                        transform: translateX(-100%);
                        opacity: 0.15;
                    }

                    50% {
                        opacity: 0.45;
                    }

                    100% {
                        transform: translateX(100%);
                        opacity: 0.15;
                    }
                }

                .skeleton-image-glow {
                    background:
                        linear-gradient(
                            110deg,
                            transparent 20%,
                            rgba(255,255,255,0.55) 50%,
                            transparent 80%
                        );

                    animation:
                        skeleton-image-glow
                        1.8s
                        ease-in-out
                        infinite;
                }

                @keyframes listing-loading-enter {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .listing-loading-card {
                    opacity: 0;

                    animation:
                        listing-loading-enter
                        260ms
                        ease-out
                        forwards;
                }

                @media (prefers-reduced-motion: reduce) {
                    .listing-loading-card {
                        opacity: 1;
                        animation: none;
                    }

                    .skeleton-shimmer::after,
                    .skeleton-image-glow {
                        animation: none;
                    }
                }
            `}</style>

            {isProductRoute ? (
                <ProductLoadingView />
            ) : (
                <ListingLoadingView />
            )}
        </>
    );
}