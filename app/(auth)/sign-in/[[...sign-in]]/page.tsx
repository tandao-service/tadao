"use client";

import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const isNative = Capacitor.isNativePlatform();
  const redirectUri = isNative
    ? "https://tadaomarket.com/oauth/callback" // ✅ handled inside your app
    : "https://tadaomarket.com";

  const handleGoogleLogin = async () => {
    if (isNative) {
      // Open Clerk OAuth Google strategy in system browser
      await Browser.open({
        url: `https://clerk.tadaomarket.com/v1/oauth/native/google?redirect_url=${encodeURIComponent(
          redirectUri
        )}`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Default Clerk SignIn for web */}
      {!isNative && (
        <SignIn
          routing="path"
          path="/sign-in"
          fallbackRedirectUrl={redirectUri}
        />
      )}

      {/* Custom Google login button for Capacitor */}
      {isNative && (
        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Continue with Google
        </button>
      )}
    </div>
  );
}
