"use client";

import React, { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

type Props = {
    url: string;
    title?: string;
    text?: string;
    className?: string;
    children?: React.ReactNode;
};

export default function CopyLinkButton({
    url,
    title = "Tadao Market",
    text = "Check this out on Tadao Market",
    className,
    children,
}: Props) {
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);

    const showCopied = () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
    };

    const copyFallback = async () => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                showCopied();
                return true;
            }
        } catch { }

        try {
            const ta = document.createElement("textarea");
            ta.value = url;
            ta.setAttribute("readonly", "true");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            ta.style.pointerEvents = "none";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(ta);

            if (ok) {
                showCopied();
                return true;
            }
        } catch { }

        return false;
    };

    const handleShare = async () => {
        if (!url || sharing) return;

        setSharing(true);

        try {
            // Native Capacitor app: use native share sheet
            if (Capacitor.isNativePlatform()) {
                await Share.share({
                    title,
                    text,
                    url,
                    dialogTitle: "Share ad",
                });
                return;
            }

            // Browser/mobile web: use Web Share API where available
            if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                await navigator.share({
                    title,
                    text,
                    url,
                });
                return;
            }

            // Desktop/older browsers fallback
            await copyFallback();
        } catch (error: any) {
            const msg = String(error?.message || "").toLowerCase();

            // User closed share dialog: do nothing
            if (
                msg.includes("cancel") ||
                msg.includes("abort") ||
                msg.includes("dismiss")
            ) {
                return;
            }

            await copyFallback();
        } finally {
            setSharing(false);
        }
    };

    return (
        <button type="button" onClick={handleShare} className={className}>
            {copied ? "Copied ✓" : children ?? "Share"}
        </button>
    );
}