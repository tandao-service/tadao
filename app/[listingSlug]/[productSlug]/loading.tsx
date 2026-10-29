// app/[listingSlug]/[productSlug]/loading.tsx
// Matches the compact AdDetailsView and PropertyGallery layout.
// TopBar already renders a spacer for its fixed status bar; do not add a second topbar offset.

import TopBar from "@/components/home/TopBar.client";

function Bone({
    className = "",
}: {
    className?: string;
}) {
    return (
        <span
            aria-hidden="true"
            className={`ad-details-bone relative block overflow-hidden rounded bg-slate-200 ${className}`}
        />
    );
}

function BreadcrumbSkeleton() {
    return (
        <div className="mb-3 hidden items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.04)] lg:flex">
            <div className="flex min-w-0 items-center gap-2">
                <Bone className="h-3 w-10" />
                <span className="text-xs text-slate-300">/</span>
                <Bone className="h-3 w-44 max-w-[25vw]" />
                <span className="text-xs text-slate-300">/</span>
                <Bone className="h-3 w-14" />
                <span className="text-xs text-slate-300">/</span>
                <Bone className="h-3 w-14" />
            </div>
            <Bone className="h-3 w-16 shrink-0" />
        </div>
    );
}

function GallerySkeleton() {
    return (
        <div className="overflow-hidden border-b border-slate-100 bg-white">
            {/* Same aspect ratio / breakpoints as PropertyGallery.tsx */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b0b0d] sm:aspect-[16/10] md:aspect-auto md:h-[350px] lg:h-[370px]">
                <div className="absolute inset-y-0 left-[22%] right-[22%] overflow-hidden bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300">
                    <div className="absolute inset-x-[18%] top-[16%] h-[35%] rounded-lg bg-slate-300/70" />
                    <div className="absolute inset-x-[24%] bottom-[13%] h-[23%] rounded-lg bg-white/50" />
                    <div className="ad-details-image-sheen absolute inset-0" />
                </div>

                <div className="absolute left-3 top-3 rounded-lg bg-black/65 px-2.5 py-1">
                    <Bone className="h-3 w-36 bg-white/30" />
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/65 px-2.5 py-1.5">
                    <Bone className="h-3 w-3 rounded-full bg-white/40" />
                    <Bone className="h-3 w-7 bg-white/40" />
                </div>

                <div className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm">
                    <Bone className="h-3.5 w-2.5 bg-slate-300" />
                </div>
                <div className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm">
                    <Bone className="h-3.5 w-2.5 bg-slate-300" />
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1.5">
                    {Array.from({ length: 6 }, (_, i) => (
                        <Bone key={i} className={`h-1.5 rounded-full bg-white/55 ${i === 0 ? "w-5" : "w-1.5"}`} />
                    ))}
                </div>
            </div>

            {/* Compact thumbnail strip: h-14 x w-20 on mobile, 16 x 24 above sm */}
            <div className="border-t border-slate-200 bg-slate-50 p-2">
                <div className="flex gap-1.5 overflow-hidden">
                    {Array.from({ length: 7 }, (_, i) => (
                        <div
                            key={i}
                            className={`shrink-0 overflow-hidden rounded-lg border bg-white ${i === 0 ? "border-orange-400 ring-1 ring-orange-300" : "border-slate-200"}`}
                        >
                            <Bone className="h-14 w-20 rounded-none bg-slate-200 sm:h-16 sm:w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProductInformationSkeleton() {
    return (
        <div className="p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div className="min-w-0 flex-1">
                    <Bone className="h-5 w-[90%] max-w-[440px] sm:h-[22px]" />
                    <Bone className="mt-1.5 h-5 w-[65%] max-w-[310px] sm:h-[22px]" />
                    <Bone className="mt-2 h-3 w-40" />
                </div>

                {/* Actual AdDetailsView shows the title price inside this panel only on small screens. */}
                <div className="w-fit rounded-xl bg-orange-50 px-3 py-2 lg:hidden">
                    <Bone className="h-3 w-12 bg-orange-200/70" />
                    <Bone className="mt-1 h-5 w-28 bg-orange-200/70" />
                </div>
            </div>

            <div className="mt-4">
                <Bone className="h-4 w-20 bg-slate-300" />
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {["w-[115px]", "w-[170px]", "w-[110px]", "w-[90px]"].map((widthClass, i) => (
                        <div key={i} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
                            <Bone className={`h-3 max-w-full ${widthClass}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <Bone className="h-4 w-24 bg-slate-300" />
                <div className="mt-2 space-y-1.5">
                    <Bone className="h-3 w-full" />
                    <Bone className="h-3 w-[94%]" />
                    <Bone className="h-3 w-[83%]" />
                </div>
            </div>
        </div>
    );
}

function PriceSkeleton() {
    return (
        <div className="hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] lg:block">
            <Bone className="h-3 w-12" />
            <Bone className="mt-2 h-6 w-36 bg-slate-300" />
        </div>
    );
}

function ContactRowSkeleton({ index }: { index: number }) {
    return (
        <div className="flex min-h-[42px] items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index === 4 ? "bg-amber-50" : "bg-emerald-50"}`}>
                <Bone className="h-4 w-4 rounded-full bg-slate-200" />
            </div>
            <div className="min-w-0 flex-1">
                <Bone className="h-2.5 w-16" />
                <Bone className="mt-1 h-3 w-[62%] max-w-[210px]" />
            </div>
        </div>
    );
}

function SellerPanelSkeleton() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2.5">
                <Bone className="h-11 w-11 shrink-0 rounded-full bg-orange-100" />
                <div className="min-w-0 flex-1">
                    <Bone className="h-4 w-[65%] max-w-[175px] bg-slate-300" />
                    <Bone className="mt-1.5 h-3 w-28" />
                </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2">
                {Array.from({ length: 4 }, (_, i) => <ContactRowSkeleton key={i} index={i} />)}

                <div className="flex min-h-[42px] items-center gap-2.5 rounded-lg bg-orange-500 px-3 py-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <Bone className="h-4 w-4 bg-white/30" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <Bone className="h-2.5 w-14 bg-white/30" />
                        <Bone className="mt-1 h-3 w-24 bg-white/30" />
                    </div>
                </div>

                <ContactRowSkeleton index={4} />
            </div>

            <div className="mt-3 space-y-2.5 border-t border-slate-200 pt-3">
                <Bone className="h-10 w-full rounded-lg bg-emerald-200" />
                <div className="grid grid-cols-2 gap-2">
                    <Bone className="h-9 w-full rounded-lg bg-red-100" />
                    <Bone className="h-9 w-full rounded-lg bg-blue-100" />
                </div>
            </div>
        </div>
    );
}

function RelatedListingsSkeleton() {
    return (
        <section className="mt-5" aria-hidden="true">
            <div className="mb-2 flex items-center justify-between">
                <Bone className="h-4 w-36 bg-slate-300" />
                <Bone className="h-3 w-16" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <Bone className="aspect-[4/3] w-full rounded-none bg-slate-200" />
                        <div className="space-y-1.5 p-2.5">
                            <Bone className="h-3 w-[90%]" />
                            <Bone className="h-2.5 w-[70%]" />
                            <Bone className="h-2.5 w-full" />
                            <Bone className="mt-2 h-4 w-24 bg-orange-100" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function Loading() {
    return (
        <>
            <style>{`
                @keyframes ad-detail-shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .ad-details-bone::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(90deg,transparent,rgba(255,255,255,.68),transparent);
                    animation: ad-detail-shimmer 1.5s ease-in-out infinite;
                }
                .ad-details-image-sheen {
                    background: linear-gradient(110deg,transparent 18%,rgba(255,255,255,.4) 50%,transparent 82%);
                    animation: ad-detail-shimmer 2s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .ad-details-bone::after, .ad-details-image-sheen { animation: none; }
                }
            `}</style>

            <TopBar />
            <div className="min-h-screen w-full bg-[#EBEEF2]">
                {/* The TopBar handles the fixed green strip's normal-flow spacer. */}
                <main className="mx-auto w-full max-w-[1280px] px-3 pb-6 pt-2 sm:px-4 lg:px-5" aria-busy="true">
                    <span className="sr-only" role="status">Loading advert details...</span>
                    <BreadcrumbSkeleton />

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-3">
                        <div className="min-w-0 lg:col-span-8">
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                                <GallerySkeleton />
                                <ProductInformationSkeleton />
                            </div>
                        </div>

                        <aside className="min-w-0 lg:col-span-4">
                            <div className="space-y-2.5">
                                <PriceSkeleton />
                                <SellerPanelSkeleton />
                            </div>
                        </aside>
                    </div>
                    <RelatedListingsSkeleton />
                </main>
            </div>
        </>
    );
}
