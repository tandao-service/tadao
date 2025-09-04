"use client";

import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { Capacitor } from "@capacitor/core";

export default function SignInPage() {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) return; // Only fetch for native

    async function getRedirectUrl() {
      try {
        const res = await fetch("/api/auth/redirect");
        if (!res.ok) throw new Error("Failed to fetch redirect");
        const data = await res.json();
        setRedirectUrl(data.redirectUrl);
      } catch (err) {
        console.error("Redirect API failed, falling back:", err);
        setRedirectUrl("myapp://callback"); // fallback deep link for native
      }
    }

    getRedirectUrl();
  }, [isNative]);

  // Native needs redirectUrl before rendering Clerk
  if (isNative && !redirectUrl) {
    return <p>Loading sign-in…</p>;
  }

  // Web: no forceRedirectUrl (Clerk uses dashboard default)
  // Native: pass forceRedirectUrl
  return (
    <SignIn {...(isNative ? { forceRedirectUrl: redirectUrl! } : {})} />
  );
}
