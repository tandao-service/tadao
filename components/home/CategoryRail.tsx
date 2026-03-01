// components/home/CategoryRail.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import type { HomeCategoryNode } from "@/lib/home/home.categories";
import { cn } from "@/lib/utils";

function slugify(input: string) {
    return String(input || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function stripIntent(name: string) {
    return String(name || "")
        .replace(/\s+for\s+sale\s*$/i, "")
        .replace(/\s+for\s+rent\s*$/i, "")
        .trim();
}

function detectMode(name: string): "sale" | "rent" {
    const n = String(name || "").toLowerCase();
    if (/\bfor\s+rent\b/.test(n) || /\brent\b/.test(n)) return "rent";
    if (/\bfor\s+sale\b/.test(n) || /\bsale\b/.test(n)) return "sale";
    return "sale";
}

function toListingSlugFromName(name: string) {
    const mode = detectMode(name);
    const base = stripIntent(name);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";
    return `${slugify(base)}-${suffix}`;
}

/** Hide scrollbar */
const scrollbarNone = `
  .scrollbar-none::-webkit-scrollbar { display:none; }
  .scrollbar-none { -ms-overflow-style:none; scrollbar-width:none; }
`;

function useScrollButtons(deps: any[] = []) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showUp, setShowUp] = React.useState(false);
    const [showDown, setShowDown] = React.useState(false);

    const compute = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        setShowUp(scrollTop > 0);
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
        setShowDown(!atBottom && scrollHeight > clientHeight + 2);
    }, []);

    const toTop = React.useCallback(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const toBottom = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, []);

    React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScroll = () => compute();
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        compute();
        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { scrollRef, showUp, showDown, toTop, toBottom };
}

function IconCircle({ src, alt }: { src?: string | null; alt: string }) {
    return (
        <div className="rounded-full bg-gray-100 p-1 dark:bg-[#131B1E]">
            {src ? (
                <Image
                    className="h-8 w-8 rounded-full object-cover"
                    src={src}
                    alt={alt}
                    width={60}
                    height={60}
                    unoptimized
                />
            ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200" />
            )}
        </div>
    );
}

type Props = {
    tree: HomeCategoryNode[];
    compact?: boolean;

    /** Footer element ref: sidebar stops before it, then scrolls away */
    footerRef?: React.RefObject<HTMLElement | null>;

    /** Use a CSS var height from TopBar (recommended) */
    topOffsetCssVar?: string; // e.g. "--topbar-h"
    /** Extra gap below topbar */
    topGap?: number;
    /** Gap above footer */
    bottomGap?: number;
};

export default function CategoryRail({
    tree,
    compact,
    footerRef,
    topOffsetCssVar = "--topbar-h",
    topGap = 12,
    bottomGap = 12,
}: Props) {
    const [hovered, setHovered] = React.useState<string>("");

    const wrapRef = React.useRef<HTMLDivElement>(null); // inside <aside>
    const railRef = React.useRef<HTMLDivElement>(null);

    const [mode, setMode] = React.useState<"relative" | "fixed" | "stopped">(
        "relative"
    );
    const [fixedTop, setFixedTop] = React.useState<number>(76);
    const [stoppedTop, setStoppedTop] = React.useState<number>(0);

    const categoryScroll = useScrollButtons();
    const subcategoryScroll = useScrollButtons([hovered]);

    if (!tree?.length) return null;

    // ✅ Mobile compact version (UPDATED: category click -> default subcategory)
    if (compact) {
        return (
            <div className="rounded-2xl border bg-white p-3 dark:border-gray-700 dark:bg-[#2D3236]">
                <div className="text-sm font-extrabold">Categories</div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                    {tree.map((c) => {
                        const defaultName =
                            c?.subcategories?.length ? c.subcategories[0].name : c.name;

                        return (
                            <a
                                key={c.id}
                                href={`/${toListingSlugFromName(defaultName)}`}
                                className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-[#131B1E]"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100">
                                        {c.icon ? (
                                            <Image
                                                src={c.icon}
                                                alt={c.name}
                                                width={60}
                                                height={60}
                                                className="h-full w-full object-cover"
                                                unoptimized
                                            />
                                        ) : null}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate">{c.name}</div>
                                        <div className="text-xs text-slate-500">{c.count} ads</div>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }

    const activeCat = tree.find((x) => x.name === hovered) || tree[0];
    const showSub = Boolean(hovered);

    const computeTopOffsetPx = React.useCallback(() => {
        const v = getComputedStyle(document.documentElement)
            .getPropertyValue(topOffsetCssVar)
            .trim();
        const n = Number(String(v).replace("px", "").trim());
        const topbarH = Number.isFinite(n) && n > 0 ? n : 64;
        return topbarH + topGap;
    }, [topGap, topOffsetCssVar]);

    const recompute = React.useCallback(() => {
        const wrap = wrapRef.current;
        const rail = railRef.current;
        const footerEl = footerRef?.current;

        if (!wrap || !rail) return;

        const topOffsetPx = computeTopOffsetPx();
        setFixedTop(topOffsetPx);

        const scrollY = window.scrollY;

        // document Y positions
        const wrapTop = wrap.getBoundingClientRect().top + scrollY;
        const railH = rail.offsetHeight;

        // if no footer, behave like normal fixed-after-start
        let footerTop = Number.POSITIVE_INFINITY;
        if (footerEl) {
            footerTop = footerEl.getBoundingClientRect().top + scrollY;
        }

        // When we must stop (rail bottom should not go into footer)
        const stopY = footerTop - railH - bottomGap;

        // Start sticking when wrapper top hits the topOffset
        const startStickY = wrapTop - topOffsetPx;

        if (scrollY < startStickY) {
            setMode("relative");
            setStoppedTop(0);
            return;
        }

        if (scrollY >= stopY - topOffsetPx) {
            // STOP: position absolute within wrapper
            setMode("stopped");
            setStoppedTop(Math.max(0, stopY - wrapTop));
            return;
        }

        // Normal stick
        setMode("fixed");
        setStoppedTop(0);
    }, [bottomGap, computeTopOffsetPx, footerRef]);

    React.useEffect(() => {
        recompute();

        const onScroll = () => recompute();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        // watch size changes (hover flyout can change height)
        const ro = new ResizeObserver(() => recompute());
        if (railRef.current) ro.observe(railRef.current);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            ro.disconnect();
        };
    }, [recompute]);

    // also recompute when hover changes (flyout open changes height)
    React.useEffect(() => {
        recompute();
    }, [hovered, recompute]);

    const outerStyle: React.CSSProperties =
        mode === "fixed"
            ? { position: "fixed", top: fixedTop, width: 256, zIndex: 60 }
            : mode === "stopped"
                ? { position: "absolute", top: stoppedTop, width: 256, zIndex: 60 }
                : { position: "relative", width: 256 };

    // Flyout should match the left panel's vertical behavior
    const flyoutStyle: React.CSSProperties =
        mode === "fixed"
            ? { position: "fixed", top: fixedTop, left: "calc(50% - 24rem)", zIndex: 70 } // overridden below by container math
            : mode === "stopped"
                ? { position: "absolute", top: stoppedTop, left: 256 + 12, zIndex: 70 }
                : { position: "absolute", top: 0, left: 256 + 12, zIndex: 70 };

    /**
     * NOTE:
     * We don’t hardcode flyout "left" as viewport-based.
     * Instead we anchor it to the wrapper using a second element that sits next to rail.
     * So we’ll render flyout as a sibling with "absolute" under wrapper,
     * BUT when mode=fixed we make it fixed and compute its left from wrapper rect.
     */
    const [flyoutLeft, setFlyoutLeft] = React.useState<number>(0);

    React.useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const calc = () => {
            const r = wrap.getBoundingClientRect();
            // wrapper’s left in viewport + rail width + gap
            setFlyoutLeft(r.left + 256 + 12);
        };

        calc();
        window.addEventListener("scroll", calc, { passive: true });
        window.addEventListener("resize", calc);
        return () => {
            window.removeEventListener("scroll", calc);
            window.removeEventListener("resize", calc);
        };
    }, [mode]);

    const flyoutFinalStyle: React.CSSProperties =
        mode === "fixed"
            ? { position: "fixed", top: fixedTop, left: flyoutLeft, width: 256, zIndex: 70 }
            : { ...flyoutStyle, width: 256 };

    return (
        <div ref={wrapRef} className="relative">
            <style jsx>{scrollbarNone}</style>

            {/* LEFT */}
            <div style={outerStyle}>
                <div
                    ref={railRef}
                    className="w-64 rounded-2xl border bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-[#2D3236]"
                >
                    {/* Top / Bottom buttons */}
                    {categoryScroll.showUp && (
                        <button
                            onClick={categoryScroll.toTop}
                            className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-l from-orange-400 to-orange-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg"
                        >
                            ↑ Top
                        </button>
                    )}

                    {categoryScroll.showDown && (
                        <button
                            onClick={categoryScroll.toBottom}
                            className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-l from-orange-400 to-orange-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg"
                        >
                            ↓ Bottom
                        </button>
                    )}

                    <div className="border-b p-2 dark:border-gray-600">
                        <h2 className="text-sm font-extrabold">Categories</h2>
                    </div>

                    {/* internal scroll */}
                    <div
                        ref={categoryScroll.scrollRef}
                        className="scrollbar-none h-[450px] w-full overflow-y-auto"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {tree.map((category) => {
                            const isActive = hovered === category.name;

                            // ✅ default subcategory = first subcategory (fallback to category itself)
                            const defaultName =
                                category?.subcategories?.length ? category.subcategories[0].name : category.name;

                            const href = `/${toListingSlugFromName(defaultName)}`;

                            return (
                                <div
                                    key={category.id}
                                    onMouseEnter={() => setHovered(category.name)}
                                    className={cn(
                                        "relative flex items-center gap-2 border-b p-2 text-left text-sm",
                                        "hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-[#131B1E]",
                                        isActive && "bg-slate-50 dark:bg-[#131B1E]"
                                    )}
                                >
                                    {/* ✅ clickable overlay: category row click -> default subcategory page */}
                                    <a
                                        href={href}
                                        aria-label={`Open ${category.name}`}
                                        className="absolute inset-0 z-[1]"
                                    />

                                    {/* content above overlay */}
                                    <div className="relative z-[2] pointer-events-none flex w-full items-center gap-2">
                                        <IconCircle src={category.icon} alt={category.name} />

                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-xs font-extrabold">{category.name}</div>
                                            <div className="text-[11px] text-slate-500">{category.count} ads</div>
                                        </div>

                                        <div className="text-slate-400">›</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* reserve space in normal flow so main column doesn't jump */}
            <div className="h-[1px]" style={{ height: 0 }} />

            {/* RIGHT flyout */}
            {showSub && (
                <div
                    className="rounded-2xl border bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-[#2D3236]"
                    style={flyoutFinalStyle}
                    onMouseEnter={() => setHovered(activeCat.name)}
                    onMouseLeave={() => setHovered("")}
                >
                    <div className="border-b p-2 dark:border-gray-600">
                        <h2 className="text-sm font-extrabold">{activeCat.name}</h2>
                    </div>

                    {subcategoryScroll.showUp && (
                        <button
                            onClick={subcategoryScroll.toTop}
                            className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-l from-orange-400 to-orange-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg"
                        >
                            ↑ Top
                        </button>
                    )}

                    {subcategoryScroll.showDown && (
                        <button
                            onClick={subcategoryScroll.toBottom}
                            className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-l from-orange-400 to-orange-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg"
                        >
                            ↓ Bottom
                        </button>
                    )}

                    <div
                        ref={subcategoryScroll.scrollRef}
                        className="scrollbar-none h-[450px] w-full overflow-y-auto"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {activeCat.subcategories?.length ? (
                            activeCat.subcategories.map((sub: any) => (
                                <a
                                    key={sub.id}
                                    href={`/${toListingSlugFromName(sub.name)}`}
                                    className="flex items-center gap-2 border-b p-2 hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-[#131B1E]"
                                >
                                    <IconCircle src={sub.icon || null} alt={sub.name} />

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-extrabold">{sub.name}</div>
                                        <div className="text-[11px] text-slate-500">{sub.count} ads</div>
                                    </div>

                                    <div className="text-slate-400">›</div>
                                </a>
                            ))
                        ) : (
                            <div className="p-3 text-sm text-slate-500">No subcategories yet.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}