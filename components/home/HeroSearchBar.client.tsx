// components/home/HeroSearchBar.client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch, IoClose, IoArrowForward } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import RegionsGrid from "@/components/home/RegionsGrid";
import { HomeAd, HomeRegion } from "@/lib/home/home.data";


type Props = {
    regions: HomeRegion[];
    listingSlug?: string;
    featured?: HomeAd[];
    trending?: HomeAd[];
};

export default function HeroSearchBar({
    regions,
    listingSlug,
    featured = [],
    trending = [],
}: Props) {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [openRegionModal, setOpenRegionModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<HomeRegion | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const regionLabel = selectedRegion ? selectedRegion.name : "All in Kenya";
    const [remoteSuggestions, setRemoteSuggestions] = useState<string[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const localSuggestions = useMemo(() => {
        const pool = [
            ...(Array.isArray(featured) ? featured : []),
            ...(Array.isArray(trending) ? trending : []),
        ];

        const seen = new Set<string>();

        return pool
            .map((ad) => String(ad?.title || "").trim())
            .filter(Boolean)
            .filter((title) => {
                const key = title.toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
    }, [featured, trending]);

    useEffect(() => {
        const value = q.trim();

        if (value.length < 2) {
            setRemoteSuggestions([]);
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                setLoadingSuggestions(true);

                const params = new URLSearchParams({ query: value });
                if (selectedRegion?.slug && selectedRegion.slug !== "all-kenya") {
                    params.set("region", selectedRegion.slug);
                }

                const res = await fetch(`/api/search/suggest?${params.toString()}`, {
                    signal: controller.signal,
                });

                const data = await res.json();
                setRemoteSuggestions(
                    Array.isArray(data?.suggestions)
                        ? data.suggestions.map((x: any) => x.label || x.value).filter(Boolean)
                        : []
                );
            } catch (error: any) {
                if (error?.name !== "AbortError") {
                    console.error(error);
                }
            } finally {
                setLoadingSuggestions(false);
            }
        }, 250);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [q, selectedRegion]);

    const suggestions = useMemo(() => {
        const value = q.trim().toLowerCase();
        const merged = [...localSuggestions, ...remoteSuggestions];

        const seen = new Set<string>();

        return merged
            .filter((item) => !value || item.toLowerCase().includes(value))
            .filter((item) => {
                const key = item.toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .slice(0, 8);
    }, [q, localSuggestions, remoteSuggestions]);

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
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".search-wrapper")) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <>
            <div className="search-wrapper relative overflow-visible rounded-2xl bg-white p-2 shadow-lg">
                <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[200px_minmax(0,1fr)_52px]">
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

                    <div className="relative w-full">
                        <input
                            value={q}
                            onChange={(e) => {
                                setQ(e.target.value);
                                setShowSuggestions(true);
                                setActiveIndex(-1);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault();
                                    setShowSuggestions(true);
                                    setActiveIndex((prev) =>
                                        prev < suggestions.length - 1 ? prev + 1 : 0
                                    );
                                }

                                if (e.key === "ArrowUp") {
                                    e.preventDefault();
                                    setActiveIndex((prev) =>
                                        prev > 0 ? prev - 1 : suggestions.length - 1
                                    );
                                }

                                if (e.key === "Enter") {
                                    e.preventDefault();

                                    if (showSuggestions && activeIndex >= 0 && suggestions[activeIndex]) {
                                        setQ(suggestions[activeIndex]);
                                        setShowSuggestions(false);
                                        setActiveIndex(-1);
                                        router.push(`/search?query=${encodeURIComponent(suggestions[activeIndex])}`);
                                    } else {
                                        go();
                                    }
                                }

                                if (e.key === "Escape") {
                                    setShowSuggestions(false);
                                    setActiveIndex(-1);
                                }
                            }}
                            placeholder="Search keywords..."
                            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                        />

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[9999] max-h-[360px] overflow-y-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl">
                                {suggestions.map((item, index) => {
                                    const active = index === activeIndex;

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                setQ(item);
                                                setShowSuggestions(false);
                                                setActiveIndex(-1);
                                                router.push(`/search?query=${encodeURIComponent(item)}`);
                                            }}
                                            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${active ? "bg-slate-100" : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className="truncate">{item}</span>
                                            <IoArrowForward className="text-orange-500" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

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