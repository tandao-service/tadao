"use client"
import Navbar from "@/components/shared/navbar";
import SettingsEdit from "@/components/shared/SettingsEdit";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@clerk/nextjs/server";
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

const SafetyComponent = ({ userId, user, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenSell, handleOpenBook, handleOpenChat, handleOpenPlan, onClose, handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety }: Props) => {
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
          <title>Safety Tips | Tadao</title>
          <meta name="description" content="Stay safe while buying or selling on tadaomarket.com. Follow our safety tips to protect yourself and ensure secure transactions." />
          <meta name="keywords" content="Tadao, safety tips, secure buying, safe selling, online safety, marketplace safety" />
          <meta property="og:title" content="Safety Tips | tadaomarket.com" />
          <meta property="og:description" content="Follow these essential safety tips to protect yourself while using tadaomarket.com." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.tadaomarket.com/safety" />
          <meta property="og:image" content="https://www.tadaomarket.com/assets/images/safety-tips-cover.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Safety Tips | tadaomarket.com" />
          <meta name="twitter:description" content="Learn how to stay safe while buying or selling on tadaomarket.com with our detailed safety guidelines." />
          <meta name="twitter:image" content="https://www.tadaomarket.com/assets/images/safety-tips-cover.jpg" />
          <link rel="canonical" href="https://www.tadaomarket.com/safety" />
        </Head>

        <div className="top-0 z-10 fixed w-full">
          <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"safety"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenPerfomance={handleOpenPerfomance} handleOpenSettings={handleOpenSettings} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenShop={handleOpenShop} />
        </div>

        <div className="max-w-3xl mx-auto flex mt-[60px] p-1">
          <div className="flex-1">
            <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto p-1">
              <div className="max-w-3xl mx-auto p-6">
                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">Safety Tips for Tadao Users</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">For Sellers:</h3>
                    <ul className="list-disc pl-6 space-y-2 dark:text-gray-300 text-gray-700">
                      <li><strong>Verify Buyer Identity:</strong> Request and confirm the buyer&apos;s contact details before any physical meetup.</li>
                      <li><strong>Choose Public Meeting Points:</strong> Always meet in public, secure locations like shopping malls or police stations.</li>
                      <li><strong>Bring Someone Along:</strong> Never attend a meeting alone — always go with someone you trust.</li>
                      <li><strong>Keep Personal Info Private:</strong> Avoid sharing your address or sensitive financial information.</li>
                      <li><strong>Confirm Payment Before Handing Over:</strong> Ensure you receive full payment before releasing the product.</li>
                      <li><strong>Use Written Agreements:</strong> For expensive items, consider having a basic written agreement.</li>
                      <li><strong>Trust Your Instincts:</strong> If anything feels off, postpone or cancel the transaction.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#BD7A4F] mb-2">For Buyers:</h3>
                    <ul className="list-disc pl-6 space-y-2 dark:text-gray-300 text-gray-700">
                      <li><strong>Check the Seller&apos;s Profile:</strong> Be cautious of new accounts or incomplete profiles.</li>
                      <li><strong>Inspect Before Purchase:</strong> Physically examine the item and verify ownership documents where applicable.</li>
                      <li><strong>Public Meetups Only:</strong> Avoid going to someone&apos;s home or allowing them into yours.</li>
                      <li><strong>No Advance Payments:</strong> Never send money before seeing and confirming the item.</li>
                      <li><strong>Use Trusted Payment Methods:</strong> Choose secure platforms such as mobile money or bank transfer.</li>
                      <li><strong>Ask Questions:</strong> Clarify all product details before the meetup to avoid surprises.</li>
                      <li><strong>Report Suspicious Activity:</strong> Let us know if you suspect any scam or unusual behavior.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <Footersub handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} />
        </footer>
      </div>
    </div>
  );
};
export default SafetyComponent;
