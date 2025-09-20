import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import CapacitorSplash from "@/components/shared/CapacitorSplash";
import { AuthProvider } from "./hooks/useAuth";
import SplashHandler from "@/components/shared/SplashHandler";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Tadao Market",
  description: "Buy & Sell Anything, Anytime, Anyplace",
  icons: { icon: "/logo.png" },
  // Helps status bar & splash blend on Android
  themeColor: "#f97316",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <SplashHandler />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
