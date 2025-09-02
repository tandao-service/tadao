"use client";
import { App } from "@capacitor/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppDeepLinkHandler() {
    const router = useRouter();

    useEffect(() => {
        App.addListener("appUrlOpen", (data: any) => {
            const url = data.url; // e.g. tadaomarket://ad/123
            console.log("Deep link opened:", url);

            try {
                const path = new URL(url).pathname; // "/ad/123"
                router.push(path); // Navigate inside Next.js
            } catch (err) {
                console.error("Error parsing deep link:", err);
            }
        });
    }, []);

    return null;
}
