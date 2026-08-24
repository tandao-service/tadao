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

function ListingImageSkeleton({
    index,
}: {
    index: number;
}) {
    const backgrounds = [
        "from-orange-100 via-amber-50 to-slate-100",
        "from-blue-100 via-slate-50 to-cyan-50",
        "from-emerald-100 via-green-50 to-slate-100",
        "from-purple-100 via-fuchsia-50 to-slate-100",
        "from-rose-100 via-orange-50 to-slate-100",
        "from-yellow-100 via-amber-50 to-slate-100",
    ];

    const bg =
        backgrounds[
        index %
        backgrounds.length
        ];

    return (
        <div
            className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${bg}`}
        >
            <div className="absolute inset-0 opacity-40">
                <div className="absolute -left-10 top-5 h-32 w-32 rounded-full bg-white/60 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white/50 blur-3xl" />
            </div>

            <div className="absolute inset-x-[12%] bottom-[10%] top-[14%] rounded-2xl bg-white/35 shadow-inner backdrop-blur-[2px]" />

            <div className="absolute left-3 top-3 h-7 w-20 overflow-hidden rounded-full bg-white/85 shadow-sm">
                <div className="skeleton-shimmer h-full w-full" />
            </div>

            <div className="absolute right-3 top-3 h-9 w-9 overflow-hidden rounded-full bg-white/90 shadow-sm">
                <div className="skeleton-shimmer h-full w-full" />
            </div>

            <div className="absolute bottom-3 right-3 h-6 w-12 overflow-hidden rounded-full bg-slate-900/25">
                <div className="skeleton-shimmer h-full w-full opacity-50" />
            </div>

            <div className="skeleton-image-glow absolute inset-0" />
        </div>
    );
}

/* =========================================================
   DESKTOP GRID CARD
========================================================= */

function GridListingCardSkeleton({
    index,
}: {
    index: number;
}) {
    return (
        <div
            className="listing-loading-card overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
            style={{
                animationDelay:
                    `${Math.min(
                        index,
                        12
                    ) * 45}ms`,
            }}
        >
            <ListingImageSkeleton
                index={index}
            />

            <div className="p-3">
                <SkeletonLine className="h-4 w-[92%]" />

                <SkeletonLine className="mt-2 h-4 w-[70%]" />

                <div className="mt-3 flex items-center gap-2">
                    <div className="h-5 w-5 overflow-hidden rounded-full bg-orange-100">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>

                    <SkeletonLine className="h-3 w-[52%]" />
                </div>

                <div className="mt-3">
                    <div className="h-6 w-[55%] overflow-hidden rounded-lg bg-orange-100">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 overflow-hidden rounded-full bg-emerald-100">
                            <div className="skeleton-shimmer h-full w-full" />
                        </div>

                        <SkeletonLine className="h-3 w-16" />
                    </div>

                    <SkeletonLine className="h-3 w-10" />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   MOBILE LIST CARD
========================================================= */

function ListListingCardSkeleton({
    index,
}: {
    index: number;
}) {
    const backgrounds = [
        "from-orange-100 via-amber-50 to-slate-100",
        "from-blue-100 via-slate-50 to-cyan-50",
        "from-emerald-100 via-green-50 to-slate-100",
        "from-purple-100 via-fuchsia-50 to-slate-100",
    ];

    const bg =
        backgrounds[
        index %
        backgrounds.length
        ];

    return (
        <div
            className="listing-loading-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            style={{
                animationDelay:
                    `${Math.min(
                        index,
                        10
                    ) * 40}ms`,
            }}
        >
            <div className="flex min-h-[160px] w-full">
                {/* Image side */}
                <div
                    className={`relative w-[135px] shrink-0 overflow-hidden bg-gradient-to-br ${bg}`}
                >
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute -left-8 top-4 h-24 w-24 rounded-full bg-white/60 blur-2xl" />
                        <div className="absolute bottom-2 right-0 h-24 w-24 rounded-full bg-white/50 blur-2xl" />
                    </div>

                    <div className="absolute inset-x-[14%] inset-y-[12%] rounded-xl bg-white/35" />

                    <div className="absolute left-2 top-2 h-6 w-16 overflow-hidden rounded-full bg-white/80">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>

                    <div className="absolute bottom-2 left-2 h-5 w-10 overflow-hidden rounded-md bg-black/25">
                        <div className="skeleton-shimmer h-full w-full opacity-50" />
                    </div>

                    <div className="skeleton-image-glow absolute inset-0" />
                </div>

                {/* Content side */}
                <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                    <div>
                        <SkeletonLine className="h-4 w-[90%]" />

                        <SkeletonLine className="mt-2 h-4 w-[68%]" />

                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-4 w-4 overflow-hidden rounded-full bg-orange-100">
                                <div className="skeleton-shimmer h-full w-full" />
                            </div>

                            <SkeletonLine className="h-3 w-[55%]" />
                        </div>

                        <SkeletonLine className="mt-3 h-3 w-[92%]" />

                        <SkeletonLine className="mt-2 h-3 w-[70%]" />

                        <div className="mt-3 flex gap-1.5">
                            <SkeletonLine className="h-6 w-14 rounded-md" />
                            <SkeletonLine className="h-6 w-16 rounded-md" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="h-6 w-[52%] overflow-hidden rounded-lg bg-orange-100">
                            <div className="skeleton-shimmer h-full w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   SIDEBAR
========================================================= */

function SidebarSkeleton() {
    return (
        <aside className="hidden md:block">
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <div className="border-b border-orange-100 p-4">
                    <div className="flex items-center justify-between">
                        <SkeletonLine className="h-4 w-24" />

                        <div className="h-6 w-16 overflow-hidden rounded-full bg-orange-50">
                            <div className="skeleton-shimmer h-full w-full" />
                        </div>
                    </div>

                    <div className="mt-4 h-12 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>
                </div>

                <div className="border-b border-orange-100 p-4">
                    <SkeletonLine className="h-4 w-32" />

                    <div className="mt-4 space-y-3">
                        {Array.from({
                            length: 8,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    className="flex items-center justify-between gap-3"
                                >
                                    <SkeletonLine
                                        className={
                                            index %
                                                3 ===
                                                0
                                                ? "h-3 w-[72%]"
                                                : index %
                                                    3 ===
                                                    1
                                                    ? "h-3 w-[60%]"
                                                    : "h-3 w-[67%]"
                                        }
                                    />

                                    <SkeletonLine className="h-3 w-8" />
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="p-4">
                    <SkeletonLine className="h-4 w-20" />

                    <div className="mt-4 space-y-3">
                        {Array.from({
                            length: 3,
                        }).map(
                            (
                                _,
                                index
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    className="h-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                                >
                                    <div className="skeleton-shimmer h-full w-full" />
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="h-11 overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="skeleton-shimmer h-full w-full" />
                        </div>

                        <div className="h-11 overflow-hidden rounded-xl bg-emerald-200">
                            <div className="skeleton-shimmer h-full w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

/* =========================================================
   HEADER
========================================================= */

function ListingHeaderSkeleton() {
    return (
        <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="bg-gradient-to-r from-white via-orange-50/70 to-white px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-center gap-3">
                    <SkeletonLine className="h-8 w-[220px] sm:w-[340px]" />

                    <div className="h-8 w-20 overflow-hidden rounded-xl bg-orange-100">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <SkeletonLine className="h-3 w-24" />

                    <div className="h-1 w-1 rounded-full bg-slate-300" />

                    <SkeletonLine className="h-3 w-20" />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_140px]">
                    <div className="h-14 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>

                    <div className="h-14 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="skeleton-shimmer h-full w-full" />
                    </div>

                    <div className="h-14 overflow-hidden rounded-2xl bg-emerald-300 shadow-sm">
                        <div className="skeleton-shimmer h-full w-full opacity-60" />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {[
                        88,
                        110,
                        125,
                        105,
                        115,
                    ].map(
                        (
                            width,
                            index
                        ) => (
                            <div
                                key={
                                    index
                                }
                                className="h-9 overflow-hidden rounded-xl border border-orange-100 bg-orange-50"
                                style={{
                                    width,
                                }}
                            >
                                <div className="skeleton-shimmer h-full w-full" />
                            </div>
                        )
                    )}
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-7">
                    {Array.from({
                        length: 7,
                    }).map(
                        (
                            _,
                            index
                        ) => (
                            <div
                                key={
                                    index
                                }
                                className="flex h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white"
                            >
                                <div
                                    className={`h-10 w-10 overflow-hidden rounded-full ${index %
                                        3 ===
                                        0
                                        ? "bg-orange-100"
                                        : index %
                                            3 ===
                                            1
                                            ? "bg-blue-100"
                                            : "bg-emerald-100"
                                        }`}
                                >
                                    <div className="skeleton-shimmer h-full w-full" />
                                </div>

                                <SkeletonLine className="h-3 w-12" />
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   TOOLBAR
========================================================= */

function ResultToolbarSkeleton({
    isMobile,
}: {
    isMobile: boolean;
}) {
    return (
        <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <SkeletonLine className="h-4 w-20" />
                <SkeletonLine className="h-4 w-8" />
                <SkeletonLine className="h-4 w-12" />
            </div>

            <div className="flex items-center gap-3">
                {isMobile && (
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-14 rounded-xl border border-slate-200 bg-slate-50 opacity-70" />
                        <div className="h-10 w-14 rounded-xl border border-orange-200 bg-orange-50" />
                    </div>
                )}

                <SkeletonLine className="h-4 w-14" />

                <div className="h-12 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="skeleton-shimmer h-full w-full" />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   PAGE
========================================================= */

export default function Loading() {
    const [
        isMobile,
        setIsMobile,
    ] = React.useState(false);

    React.useEffect(() => {
        const media =
            window.matchMedia(
                "(max-width: 767px)"
            );

        const apply = () => {
            setIsMobile(
                media.matches
            );
        };

        apply();

        media.addEventListener(
            "change",
            apply
        );

        return () => {
            media.removeEventListener(
                "change",
                apply
            );
        };
    }, []);

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
                            rgba(255,255,255,0.65),
                            transparent
                        );
                    animation:
                        skeleton-shimmer
                        1.45s
                        ease-in-out
                        infinite;
                }

                @keyframes skeleton-image-glow {
                    0% {
                        opacity: 0.1;
                        transform: translateX(-80%);
                    }

                    50% {
                        opacity: 0.45;
                    }

                    100% {
                        opacity: 0.1;
                        transform: translateX(80%);
                    }
                }

                .skeleton-image-glow {
                    background:
                        linear-gradient(
                            110deg,
                            transparent 20%,
                            rgba(255,255,255,0.55) 48%,
                            transparent 75%
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
                        transform:
                            translateY(12px)
                            scale(0.985);
                    }

                    to {
                        opacity: 1;
                        transform:
                            translateY(0)
                            scale(1);
                    }
                }

                .listing-loading-card {
                    opacity: 0;

                    animation:
                        listing-loading-enter
                        300ms
                        ease-out
                        forwards;
                }

                @media (
                    prefers-reduced-motion:
                    reduce
                ) {
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
                            <SidebarSkeleton />

                            <section className="min-w-0">
                                <ListingHeaderSkeleton />

                                <ResultToolbarSkeleton
                                    isMobile={
                                        isMobile
                                    }
                                />

                                {isMobile ? (
                                    <div className="mt-4 flex flex-col gap-3">
                                        {Array.from({
                                            length: 10,
                                        }).map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <ListListingCardSkeleton
                                                    key={
                                                        index
                                                    }
                                                    index={
                                                        index
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
                                        {Array.from({
                                            length: 16,
                                        }).map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <GridListingCardSkeleton
                                                    key={
                                                        index
                                                    }
                                                    index={
                                                        index
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}