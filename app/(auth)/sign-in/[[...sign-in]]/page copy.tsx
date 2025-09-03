import { Capacitor } from "@capacitor/core";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const isNative = Capacitor.isNativePlatform();
  const redirectUri = isNative
    ? "https://tadaomarket.com/oauth/callback"
    : "https://tadaomarket.com";

  return (
    <SignIn
      routing="path"
      path="/sign-in"
      fallbackRedirectUrl={redirectUri}     // ✅ replaces redirectUrl

    />
  );
}
