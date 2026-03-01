"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileBackPill({
    topCss = "calc(var(--topbar-h, 64px) + 10px)",
    label = "Back",
}: {
    topCss?: string;
    label?: string;
}) {
    const router = useRouter();
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 140);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const goBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push("/");
    };

    return (
        <div
            className={cn(
                "md:hidden fixed left-3 z-[650] transition-all duration-200",
                show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
            style={{ top: topCss }}
        >
            <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-2 rounded-full border bg-white/95 px-3 py-2 text-sm font-extrabold text-slate-800 shadow-md backdrop-blur hover:bg-orange-50"
            >
                <ArrowLeft className="h-4 w-4" />
                {label}
            </button>
        </div>
    );
}