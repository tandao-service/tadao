// app/[listingSlug]/[productSlug]/loading.tsx

import TopBar from "@/components/home/TopBar.client";

function Shimmer({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`relative overflow-hidden bg-slate-200/80 ${className}`}
        >
            <div className="product-shimmer absolute inset-0" />
        </div>
    );
}

function BreadcrumbSkeleton() {
    return (
        <div className="hidden lg:flex items-center justify-between rounded-[22px] border border-orange-100 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
                <Shimmer className="h-5 w-14 rounded-md" />
                <span className="text-slate-300">/</span>
                <Shimmer className="h-5 w-40 rounded-md" />
                <span className="text-slate-300">/</span>
                <Shimmer className="h-5 w-16 rounded-md" />
                <span className="text-slate-300">/</span>
                <Shimmer className="h-5 w-16 rounded-md" />
            </div>

            <Shimmer className="h-5 w-20 rounded-md" />
        </div>
    );
}

function ProductImageSkeleton() {
    return (
        <div className="relative overflow-hidden bg-black lg:rounded-[38px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[1.65/1]">
                {/* realistic central image placeholder */}
                <div className="absolute inset-x-[18%] inset-y-0 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300">
                    <div className="absolute inset-0 opacity-70">
                        <div className="absolute left-[12%] top-[10%] h-[40%] w-[76%] rounded-[24px] bg-slate-300/80" />
                        <div className="absolute bottom-[15%] left-[16%] h-[32%] w-[68%] rounded-[28px] bg-white/55" />
                    </div>

                    <div className="product-image-sheen absolute inset-0" />
                </div>

                {/* category chip */}
                <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2">
                    <Shimmer className="h-4 w-32 rounded-md bg-white/30" />
                </div>

                {/* photo counter */}
                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2">
                    <div className="h-4 w-4 rounded-full bg-white/80" />
                    <Shimmer className="h-4 w-10 rounded-md bg-white/30" />
                </div>
            </div>
        </div>
    );
}

function DesktopSidebarSkeleton() {
    return (
        <aside className="hidden lg:block">
            <div className="space-y-4">
                {/* price */}
                <div className="rounded-[34px] border border-orange-100 bg-white p-7 shadow-sm">
                    <Shimmer className="h-5 w-16 rounded-md" />
                    <Shimmer className="mt-4 h-10 w-44 rounded-lg bg-slate-800/15" />
                </div>

                {/* seller */}
                <div className="rounded-[34px] border border-orange-100 bg-white p-7 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full bg-orange-50">
                            <div className="product-shimmer absolute inset-0" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <Shimmer className="h-5 w-40 rounded-md" />
                            <Shimmer className="mt-2 h-4 w-32 rounded-md" />
                        </div>
                    </div>

                    <div className="mt-7 space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-2xl border border-slate-200 px-4 py-3"
                            >
                                <div
                                    className={`h-12 w-12 overflow-hidden rounded-full ${index === 0
                                        ? "bg-emerald-50"
                                        : index === 1
                                            ? "bg-blue-50"
                                            : "bg-emerald-50"
                                        }`}
                                >
                                    <div className="product-shimmer absolute inset-0" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <Shimmer className="h-4 w-20 rounded-md" />
                                    <Shimmer className="mt-2 h-5 w-44 rounded-md" />
                                </div>
                            </div>
                        ))}

                        {/* share */}
                        <div className="flex items-center gap-4 rounded-[22px] bg-orange-500 px-4 py-4">
                            <div className="h-12 w-12 overflow-hidden rounded-full bg-white/15">
                                <div className="product-shimmer absolute inset-0 opacity-40" />
                            </div>

                            <div className="flex-1">
                                <Shimmer className="h-4 w-16 rounded-md bg-white/25" />
                                <Shimmer className="mt-2 h-5 w-24 rounded-md bg-white/25" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function MobileProductInfoSkeleton() {
    return (
        <div className="lg:hidden">
            <div className="bg-white px-5 py-5">
                <Shimmer className="h-8 w-[62%] rounded-lg bg-slate-800/15" />

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Shimmer className="h-4 w-16 rounded-md" />
                    <span className="text-slate-300">•</span>
                    <Shimmer className="h-4 w-14 rounded-md" />
                    <span className="text-slate-300">•</span>
                    <Shimmer className="h-4 w-20 rounded-md" />
                </div>

                <div className="mt-7 rounded-[24px] bg-orange-50 px-5 py-4">
                    <Shimmer className="h-4 w-16 rounded-md bg-orange-200/70" />
                    <Shimmer className="mt-3 h-8 w-36 rounded-lg bg-orange-200/70" />
                </div>

                <div className="mt-5 space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 rounded-2xl border border-slate-200 px-4 py-3"
                        >
                            <div className="h-11 w-11 overflow-hidden rounded-full bg-emerald-50">
                                <div className="product-shimmer absolute inset-0" />
                            </div>

                            <div className="flex-1">
                                <Shimmer className="h-4 w-20 rounded-md" />
                                <Shimmer className="mt-2 h-5 w-44 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DesktopProductTitleSkeleton() {
    return (
        <div className="hidden lg:block">
            <div className="mt-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <Shimmer className="h-9 w-[48%] rounded-lg bg-slate-800/15" />

                <div className="mt-4 flex items-center gap-2">
                    <Shimmer className="h-4 w-20 rounded-md" />
                    <span className="text-slate-300">•</span>
                    <Shimmer className="h-4 w-16 rounded-md" />
                    <span className="text-slate-300">•</span>
                    <Shimmer className="h-4 w-24 rounded-md" />
                </div>
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <>
            <style>{`
                @keyframes product-shimmer {
                    0% {
                        transform: translateX(-120%);
                    }
                    100% {
                        transform: translateX(120%);
                    }
                }

                .product-shimmer::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-120%);
                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,0.72),
                            transparent
                        );
                    animation:
                        product-shimmer
                        1.45s
                        ease-in-out
                        infinite;
                }

                @keyframes product-image-sheen {
                    0% {
                        opacity: 0.05;
                        transform: translateX(-90%);
                    }
                    50% {
                        opacity: 0.45;
                    }
                    100% {
                        opacity: 0.05;
                        transform: translateX(90%);
                    }
                }

                .product-image-sheen {
                    background:
                        linear-gradient(
                            110deg,
                            transparent 20%,
                            rgba(255,255,255,0.65) 50%,
                            transparent 78%
                        );
                    animation:
                        product-image-sheen
                        1.9s
                        ease-in-out
                        infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .product-shimmer::after,
                    .product-image-sheen {
                        animation: none;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-white lg:bg-slate-50">
                {/* Real toolbar */}
                <TopBar />

                <main className="pt-[var(--topbar-h,64px)] lg:pt-[calc(var(--topbar-h,64px)+12px)]">
                    {/* =========================================
                        DESKTOP
                    ========================================= */}
                    <div className="hidden lg:block">
                        <div className="mx-auto max-w-[1620px] px-5 pb-10">
                            <BreadcrumbSkeleton />

                            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_460px] gap-5">
                                <section className="min-w-0">
                                    <ProductImageSkeleton />
                                    <DesktopProductTitleSkeleton />
                                </section>

                                <DesktopSidebarSkeleton />
                            </div>
                        </div>
                    </div>

                    {/* =========================================
                        MOBILE / TABLET
                    ========================================= */}
                    <div className="lg:hidden">
                        <ProductImageSkeleton />

                        <MobileProductInfoSkeleton />

                        <div className="h-6 bg-slate-50" />
                    </div>
                </main>
            </div>
        </>
    );
}