"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
    height?: number;         // px
    colorClassName?: string; // tailwind bg class
};

export default function TopProgressBar({
    height = 3,
    colorClassName = "bg-blue-500",
}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [visible, setVisible] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const timerRef = React.useRef<number | null>(null);
    const doneRef = React.useRef<number | null>(null);

    // Build a “route key” that changes on navigation + query changes
    const key = React.useMemo(() => {
        const sp = searchParams?.toString() || "";
        return `${pathname}?${sp}`;
    }, [pathname, searchParams]);

    const clearTimers = React.useCallback(() => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        if (doneRef.current) window.clearTimeout(doneRef.current);
        timerRef.current = null;
        doneRef.current = null;
    }, []);

    React.useEffect(() => {
        // Start loading whenever URL changes
        clearTimers();
        setVisible(true);
        setProgress(10);

        // Smooth fake progress (like Google)
        timerRef.current = window.setInterval(() => {
            setProgress((p) => {
                // Ease out: approach 90% but never reach
                const next = p + (100 - p) * 0.06;
                return Math.min(next, 90);
            });
        }, 120);

        // When navigation is “done” (we are already on new URL),
        // finish the bar quickly then hide.
        doneRef.current = window.setTimeout(() => {
            clearTimers();
            setProgress(100);

            // hide after a short moment
            window.setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 250);
        }, 350);

        return () => clearTimers();
    }, [key, clearTimers]);

    if (!visible) return null;

    return (
        <div className="fixed inset-x-0 top-0 z-[9999]">
            <div
                className={`w-full ${colorClassName}`}
                style={{
                    height,
                    transform: `translateX(${progress - 100}%)`,
                    transition: "transform 120ms linear, opacity 200ms ease",
                    willChange: "transform",
                }}
            />
        </div>
    );
}