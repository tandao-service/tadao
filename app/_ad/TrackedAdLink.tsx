"use client";

import Link from "next/link";
import { incrementAdMetric } from "@/lib/actions/dynamicAd.actions";

type Metric = "calls" | "whatsapp" | "inquiries" | "shared";

export default function TrackedAdLink({
    adId,
    metric,
    href,
    children,
    className,
    target,
    rel,
}: {
    adId: string;
    metric: Metric;
    href: string;
    children: React.ReactNode;
    className?: string;
    target?: string;
    rel?: string;
}) {
    const handleClick = async () => {
        try {
            await incrementAdMetric(adId, metric);
        } catch (error) {
            console.error("Metric update failed:", error);
        }
    };

    if (href.startsWith("/")) {
        return (
            <Link href={href} onClick={handleClick} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <a
            href={href}
            onClick={handleClick}
            className={className}
            target={target}
            rel={rel}
        >
            {children}
        </a>
    );
}