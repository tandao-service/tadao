import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import AppDeepLinkHandler from "@/components/shared/AppDeepLinkHandler";
import { Capacitor } from "@capacitor/core";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Tadao",
  description: "Tadao | Buy and Sell Online in Kenya",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detect platform
  const isNative = Capacitor.isNativePlatform();

  const redirectUri = isNative
    ? "tadaomarket://callback"
    : process.env.NEXT_PUBLIC_CLERK_REDIRECT_URI || "https://tadaomarket.com";

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl={redirectUri}   // ✅ new API
      signUpFallbackRedirectUrl={redirectUri}   // ✅ new API
    >
      <html lang="en">
        <body className={poppins.variable}>
          <AppDeepLinkHandler />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
