"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { IoCamera } from "react-icons/io5";

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
    const list = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
    const safeInitial = clamp(initialIndex, 0, Math.max(0, list.length - 1));

    const trackRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(safeInitial);
    const [isFs, setIsFs] = useState(false);

    const hasMany = list.length > 1;

    const scrollToIndex = (idx: number) => {
        const track = trackRef.current;
        if (!track) return;
        const i = clamp(idx, 0, list.length - 1);
        const el = track.children.item(i) as HTMLElement | null;
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        setActive(i);
    };

    const prev = () => scrollToIndex(active - 1);
    const next = () => scrollToIndex(active + 1);

    // Keep active index in sync on scroll (snap)
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
                // find nearest slide by offsetLeft
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

    // Start on initial slide
    useEffect(() => {
        if (!list.length) return;
        // do it after mount
        const t = setTimeout(() => scrollToIndex(safeInitial), 0);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.length]);

    // Keyboard for fullscreen
    useEffect(() => {
        if (!isFs) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFs(false);
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFs, active]);

    if (!list.length) {
        return (
            <div className="flex h-[260px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 via-gray-100 to-orange-100 dark:from-[#1b1f22] dark:via-[#242a2e] dark:to-[#1b1f22] md:h-[420px]">
                <div className="text-center">
                    <div className="text-sm font-extrabold text-orange-500">No photos</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">Upload images to show gallery.</div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Main slider */}
            <div className="relative">
                <div
                    ref={trackRef}
                    className="
            flex w-full overflow-x-auto scroll-smooth
            snap-x snap-mandatory
            [scrollbar-width:none] [-ms-overflow-style:none]
          "
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    {/* hide webkit scrollbar */}
                    <style jsx>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

                    {list.map((src, idx) => (
                        <button
                            key={`${src}-${idx}`}
                            type="button"
                            onClick={() => setIsFs(true)}
                            className="relative h-[260px] w-full shrink-0 snap-start md:h-[420px]"
                            aria-label={`Open photo ${idx + 1} fullscreen`}
                        >
                            <Image
                                src={src}
                                alt={`${title} ${idx + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                                priority={idx === 0}
                            />
                        </button>
                    ))}
                </div>

                {/* badge (top-left) */}
                {badgeText ? (
                    <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-semibold text-white">
                        {badgeText}
                    </div>
                ) : null}

                {/* count (bottom-left) */}
                {hasMany ? (
                    <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-semibold text-white">

                        <div className="flex items-center gap-1">
                            <IoCamera /> {active + 1}/{list.length}
                        </div>
                    </div>
                ) : null}

                {/* arrows */}
                {hasMany ? (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                            aria-label="Previous photo"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white backdrop-blur hover:bg-black/70"
                            aria-label="Next photo"
                        >
                            ›
                        </button>
                    </>
                ) : null}

                {/* dots */}
                {hasMany ? (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-1.5 backdrop-blur">
                        {list.slice(0, 8).map((_, i) => {
                            const isActive = i === active;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => scrollToIndex(i)}
                                    className={[
                                        "h-1.5 rounded-full transition-all",
                                        isActive ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white",
                                    ].join(" ")}
                                    aria-label={`Go to photo ${i + 1}`}
                                />
                            );
                        })}
                        {list.length > 8 ? <span className="ml-1 text-[10px] text-white/80">+{list.length - 8}</span> : null}
                    </div>
                ) : null}
            </div>

            {/* thumbnails row */}
            {hasMany ? (
                <div className="flex gap-2 overflow-x-auto p-3">
                    {list.slice(0, 18).map((src, idx) => (
                        <button
                            key={`thumb-${src}-${idx}`}
                            type="button"
                            onClick={() => scrollToIndex(idx)}
                            className={[
                                "shrink-0 overflow-hidden rounded-xl border",
                                idx === active
                                    ? "border-orange-500 ring-2 ring-orange-500/30"
                                    : "border-gray-200 dark:border-gray-700",
                            ].join(" ")}
                            title={`Photo ${idx + 1}`}
                            aria-label={`Open photo ${idx + 1}`}
                        >
                            <Image
                                src={src}
                                alt={`${title} thumb ${idx + 1}`}
                                width={160}
                                height={120}
                                className="h-20 w-28 object-cover"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            ) : null}

            {/* fullscreen modal */}
            {isFs ? (
                <div className="fixed inset-0 z-[9999] bg-black/95">
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                        <button
                            onClick={() => setIsFs(false)}
                            className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
                        >
                            ✕ Close
                        </button>
                        {hasMany ? (
                            <div className="text-xs font-semibold text-white/80">
                                {active + 1} / {list.length}
                            </div>
                        ) : null}
                    </div>

                    {hasMany ? (
                        <>
                            <button
                                type="button"
                                onClick={prev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/15"
                                aria-label="Previous photo"
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/15"
                                aria-label="Next photo"
                            >
                                ›
                            </button>
                        </>
                    ) : null}

                    <div className="flex h-full w-full items-center justify-center px-4 py-16">
                        <div className="relative h-full w-full max-w-6xl">
                            <Image
                                src={list[active]}
                                alt={`${title} fullscreen ${active + 1}`}
                                fill
                                className="object-contain"
                                unoptimized
                                priority
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}