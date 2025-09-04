"use client";

import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getRedirectUrl() {
      const res = await fetch("/api/auth/redirect");
      const data = await res.json();
      setRedirectUrl(data.redirectUrl);
    }
    getRedirectUrl();
  }, []);

  if (!redirectUrl) {
    return <p>Loading sign-in…</p>;
  }

  return <SignIn forceRedirectUrl={redirectUrl} />;
}
