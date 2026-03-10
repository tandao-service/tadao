"use client"
import Navbar from "@/components/shared/navbar";
import SettingsEdit from "@/components/shared/SettingsEdit";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import Verification from "@/components/shared/Verification";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import Head from "next/head";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  userId: string;
  user: any;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId: any) => void;
}

const AboutComponent = ({
  userId,
  user,
  onClose,
  handleOpenSell,
  handleOpenBook,
  handleOpenChat,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPlan,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
}: Props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode;
    const isDark = savedTheme === mode;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;
    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null;

  return (
    <div className="h-[100vh] bg-gray-100 p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] overflow-hidden">
      <div className="h-full overflow-y-auto bg-gray-100 border">
        <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>
        <Head>
          <title>About Tadao Market | Kenya&apos;s Smart Marketplace</title>
          <meta
            name="description"
            content="Learn about tadaomarket.com, Kenya's growing marketplace for online shopping and product listings. From electronics to home goods, we make buying and selling seamless."
          />
          <meta property="og:title" content="About tadaomarket.com | Kenya's Smart Marketplace" />
          <meta
            property="og:description"
            content="At Tadao Market, we connect buyers and sellers across diverse categories with transparency and convenience."
          />
          <meta property="og:image" content="/assets/images/logo.png" />
          <meta property="og:url" content="https://tadaomarket.com/about" />
          <meta property="og:type" content="website" />
          <meta name="keywords" content="Tadao Market, online shopping Kenya, sell products, e-commerce, buy online" />
          <meta name="author" content="Tadao Market" />
        </Head>

        <div className="top-0 z-10 fixed w-full">
          <Navbar
            user={user}
            userstatus={user.status}
            userId={userId}
            onClose={onClose}
            popup={"about"}
            handleOpenSell={handleOpenSell}
            handleOpenBook={handleOpenBook}
            handleOpenPlan={handleOpenPlan}
            handleOpenChat={handleOpenChat}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            handleOpenShop={handleOpenShop}
          />
        </div>

        <div className="max-w-3xl mx-auto flex mt-[60px] p-1">
          <div className="flex-1">
            <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
              <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold dark:text-gray-400 text-gray-800 mb-6 text-center">
                  About Tadao Market
                </h1>

                <div className="space-y-6 dark:text-gray-300 text-gray-700">
                  <p className="text-lg">
                    Welcome to <span className="font-semibold text-orange-500">Tadao Market</span>, Kenya&apos;s growing online
                    marketplace for discovering and selling a wide range of goods. From home appliances and electronics to fashion,
                    books, beauty products, and much more - we&apos;re here to simplify your online shopping experience.
                  </p>

                  <div>
                    <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">Our Mission</h2>
                    <p>
                      Our mission at tadaomarket.com is to empower Kenyans with a simple, secure, and smart way to shop and sell
                      online. We believe everyone should have access to a modern digital marketplace that is trustworthy and easy to use.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                      Why Tadao Market?
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><span className="font-semibold">Broad Categories</span>: From everyday items to specialty goods, find it all in one place.</li>
                      <li><span className="font-semibold">Trusted Listings</span>: We promote accurate product descriptions and fair transactions.</li>
                      <li><span className="font-semibold">Secure Platform</span>: We prioritize your safety with industry-standard security and clear guidelines.</li>
                      <li><span className="font-semibold">Quick Communication</span>: Sellers and buyers can chat directly and close deals faster.</li>
                      <li><span className="font-semibold">Community Support</span>: Join a growing ecosystem of sellers, shoppers, and local businesses.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">Our Journey</h2>
                    <p>
                      Tadao Market was created with the goal of uplifting online commerce in Kenya. Since our start, we&apos;ve grown by
                      listening to our users and delivering a reliable and evolving marketplace platform.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">Be a Part of Us</h2>
                    <p>
                      Whether you&apos;re a small business, reseller, or buyer looking for quality and value - Tadao Market is made for you.
                      Thank you for supporting our vision to build a smarter marketplace in Kenya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <Footersub
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
          />
        </footer>
      </div>
    </div>
  );
};

export default AboutComponent;
