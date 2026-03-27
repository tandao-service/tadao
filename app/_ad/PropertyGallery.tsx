"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
    IoCamera,
    IoChevronBack,
    IoChevronForward,
    IoClose,
    IoAdd,
    IoRemove,
} from "react-icons/io5";

type Props = {
    title: string;
    images: string[];
    initialIndex?: number;
    badgeText?: string;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function PropertyGallery({
    title,
    images,
    initialIndex = 0,
    badgeText,
}: Props) {
    const list = useMemo(
        () => (Array.isArray(images) ? images.filter(Boolean) : []),
        [images]
    );

    const safeInitial = clamp(initialIndex, 0, Math.max(0, list.length - 1));

    const trackRef = useRef<HTMLDivElement | null>(null);
    const fsThumbsRef = useRef<HTMLDivElement | null>(null);

    const [active, setActive] = useState(safeInitial);
    const [isFs, setIsFs] = useState(false);

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const dragRef = useRef<{
        dragging: boolean;
        startX: number;
        startY: number;
        startOffsetX: number;
        startOffsetY: number;
    }>({
        dragging: false,
        startX: 0,
        startY: 0,
        startOffsetX: 0,
        startOffsetY: 0,
    });

    const hasMany = list.length > 1;

    const resetZoomState = React.useCallback(() => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    }, []);

    const setSlide = React.useCallback(
        (idx: number, mode: "page" | "fs" = "page") => {
            if (!list.length) return;

            const i = clamp(idx, 0, list.length - 1);
            setActive(i);
            resetZoomState();

            if (mode === "page") {
                const track = trackRef.current;
                if (track) {
                    const el = track.children.item(i) as HTMLElement | null;
                    if (el) {
                        el.scrollIntoView({
                            behavior: "smooth",
                            inline: "start",
                            block: "nearest",
                        });
                    }
                }
            }

            const thumbs = fsThumbsRef.current;
            if (thumbs) {
                const thumb = thumbs.children.item(i) as HTMLElement | null;
                thumb?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        },
        [list.length, resetZoomState]
    );

    const prevPage = React.useCallback(() => {
        setSlide(active - 1, "page");
    }, [active, setSlide]);

    const nextPage = React.useCallback(() => {
        setSlide(active + 1, "page");
    }, [active, setSlide]);

    const prevFs = React.useCallback(() => {
        if (!list.length) return;
        setSlide(active <= 0 ? list.length - 1 : active - 1, "fs");
    }, [active, list.length, setSlide]);

    const nextFs = React.useCallback(() => {
        if (!list.length) return;
        setSlide(active >= list.length - 1 ? 0 : active + 1, "fs");
    }, [active, list.length, setSlide]);

    const zoomIn = React.useCallback(() => {
        setZoom((z) => clamp(Number((z + 0.4).toFixed(2)), 1, 4));
    }, []);

    const zoomOut = React.useCallback(() => {
        setZoom((z) => {
            const nextZoom = clamp(Number((z - 0.4).toFixed(2)), 1, 4);
            if (nextZoom === 1) {
                setOffset({ x: 0, y: 0 });
            }
            return nextZoom;
        });
    }, []);

    const toggleZoom = React.useCallback(() => {
        setZoom((z) => {
            const nextZoom = z > 1 ? 1 : 2;
            if (nextZoom === 1) {
                setOffset({ x: 0, y: 0 });
            }
            return nextZoom;
        });
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let raf = 0;

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const children = Array.from(track.children) as HTMLElement[];
                if (!children.length) return;

                const left = track.scrollLeft;
                let bestIdx = 0;
                let bestDist = Number.POSITIVE_INFINITY;

                children.forEach((c, idx) => {
                    const dist = Math.abs(c.offsetLeft - left);
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestIdx = idx;
                    }
                });

                setActive(bestIdx);
            });
        };

        track.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            cancelAnimationFrame(raf);
            track.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        if (!list.length) return;
        const t = setTimeout(() => setSlide(safeInitial, "page"), 0);
        return () => clearTimeout(t);
    }, [list.length, safeInitial, setSlide]);

    useEffect(() => {
        if (!isFs) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFs(false);
            if (e.key === "ArrowLeft") prevFs();
            if (e.key === "ArrowRight") nextFs();
            if (e.key === "+" || e.key === "=") zoomIn();
            if (e.key === "-") zoomOut();
        };

        window.addEventListener("keydown", onKey);
        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = oldOverflow;
        };
    }, [isFs, prevFs, nextFs, zoomIn, zoomOut]);

    useEffect(() => {
        resetZoomState();
    }, [active, resetZoomState]);

    if (!list.length) {
        return (
            <div className="flex h-[260px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 via-gray-100 to-orange-100 md:h-[420px]">
                <div className="text-center">
                    <div className="text-sm font-extrabold text-orange-500">No photos</div>
                    <div className="mt-1 text-xs text-gray-500">
                        Upload images to show gallery.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="relative">
                    <div
                        ref={trackRef}
                        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

                        {list.map((src, idx) => (
                            <button
                                key={`${src}-${idx}`}
                                type="button"
                                onClick={() => {
                                    setActive(idx);
                                    resetZoomState();
                                    setIsFs(true);
                                }}
                                className="relative h-[260px] w-full shrink-0 snap-start bg-slate-100 md:h-[460px]"
                                aria-label={`Open photo ${idx + 1} fullscreen`}
                            >
                                <Image
                                    src={src}
                                    alt={`${title} ${idx + 1}`}
                                    fill
                                    className="object-cover transition duration-300 hover:scale-[1.02]"
                                    unoptimized
                                    priority={idx === 0}
                                />
                            </button>
                        ))}
                    </div>

                    {badgeText ? (
                        <div className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur">
                            {badgeText}
                        </div>
                    ) : null}

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/65 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur">
                        <div className="flex items-center gap-1.5">
                            <IoCamera className="text-sm" />
                            {active + 1}/{list.length}
                        </div>
                    </div>

                    {hasMany ? (
                        <>
                            <button
                                type="button"
                                onClick={prevPage}
                                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-800 shadow-xl transition hover:scale-105 hover:bg-white"
                                aria-label="Previous photo"
                            >
                                <IoChevronBack className="text-xl" />
                            </button>

                            <button
                                type="button"
                                onClick={nextPage}
                                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-800 shadow-xl transition hover:scale-105 hover:bg-white"
                                aria-label="Next photo"
                            >
                                <IoChevronForward className="text-xl" />
                            </button>
                        </>
                    ) : null}

                    {hasMany ? (
                        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1.5 backdrop-blur">
                            {list.slice(0, 8).map((_, i) => {
                                const isActive = i === active;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSlide(i, "page")}
                                        className={[
                                            "h-1.5 rounded-full transition-all",
                                            isActive ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white",
                                        ].join(" ")}
                                        aria-label={`Go to photo ${i + 1}`}
                                    />
                                );
                            })}
                            {list.length > 8 ? (
                                <span className="ml-1 text-[10px] text-white/80">
                                    +{list.length - 8}
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                {hasMany ? (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-3">
                        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
                            <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

                            {list.slice(0, 20).map((src, idx) => (
                                <button
                                    key={`thumb-${src}-${idx}`}
                                    type="button"
                                    onClick={() => setSlide(idx, "page")}
                                    className={[
                                        "relative shrink-0 overflow-hidden rounded-2xl border transition",
                                        idx === active
                                            ? "border-orange-500 ring-2 ring-orange-500/30"
                                            : "border-slate-200 hover:border-orange-300",
                                    ].join(" ")}
                                    title={`Photo ${idx + 1}`}
                                    aria-label={`Open photo ${idx + 1}`}
                                >
                                    <Image
                                        src={src}
                                        alt={`${title} thumb ${idx + 1}`}
                                        width={140}
                                        height={100}
                                        className="h-20 w-28 object-cover"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {isFs ? (
                <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setIsFs(false)} />

                    <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur md:px-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
                                {active + 1}/{list.length}
                            </div>
                            <div className="max-w-[50vw] truncate text-sm font-semibold text-white/90">
                                {title}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    zoomOut();
                                }}
                                className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                                aria-label="Zoom out"
                            >
                                <IoRemove className="text-lg" />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    zoomIn();
                                }}
                                className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                                aria-label="Zoom in"
                            >
                                <IoAdd className="text-lg" />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFs(false);
                                }}
                                className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                                aria-label="Close gallery"
                            >
                                <IoClose className="text-xl" />
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 flex h-full w-full items-center justify-center pt-[72px]">
                        <div className="flex h-[calc(100vh-72px)] w-full max-w-[1600px] gap-4 px-3 pb-4 md:px-6">
                            {hasMany ? (
                                <div className="hidden w-[108px] shrink-0 rounded-[24px] bg-white/6 p-2 backdrop-blur md:block">
                                    <div
                                        ref={fsThumbsRef}
                                        className="h-full overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none]"
                                    >
                                        <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>

                                        <div className="flex flex-col gap-2">
                                            {list.map((src, idx) => (
                                                <button
                                                    key={`fs-thumb-${src}-${idx}`}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSlide(idx, "fs");
                                                    }}
                                                    className={[
                                                        "relative overflow-hidden rounded-2xl border transition",
                                                        idx === active
                                                            ? "border-orange-400 ring-2 ring-orange-400/30"
                                                            : "border-white/10 hover:border-white/30",
                                                    ].join(" ")}
                                                >
                                                    <Image
                                                        src={src}
                                                        alt={`${title} fullscreen thumb ${idx + 1}`}
                                                        width={92}
                                                        height={76}
                                                        className="h-[76px] w-[92px] object-cover"
                                                        unoptimized
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="relative min-w-0 flex-1 overflow-hidden rounded-[28px] bg-[#0d0d0f] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                                {hasMany ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prevFs();
                                            }}
                                            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white px-3 py-3 text-slate-900 shadow-xl transition hover:scale-105"
                                            aria-label="Previous photo"
                                        >
                                            <IoChevronBack className="text-xl" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                nextFs();
                                            }}
                                            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white px-3 py-3 text-slate-900 shadow-xl transition hover:scale-105"
                                            aria-label="Next photo"
                                        >
                                            <IoChevronForward className="text-xl" />
                                        </button>
                                    </>
                                ) : null}

                                <div
                                    className={[
                                        "relative h-full w-full overflow-hidden",
                                        zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
                                    ].join(" ")}
                                    onClick={(e) => e.stopPropagation()}
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        toggleZoom();
                                    }}
                                    onWheel={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (e.deltaY < 0) {
                                            setZoom((z) => clamp(Number((z + 0.2).toFixed(2)), 1, 4));
                                        } else {
                                            setZoom((z) => {
                                                const nextZoom = clamp(Number((z - 0.2).toFixed(2)), 1, 4);
                                                if (nextZoom === 1) setOffset({ x: 0, y: 0 });
                                                return nextZoom;
                                            });
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        if (zoom <= 1) return;
                                        dragRef.current.dragging = true;
                                        dragRef.current.startX = e.clientX;
                                        dragRef.current.startY = e.clientY;
                                        dragRef.current.startOffsetX = offset.x;
                                        dragRef.current.startOffsetY = offset.y;
                                    }}
                                    onMouseMove={(e) => {
                                        if (!dragRef.current.dragging || zoom <= 1) return;
                                        const dx = e.clientX - dragRef.current.startX;
                                        const dy = e.clientY - dragRef.current.startY;
                                        setOffset({
                                            x: dragRef.current.startOffsetX + dx,
                                            y: dragRef.current.startOffsetY + dy,
                                        });
                                    }}
                                    onMouseUp={() => {
                                        dragRef.current.dragging = false;
                                    }}
                                    onMouseLeave={() => {
                                        dragRef.current.dragging = false;
                                    }}
                                >
                                    <div
                                        className="relative h-full w-full transition-transform duration-200 ease-out"
                                        style={{
                                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                            transformOrigin: "center center",
                                        }}
                                    >
                                        <Image
                                            key={`${list[active]}-${active}`}
                                            src={list[active]}
                                            alt={`${title} fullscreen ${active + 1}`}
                                            fill
                                            className="object-contain select-none"
                                            unoptimized
                                            priority
                                            draggable={false}
                                        />
                                    </div>
                                </div>

                                <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/55 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                                    Zoom {zoom.toFixed(1)}x
                                </div>

                                <div className="absolute bottom-4 left-4 z-20 rounded-full bg-black/55 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                                    Double click / mouse wheel to zoom
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}