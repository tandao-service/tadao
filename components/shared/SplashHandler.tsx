"use client";

import { useEffect } from "react";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";

export default function SplashHandler() {
    useEffect(() => {
        const hideSplash = async () => {
            if (Capacitor.isNativePlatform()) {
                try {
                    await SplashScreen.hide();
                } catch (err) {
                    console.warn("Splash hide failed:", err);
                }
            }
        };

        // Hide splash when React mounts (means UI is ready)
        hideSplash();
    }, []);

    return null;
}
