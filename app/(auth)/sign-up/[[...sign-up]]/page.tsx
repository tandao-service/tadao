import { Capacitor } from "@capacitor/core";
import { SignUp } from "@clerk/nextjs";

export default function Page() {

  const isNative = Capacitor.isNativePlatform();
  const redirectUri = isNative
    ? "tadaomarket://callback"
    : "https://tadaomarket.com";

  return <SignUp
    routing="path"
    path="/SignUp"
    fallbackRedirectUrl={redirectUri}     // ✅ replaces redirectUrl
    forceRedirectUrl={redirectUri}        // ✅ ensures deep link always used on mobile/>;
  />
}
