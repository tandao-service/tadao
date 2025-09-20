"use client";

import { useEffect } from "react";
import { registerPlugin } from "@capacitor/core";
// Optional: if you still want to hide the Capacitor SplashScreen when present
// import { SplashScreen } from "@capacitor/splash-screen";

type SplashSwapPlugin = {
    showWeb: () => Promise<void>;
};
const SplashSwap = registerPlugin<SplashSwapPlugin>("SplashSwap");

export default function SplashHandler() {
    useEffect(() => {
        const showWebViewNow = async () => {
            try {
                // If you ALSO use Capacitor SplashScreen somewhere, hide it first (optional)
                // await SplashScreen.hide();

                // IMPORTANT: Only call this when your app is actually ready:
                // - document loaded
                // - fonts set
                // - any critical initial data fetched, etc.
                await SplashSwap.showWeb();
            } catch (err) {
                console.warn("Failed to swap to webview:", err);
            }
        };

        // Wait for full page load to ensure Next.js has painted
        if (document.readyState === "complete") {
            showWebViewNow();
        } else {
            window.addEventListener("load", showWebViewNow);
            return () => window.removeEventListener("load", showWebViewNow);
        }
    }, []);

    return null;
}
