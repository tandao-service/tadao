import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import Script from "next/script";
import CapacitorSplash from "@/components/shared/CapacitorSplash";
import { AuthProvider } from "./hooks/useAuth";
import SplashHandler from "@/components/shared/SplashHandler";
=======
import { AuthProvider } from "./hooks/useAuth";
import TopProgressBar from "@/components/home/TopProgressBar";

>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tadaomarket.com"),
  title: {
    default: "Tadao Market - Buy & Sell Anything in Kenya",
    template: "%s | Tadao Market",
  },
  description: "Buy & Sell Anything, Anytime, Anyplace",
  icons: { icon: "/logo.png" },
  themeColor: "#f97316",
  openGraph: {
    title: "Tadao Market — Buy & Sell Anything in Kenya",
    description: "Discover and sell a wide range of goods. Simple, secure, and local.",
    url: "https://tadaomarket.com",
    siteName: "Tadao Market",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tadao Market - Buy & Sell Anything in Kenya",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
<<<<<<< HEAD
        <SplashHandler />
        <AuthProvider>{children}</AuthProvider>
=======
        <TopProgressBar height={3} colorClassName="bg-orange-500" />
        <AuthProvider>

          {children}

        </AuthProvider>
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
      </body>
    </html>
  );
}
