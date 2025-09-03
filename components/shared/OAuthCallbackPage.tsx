"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        await handleRedirectCallback({
          redirectUrl: "/",       // where to go after success
          afterSignInUrl: "/",    // optional override
          afterSignUpUrl: "/",    // optional override
        });
        router.push("/"); // fallback
      } catch (err) {
        console.error("OAuth callback failed:", err);
        router.push("/sign-in?error=oauth_failed");
      }
    };

    completeAuth();
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Completing sign in…</p>
    </div>
  );
}

