"use client";

import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { useRouter } from "next/navigation";
import { getAuthSafe } from "@/lib/firebase"; // your safe auth loader
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { createUser as createUserInDB } from "@/lib/actions/user.actions";

export default function AppDeepLinkHandler() {
    const router = useRouter();
    const [authBundle, setAuthBundle] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const bundle = await getAuthSafe();
            setAuthBundle(bundle);
        })();
    }, []);

    useEffect(() => {
        if (!authBundle) return;

        const listenerPromise = App.addListener("appUrlOpen", async (data: any) => {
            console.log("Deep link opened:", data.url);

            try {
                // Check if URL matches your Google callback
                if (data.url.startsWith("com.tadaomarket.app://callback")) {
                    // Parse the access_token from the fragment (#access_token=...)
                    const hash = data.url.split("#")[1]; // get fragment part
                    const params = new URLSearchParams(hash);
                    const accessToken = params.get("access_token");

                    if (!accessToken) {
                        console.error("No access_token found in URL");
                        return;
                    }

                    // Create Firebase credential
                    const credential = GoogleAuthProvider.credential(null, accessToken);

                    // Sign in to Firebase
                    const { auth } = authBundle;
                    const result: any = await signInWithCredential(auth, credential);
                    const user = result.user;

                    console.log("Signed in user:", user);

                    // Check if user exists in your DB and create if new
                    if (result?._tokenResponse?.isNewUser) {
                        await createUserInDB({
                            clerkId: user.uid,
                            email: user.email || "",
                            firstName: user.displayName?.split(" ")[0] || "",
                            lastName: user.displayName?.split(" ")[1] || "",
                            photo: user.photoURL || "",
                            status: "User",
                            verified: [{ accountverified: false, verifieddate: new Date() }],
                        });
                    }

                    // Redirect to home or wherever you want
                    router.push("/");
                }
            } catch (err) {
                console.error("Error handling deep link:", err);
            }
        });

        return () => {
            listenerPromise.then((l) => l.remove());
        };
    }, [authBundle]);

    return null;
}
