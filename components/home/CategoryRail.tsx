"use client";

import * as React from "react";
import Image from "next/image";
import type { HomeCategoryNode } from "@/lib/home/home.categories";
import { cn } from "@/lib/utils";

/* ---------------- helpers ---------------- */

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

function toListingSlugFromName(name: string, categoryName?: string) {
    const base = stripIntent(name);

    if (
        slugify(categoryName || "") === "financing" ||
        slugify(base) === "assets-financing"
    ) {
        return slugify(base);
    }

    const mode = detectMode(name);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";

    return `${slugify(base)}-${suffix}`;
}

const scrollbarThin = `
  .scrollbar-thin::-webkit-scrollbar { width: 6px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
`;

function IconCircle({ src, alt }: { src?: string | null; alt: string }) {
    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-[#131B1E]">
            {src ? (
                <Image
                    className="h-7 w-7 rounded-md object-cover"
                    src={src}
                    alt={alt}
                    width={60}
                    height={60}
                    unoptimized
                />
            ) : (
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-slate-100 to-slate-200" />
            )}
        </div>
    );
}

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
    }, deps);

    return { scrollRef, showUp, showDown, toTop, toBottom };
}

/* ---------------- types ---------------- */

type Props = {
    tree: HomeCategoryNode[];
    compact?: boolean;
    footerRef?: React.RefObject<HTMLElement | null>;
    topOffsetCssVar?: string;
    topGap?: number;
    bottomGap?: number;
};

/* ---------------- compact component ---------------- */

function CategoryRailCompact({ tree }: { tree: HomeCategoryNode[] }) {
    return (
        <div className="rounded-2xl bg-white p-2 lg:border lg:p-3 dark:border-gray-700 dark:bg-[#2D3236]">
            <div className="flex items-center justify-between">
                <div className="text-[15px] font-semibold text-slate-800">
                    Categories
                </div>
                <div className="text-[12px] font-medium text-slate-500">
                    {tree.length} groups
                </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
                {tree.map((c) => (
                    <a
                        key={c.id}
                        href={`/${slugify(c.name)}`}
                        className={cn(
                            "group rounded-2xl border bg-white p-3 text-center shadow-sm transition",
                            "hover:border-orange-300 hover:bg-orange-100 hover:shadow-md",
                            "dark:border-gray-700 dark:bg-[#2D3236] dark:hover:bg-orange-950/40"
                        )}
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200 group-hover:bg-orange-200 group-hover:ring-orange-300 dark:bg-[#131B1E] dark:ring-gray-700">
                            {c.icon ? (
                                <Image
                                    src={c.icon}
                                    alt={c.name}
                                    width={80}
                                    height={80}
                                    className="h-10 w-10 object-contain"
                                    unoptimized
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-[#1f2427] dark:to-[#131B1E]" />
                            )}
                        </div>

                        <div className="mt-2 truncate text-[13px] font-semibold text-slate-800 dark:text-white">
                            {c.name}
                        </div>

                        <div className="mt-0.5 text-[12px] font-normal text-slate-500">
                            {Number(c.count || 0).toLocaleString()} ads
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ---------------- desktop component ---------------- */

function CategoryRailDesktop({
    tree,
    footerRef,
    topOffsetCssVar = "--topbar-h",
    topGap = 12,
    bottomGap = 12,
}: Omit<Props, "compact">) {
    const [hovered, setHovered] = React.useState<string>("");

    const wrapRef = React.useRef<HTMLDivElement>(null);
    const railRef = React.useRef<HTMLDivElement>(null);

    const [mode, setMode] = React.useState<"relative" | "fixed" | "stopped">("relative");
    const [fixedTop, setFixedTop] = React.useState<number>(76);
    const [stoppedTop, setStoppedTop] = React.useState<number>(0);

    const categoryScroll = useScrollButtons();
    const subcategoryScroll = useScrollButtons([hovered]);

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
        const wrapTop = wrap.getBoundingClientRect().top + scrollY;
        const railH = rail.offsetHeight;

        let footerTop = Number.POSITIVE_INFINITY;
        if (footerEl) footerTop = footerEl.getBoundingClientRect().top + scrollY;

        const stopY = footerTop - railH - bottomGap;
        const startStickY = wrapTop - topOffsetPx;

        if (scrollY < startStickY) {
            setMode("relative");
            setStoppedTop(0);
            return;
        }

        if (scrollY >= stopY - topOffsetPx) {
            setMode("stopped");
            setStoppedTop(Math.max(0, stopY - wrapTop));
            return;
        }

        setMode("fixed");
        setStoppedTop(0);
    }, [bottomGap, computeTopOffsetPx, footerRef]);

    React.useEffect(() => {
        recompute();

        const onScroll = () => recompute();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        const ro = new ResizeObserver(() => recompute());
        if (railRef.current) ro.observe(railRef.current);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            ro.disconnect();
        };
    }, [recompute]);

    React.useEffect(() => {
        recompute();
    }, [hovered, recompute]);

    const outerStyle: React.CSSProperties =
        mode === "fixed"
            ? { position: "fixed", top: fixedTop, width: 286, zIndex: 20 }
            : mode === "stopped"
                ? { position: "absolute", top: stoppedTop, width: 286, zIndex: 20 }
                : { position: "relative", width: 286 };

    const [flyoutLeft, setFlyoutLeft] = React.useState<number>(0);

    React.useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const calc = () => {
            const r = wrap.getBoundingClientRect();
            setFlyoutLeft(r.left + 286 + 10);
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
            ? {
                position: "fixed",
                top: fixedTop,
                left: flyoutLeft,
                width: 286,
                zIndex: 70,
            }
            : mode === "stopped"
                ? {
                    position: "absolute",
                    top: stoppedTop,
                    left: 286 + 10,
                    width: 286,
                    zIndex: 70,
                }
                : {
                    position: "absolute",
                    top: 0,
                    left: 286 + 10,
                    width: 286,
                    zIndex: 70,
                };

    return (
        <div ref={wrapRef} className="relative">
            <style jsx>{scrollbarThin}</style>

            <div style={outerStyle}>
                <div
                    ref={railRef}
                    className="w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-lg dark:border-gray-700 dark:bg-[#2D3236]"
                >
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-gray-600">
                        <h2 className="text-[15px] font-semibold text-slate-800">
                            Categories
                        </h2>
                    </div>

                    <div
                        ref={categoryScroll.scrollRef}
                        className="scrollbar-none h-[450px] w-full overflow-y-auto"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {tree.map((category) => {
                            const isActive = hovered === category.name;
                            const href = `/${slugify(category.name)}`;

                            return (
                                <div
                                    key={category.id}
                                    onMouseEnter={() => setHovered(category.name)}
                                    className={cn(
                                        "relative flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 text-left transition",
                                        "hover:bg-orange-100 dark:border-gray-700 dark:hover:bg-orange-950/40",
                                        isActive &&
                                        "bg-orange-100 ring-1 ring-inset ring-orange-300 dark:bg-orange-950/40"
                                    )}
                                >
                                    <a
                                        href={href}
                                        aria-label={`Open ${category.name}`}
                                        className="absolute inset-0 z-[1]"
                                    />

                                    <div className="relative z-[2] pointer-events-none flex w-full items-center gap-3">
                                        <IconCircle src={category.icon} alt={category.name} />

                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-[14px] font-semibold text-slate-800 dark:text-white">
                                                {category.name}
                                            </div>
                                            <div className="text-[12px] font-normal text-slate-500">
                                                {Number(category.count || 0).toLocaleString()} ads
                                            </div>
                                        </div>

                                        <div
                                            className={cn(
                                                "text-lg font-bold",
                                                isActive ? "text-orange-600" : "text-slate-400"
                                            )}
                                        >
                                            ›
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="h-[1px]" style={{ height: 0 }} />

            {showSub && (
                <div
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-[#2D3236]"
                    style={flyoutFinalStyle}
                    onMouseEnter={() => setHovered(activeCat.name)}
                    onMouseLeave={() => setHovered("")}
                >
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-gray-600">
                        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-white">
                            {activeCat.name}
                        </h2>
                    </div>

                    <div
                        ref={subcategoryScroll.scrollRef}
                        className="scrollbar-none h-[450px] w-full overflow-y-auto"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {activeCat.subcategories?.length ? (
                            activeCat.subcategories.map((sub: any) => (
                                <a
                                    key={sub.id}
                                    href={`/${toListingSlugFromName(sub.name, activeCat.name)}`}
                                    className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 transition hover:bg-orange-100 dark:border-gray-700 dark:hover:bg-orange-950/40"
                                >
                                    <IconCircle src={sub.icon || null} alt={sub.name} />

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[14px] font-semibold text-slate-800 dark:text-white">
                                            {sub.name}
                                        </div>
                                        <div className="text-[12px] font-normal text-slate-500">
                                            {Number(sub.count || 0).toLocaleString()} ads
                                        </div>
                                    </div>

                                    <div className="text-lg font-bold text-slate-400">›</div>
                                </a>
                            ))
                        ) : (
                            <div className="p-3 text-sm text-slate-500">
                                No subcategories yet.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------------- main export ---------------- */

export default function CategoryRail(props: Props) {
    if (!props.tree?.length) return null;

    return props.compact ? (
        <CategoryRailCompact tree={props.tree} />
    ) : (
        <CategoryRailDesktop {...props} />
    );
}