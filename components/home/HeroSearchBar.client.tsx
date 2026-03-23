// components/home/HeroSearchBar.client.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch, IoClose } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import RegionsGrid from "@/components/home/RegionsGrid";
import { HomeRegion } from "@/lib/home/home.data";


type Props = {
    regions: HomeRegion[];
    listingSlug?: string;
};

export default function HeroSearchBar({
    regions,
    listingSlug,
}: Props) {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [openRegionModal, setOpenRegionModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<HomeRegion | null>(null);

    const regionLabel = selectedRegion ? selectedRegion.name : "All in Kenya";

    const go = () => {
        const query = new URLSearchParams();

        if (q.trim()) query.set("query", q.trim());

        if (listingSlug) query.set("listingSlug", listingSlug);

        if (selectedRegion?.slug && selectedRegion.slug !== "all-kenya") {
            query.set("region", selectedRegion.slug);
        }

        const queryString = query.toString();
        router.push(queryString ? `/search?${queryString}` : "/search");
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenRegionModal(false);
        };

        if (openRegionModal) {
            window.addEventListener("keydown", onKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [openRegionModal]);

    return (
        <>
            <div className="rounded-2xl bg-white p-2 shadow-lg">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[200px_1fr_52px]">
                    <button
                        type="button"
                        onClick={() => setOpenRegionModal(true)}
                        className="flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition hover:bg-slate-50"
                    >
                        <HiOutlineLocationMarker className="shrink-0 text-base text-orange-500" />
                        <span className="truncate text-sm font-medium text-slate-800">
                            {regionLabel}
                        </span>
                    </button>

                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && go()}
                        placeholder="Search keywords..."
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                    />

                    <button
                        type="button"
                        onClick={go}
                        className="flex items-center justify-center rounded-xl bg-orange-500 p-2 font-extrabold text-white hover:bg-orange-600"
                        aria-label="Search"
                    >
                        <IoSearch />
                    </button>
                </div>
            </div>

            {openRegionModal && (
                <div
                    className="fixed inset-0 z-[100] bg-black/50 p-4"
                    onClick={() => setOpenRegionModal(false)}
                >
                    <div
                        className="mx-auto mt-10 max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">
                                    Select region
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Choose where you want to browse listings
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpenRegionModal(false)}
                                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <IoClose className="text-xl" />
                            </button>
                        </div>

                        <div className="max-h-[calc(85vh-72px)] overflow-y-auto p-4 sm:p-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedRegion(null);
                                    setOpenRegionModal(false);
                                }}
                                className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                            >
                                All in Kenya
                            </button>

                            <div

                            >

                                <RegionsGrid
                                    regions={regions}
                                    listingSlug={""}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}