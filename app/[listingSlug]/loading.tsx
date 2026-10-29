"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/home/TopBar.client";

/**
 * Tadao Market loading state, aligned with the compact listing / ad detail UI.
 *
 * TopBar already renders the correct spacer for its fixed status bar.
 * Do NOT add a second `padding-top: var(--topbar-h)` here: it creates the
 * oversized blank gap that was recently removed from the actual pages.
 */
const SURFACE =
    "border border-slate-200/90 bg-white shadow-[0_3px_14px_rgba(15,23,42,0.06)]";

function Bone({
    className = "",
    tone = "slate",
}: {
    className?: string;
    tone?: "slate" | "orange" | "white";
}) {
    const bg =
        tone === "orange"
            ? "bg-orange-200/70"
            : tone === "white"
                ? "bg-white/30"
                : "bg-slate-200/85";
    return (
        <div
            aria-hidden="true"
            className={`tadao-skeleton-shimmer relative shrink-0 overflow-hidden rounded-md ${bg} ${className}`}
        />
    );
}

function SkeletonTheme() {
    return (
        <style>{`
            @keyframes tadao-skeleton-sweep {
                from { transform: translateX(-110%); }
                to { transform: translateX(110%); }
            }
            .tadao-skeleton-shimmer::after {
                content: "";
                position: absolute;
                inset: 0;
                transform: translateX(-110%);
                background: linear-gradient(90deg, transparent, rgba(255,255,255,.56), transparent);
                animation: tadao-skeleton-sweep 1.5s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
                .tadao-skeleton-shimmer::after { animation: none; }
            }
        `}</style>
    );
}

function ListingGridCardSkeleton() {
    return (
        <div className={`flex h-full flex-col overflow-hidden rounded-xl ${SURFACE}`}>
            {/* Matches VerticalListingCard 160px mobile / 180px desktop image. */}
            <div className="relative h-[160px] overflow-hidden bg-slate-200 sm:h-[180px]">
                <div className="tadao-skeleton-shimmer absolute inset-0" />
                <div className="absolute bottom-2 left-2 rounded bg-slate-900/45 px-2 py-1">
                    <Bone className="h-2.5 w-5" tone="white" />
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
                <Bone className="h-3.5 w-[84%]" />
                <Bone className="h-3 w-[56%]" />
                <Bone className="mt-0.5 h-2.5 w-[94%]" />
                <Bone className="h-2.5 w-[72%]" />
                <Bone className="mt-auto h-4 w-[52%] bg-orange-100" tone="orange" />
            </div>
        </div>
    );
}

function ListingListCardSkeleton() {
    return (
        <div className={`overflow-hidden rounded-xl ${SURFACE}`}>
            <div className="flex min-h-[148px]">
                <div className="relative w-[130px] shrink-0 bg-slate-200 sm:w-[160px]">
                    <div className="tadao-skeleton-shimmer absolute inset-0" />
                    <div className="absolute bottom-2 left-2 rounded bg-slate-900/40 p-1.5">
                        <Bone className="h-2 w-5" tone="white" />
                    </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
                    <Bone className="h-3.5 w-[88%]" />
                    <Bone className="h-2.5 w-[58%]" />
                    <Bone className="mt-1 h-2.5 w-full" />
                    <Bone className="h-2.5 w-[70%]" />
                    <Bone className="mt-auto h-4 w-[50%]" tone="orange" />
                </div>
            </div>
        </div>
    );
}

function FilterSkeleton() {
    return (
        <aside className="hidden min-w-0 md:block">
            <div className={`overflow-hidden rounded-xl ${SURFACE}`}>
                <div className="border-b border-slate-100 px-3 py-3">
                    <Bone className="h-3.5 w-14" />
                </div>
                <div className="space-y-3 px-3 py-3">
                    {/* Category / Location / Price / Seller */}
                    <div>
                        <Bone className="mb-1.5 h-3 w-20" />
                        <Bone className="h-10 w-full rounded-lg bg-slate-100" />
                    </div>
                    <div>
                        <Bone className="mb-1.5 h-3 w-16" />
                        <Bone className="h-10 w-full rounded-lg bg-slate-100" />
                    </div>
                    <div>
                        <Bone className="mb-1.5 h-3 w-16" />
                        <div className="grid grid-cols-2 gap-2">
                            <Bone className="h-10 w-full rounded-lg bg-slate-100" />
                            <Bone className="h-10 w-full rounded-lg bg-slate-100" />
                        </div>
                    </div>
                    <div>
                        <Bone className="mb-1.5 h-3 w-12" />
                        <Bone className="h-10 w-full rounded-lg bg-slate-100" />
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                        <Bone className="mb-2 h-3 w-24" />
                        <Bone className="h-9 w-full rounded-lg bg-slate-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Bone className="h-10 w-full rounded-lg bg-slate-100" />
                        <div className="tadao-skeleton-shimmer relative h-10 overflow-hidden rounded-lg bg-emerald-700/65" />
                    </div>
                </div>
            </div>
        </aside>
    );
}

function ListingLoadingView() {
    return (
        <div className="min-h-screen bg-[#EBEEF2]">
            <TopBar />
            {/* The live listing page uses pt-1, not a second topbar offset. */}
            <main className="mx-auto w-full max-w-[1600px] px-2.5 pb-6 pt-1 sm:px-3 lg:px-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[235px_minmax(0,1fr)] lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-4">
                    <FilterSkeleton />
                    <section className="min-w-0">
                        {/* Live listing header: title, sublabel, search, grid/list + sort. */}
                        <div className={`overflow-hidden rounded-xl ${SURFACE}`}>
                            <div className="px-3 py-3 sm:px-4 sm:py-4">
                                <Bone className="h-[18px] w-[81%] max-w-[390px] sm:h-[20px] lg:h-[22px]" />
                                <div className="mt-1.5 flex items-center gap-2">
                                    <Bone className="h-3 w-20" />
                                    <Bone className="h-3 w-12" />
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <Bone className="h-11 min-w-0 flex-1 rounded-lg bg-slate-100" />
                                    <div className="tadao-skeleton-shimmer relative h-11 w-[74px] shrink-0 overflow-hidden rounded-lg bg-emerald-700/70" />
                                </div>
                                <div className="mt-3 flex items-center gap-1.5">
                                    <Bone className="h-9 w-12 rounded-lg bg-orange-100" tone="orange" />
                                    <Bone className="h-9 w-12 rounded-lg bg-slate-100" />
                                    <div className="ml-auto hidden items-center gap-2 sm:flex">
                                        <Bone className="h-3 w-12" />
                                    </div>
                                    <Bone className="ml-auto h-9 w-28 rounded-lg bg-slate-100 sm:ml-0 sm:w-36" />
                                </div>
                            </div>
                        </div>

                        {/* Actual page uses a two-column grid at md, four at lg. */}
                        <div className="mt-2.5 flex flex-col gap-2.5 md:hidden">
                            {Array.from({ length: 6 }, (_, i) => <ListingListCardSkeleton key={i} />)}
                        </div>
                        <div className="mt-2.5 hidden grid-cols-2 gap-2.5 md:grid lg:grid-cols-4 2xl:grid-cols-5">
                            {Array.from({ length: 16 }, (_, i) => <ListingGridCardSkeleton key={i} />)}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function ProductGallerySkeleton() {
    return (
        <div className="overflow-hidden bg-white">
            {/* Matches PropertyGallery: aspect on mobile; 350px md / 370px lg. */}
            <div className="relative aspect-[4/3] overflow-hidden bg-black sm:aspect-[16/10] md:h-[350px] md:aspect-auto lg:h-[370px]">
                <div className="absolute inset-y-0 left-[26%] w-[48%] overflow-hidden bg-slate-300/85">
                    <div className="tadao-skeleton-shimmer absolute inset-0" />
                    <div className="absolute inset-x-[18%] top-[15%] h-[54%] rounded-xl bg-slate-200/70" />
                </div>
                <div className="absolute left-3 top-3 rounded-lg bg-black/50 px-2.5 py-1.5">
                    <Bone className="h-3 w-32" tone="white" />
                </div>
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-2.5 py-1.5">
                    <Bone className="h-3 w-9" tone="white" />
                </div>
                <div className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/85" />
                <div className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/85" />
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {Array.from({ length: 7 }, (_, i) => (
                        <div key={i} className={`rounded-full bg-white/60 ${i === 0 ? "h-1.5 w-5 bg-white" : "h-1.5 w-1.5"}`} />
                    ))}
                </div>
            </div>
            <div className="flex gap-1.5 overflow-hidden border-t border-slate-200 bg-slate-50 p-2">
                {Array.from({ length: 6 }, (_, i) => (
                    <Bone key={i} className="h-14 w-20 rounded-lg sm:h-16 sm:w-24" />
                ))}
            </div>
        </div>
    );
}

function ProductInfoSkeleton() {
    return (
        <div className="p-3 sm:p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <Bone className="h-5 w-[88%] max-w-[420px] sm:h-6" />
                    <Bone className="mt-1.5 h-5 w-[63%] max-w-[300px] sm:h-6" />
                    <div className="mt-2 flex gap-2">
                        <Bone className="h-3 w-20" />
                        <Bone className="h-3 w-12" />
                    </div>
                </div>
                <div className="rounded-xl bg-orange-50 px-3 py-2 lg:hidden">
                    <Bone className="h-3 w-10" tone="orange" />
                    <Bone className="mt-1.5 h-4 w-24" tone="orange" />
                </div>
            </div>
            <div className="mt-4">
                <Bone className="h-4 w-20" />
                <div className="mt-2 flex flex-wrap gap-1.5">
                    <Bone className="h-7 w-28 rounded-md bg-slate-100" />
                    <Bone className="h-7 w-40 rounded-md bg-slate-100" />
                    <Bone className="h-7 w-28 rounded-md bg-slate-100" />
                    <Bone className="h-7 w-24 rounded-md bg-slate-100" />
                </div>
            </div>
            <div className="mt-4">
                <Bone className="h-4 w-24" />
                <Bone className="mt-2 h-3 w-[98%]" />
                <Bone className="mt-1.5 h-3 w-[90%]" />
                <Bone className="mt-1.5 h-3 w-[78%]" />
            </div>
        </div>
    );
}

function ProductSellerSkeleton() {
    return (
        <div className={`rounded-xl p-3.5 ${SURFACE}`}>
            <div className="flex items-center gap-2.5">
                <Bone className="h-11 w-11 rounded-full bg-orange-100" tone="orange" />
                <div className="min-w-0 flex-1">
                    <Bone className="h-4 w-[67%] max-w-[180px]" />
                    <Bone className="mt-1.5 h-2.5 w-[40%] max-w-[100px]" />
                </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex min-h-[42px] items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1">
                        <Bone className="h-8 w-8 rounded-full bg-emerald-50" />
                        <div className="min-w-0 flex-1">
                            <Bone className="h-2.5 w-[20%] min-w-[42px]" />
                            <Bone className="mt-1.5 h-3 w-[64%]" />
                        </div>
                    </div>
                ))}
                <div className="flex min-h-[42px] items-center gap-2.5 rounded-lg bg-orange-500 px-3 py-1">
                    <Bone className="h-8 w-8 rounded-full" tone="white" />
                    <div className="flex-1">
                        <Bone className="h-2.5 w-12" tone="white" />
                        <Bone className="mt-1.5 h-3 w-20" tone="white" />
                    </div>
                </div>
                <div className="flex min-h-[42px] items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1">
                    <Bone className="h-8 w-8 rounded-full bg-orange-50" tone="orange" />
                    <Bone className="h-3 w-[45%]" />
                </div>
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3">
                <Bone className="h-10 w-full rounded-lg bg-emerald-100" />
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <Bone className="h-9 w-full rounded-lg bg-red-100" />
                    <Bone className="h-9 w-full rounded-lg bg-blue-100" />
                </div>
            </div>
        </div>
    );
}

function ProductLoadingView() {
    return (
        <div className="min-h-screen bg-[#EBEEF2]">
            <TopBar />
            {/* Same 8px gap as AdDetailsView. TopBar includes its own spacer. */}
            <main className="mx-auto w-full max-w-[1280px] px-3 pb-6 pt-2 sm:px-4 lg:px-5">
                <div className={`mb-3 hidden items-center gap-2 rounded-xl px-3 py-2 lg:flex ${SURFACE}`}>
                    <Bone className="h-3 w-12" />
                    <span className="text-slate-300">/</span>
                    <Bone className="h-3 w-36" />
                    <span className="text-slate-300">/</span>
                    <Bone className="h-3 w-16" />
                    <span className="text-slate-300">/</span>
                    <Bone className="h-3 w-16" />
                    <Bone className="ml-auto h-3 w-14" />
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                    <div className="min-w-0 lg:col-span-8">
                        {/* Gallery and details are inside one shared white card. */}
                        <div className={`overflow-hidden rounded-xl ${SURFACE}`}>
                            <ProductGallerySkeleton />
                            <ProductInfoSkeleton />
                        </div>
                    </div>
                    <aside className="min-w-0 lg:col-span-4">
                        <div className="space-y-2.5">
                            <div className={`hidden rounded-xl p-3.5 lg:block ${SURFACE}`}>
                                <Bone className="h-3 w-14" />
                                <Bone className="mt-2 h-6 w-36" />
                            </div>
                            <ProductSellerSkeleton />
                        </div>
                    </aside>
                </div>
                {/* Lightweight related-products preview, as on the live details page. */}
                <section className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                        <Bone className="h-4 w-36" />
                        <Bone className="h-3 w-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 4 }, (_, i) => <ListingGridCardSkeleton key={i} />)}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function Loading() {
    const pathname = usePathname();
    const isProductRoute = React.useMemo(
        () => String(pathname || "").split("?")[0].split("/").filter(Boolean).length >= 2,
        [pathname]
    );

    return (
        <div role="status" aria-label="Loading Tadao Market listings" aria-busy="true">
            <SkeletonTheme />
            {isProductRoute ? <ProductLoadingView /> : <ListingLoadingView />}
            <span className="sr-only">Loading, please wait.</span>
        </div>
    );
}
