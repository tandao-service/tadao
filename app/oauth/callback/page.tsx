"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function OAuthCallbackPage() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            // Successful login → go home
            router.replace("/");
        } else {
            // Failed or canceled login → go back to sign-in page
            router.replace("/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    return <p>Finishing sign-in…</p>;
}
