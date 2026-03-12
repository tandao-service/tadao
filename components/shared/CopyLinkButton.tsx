"use client";

import React, { useState } from "react";

type Props = {
    url: string;
    className?: string;
    children?: React.ReactNode;
};

export default function CopyLinkButton({ url, className, children }: Props) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // fallback (older browsers)
            try {
                const ta = document.createElement("textarea");
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
            } catch { }
        }
    };

    return (
        <button type="button" onClick={copy} className={className}>
            {copied ? "Copied ✓" : children ?? "Copy link"}
        </button>
    );
}