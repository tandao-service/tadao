import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import AppDeepLinkHandler from "@/components/shared/AppDeepLinkHandler";
import SplashHandler from "@/components/shared/SplashHandler";
import OAuthCallbackPage from "@/components/shared/OAuthCallbackPage";

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

  return (
    <ClerkProvider
    >
      <html lang="en">
        <body className={poppins.variable}>
          <SplashHandler />
          {/*<OAuthCallbackPage />*/}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
