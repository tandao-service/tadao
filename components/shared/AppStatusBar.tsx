import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function AppStatusBar() {
    useEffect(() => {
        const setBar = async () => {
            await StatusBar.setBackgroundColor({ color: "#f97316" });
            await StatusBar.setStyle({ style: Style.Light });
            // Light = white icons, Dark = black icons
        };

        setBar();
    }, []);

    return null;
}
