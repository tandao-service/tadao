"use client";

import { useEffect } from "react";
import { SplashScreen } from "@capacitor/splash-screen";

export default function SplashHandler() {
    useEffect(() => {
        const hideSplash = async () => {
            try {
                await SplashScreen.hide();
            } catch (err) {
                console.warn("Splash hide failed:", err);
            }
        };

        if (document.readyState === "complete") {
            hideSplash();
        } else {
            window.addEventListener("load", hideSplash);
            return () => window.removeEventListener("load", hideSplash);
        }
    }, []);

    return null; // nothing to render
}
