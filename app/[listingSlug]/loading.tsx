"use client";

import * as React from "react";
import TopBar from "@/components/home/TopBar.client";

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

export default function Loading() {
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
                            rgba(255,255,255,0.7),
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

            <div className="min-h-screen bg-slate-50">
                <TopBar />

                <div className="pt-[calc(var(--topbar-h,64px)+12px)]">
                    <main className="mx-auto max-w-[1440px] px-3 pb-8 sm:px-4 lg:px-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[270px_minmax(0,1fr)]">

                            {/* LEFT REAL-LAYOUT PLACEHOLDER */}
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
                                {/* TOP SECTION - visually same structure */}
                                <div className="rounded-[30px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                                    <SkeletonLine className="h-9 w-[65%] md:w-[48%]" />

                                    <div className="mt-3 flex gap-2">
                                        <SkeletonLine className="h-4 w-20" />
                                        <SkeletonLine className="h-4 w-16" />
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_140px]">
                                        <SkeletonLine className="h-14 w-full rounded-2xl" />
                                        <SkeletonLine className="h-14 w-full rounded-2xl" />

                                        <div className="h-14 rounded-2xl bg-emerald-300">
                                            <div className="skeleton-shimmer h-full w-full" />
                                        </div>
                                    </div>

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

                                    <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-7">
                                        {Array.from({
                                            length: 7,
                                        }).map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white"
                                            >
                                                <div className="h-10 w-10 rounded-full bg-orange-100">
                                                    <div className="skeleton-shimmer h-full w-full" />
                                                </div>

                                                <SkeletonLine className="h-3 w-12" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SORT TOOLBAR */}
                                <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                    <SkeletonLine className="h-4 w-36" />

                                    <div className="flex items-center gap-3">
                                        <SkeletonLine className="h-4 w-14" />
                                        <SkeletonLine className="h-12 w-36 rounded-2xl" />
                                    </div>
                                </div>

                                {/* ONLY LISTINGS ARE LOADING */}

                                {/* Mobile = LIST skeleton */}
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

                                {/* Desktop = GRID skeleton */}
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
        </>
    );
}