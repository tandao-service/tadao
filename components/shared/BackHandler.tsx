"use client";

import { useEffect, useRef } from "react";
import { useToast } from "../ui/use-toast";

export default function BackHandler() {
    const exitPromptShown = useRef(false);
    const { toast } = useToast();
    useEffect(() => {
        const handleBack = () => {
            if (window.location.pathname === "/") {
                if (!exitPromptShown.current) {
                    alert("MAIN Press back again to exit"); // Replace with toast/snackbar

                    toast({
                        title: "Exit App",
                        description: "Press back again to exit",
                        duration: 5000,
                        className: "bg-[#30AF5B] text-white",
                    });
                    exitPromptShown.current = true;

                    setTimeout(() => {
                        exitPromptShown.current = false;
                    }, 2000);
                } else {
                    //  window.close(); // Works inside TWA
                    alert("window closed"); // Replace with toast/snackbar
                }
            }
        };

        window.addEventListener("popstate", handleBack);

        return () => {
            window.removeEventListener("popstate", handleBack);
        };
    }, []);

    return null; // nothing to render
}
