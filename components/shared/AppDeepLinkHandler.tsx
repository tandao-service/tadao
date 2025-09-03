"use client";
import { App } from "@capacitor/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppDeepLinkHandler() {
    const router = useRouter();

    useEffect(() => {
        const listener = App.addListener("appUrlOpen", (data: any) => {
            console.log("Deep link opened:", data.url);

            if (data.url.startsWith("https://tadaomarket.com/oauth/callback")) {
                const url = new URL(data.url);
                router.push(`/oauth/callback${url.search}`);
            }
        });

        return () => {
            listener.then((l) => l.remove());
        };
    }, []);

    return null;
}
