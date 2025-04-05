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
  user:any;
  handleOpenSell:() => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose:() => void;
  handleOpenAbout:() => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
handleOpenSettings: () => void;
handleOpenShop: (shopId:any) => void;
  
}

const SafetyComponent =  ({userId, user, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenSell, handleOpenBook,handleOpenChat,handleOpenPlan, onClose,handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:Props) => {
 const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

    useEffect(() => {
       const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
       const isDark = savedTheme === mode;
       
       setIsDarkMode(isDark);
       document.documentElement.classList.toggle(mode, isDark);
     }, []);
   
     useEffect(() => {
       if (isDarkMode === null) return; // Prevent running on initial mount
   
       document.documentElement.classList.toggle(mode, isDarkMode);
       localStorage.setItem("theme", isDarkMode ? "dark" : "light");
     }, [isDarkMode]);
   
     if (isDarkMode === null) return null; // Avoid flickering before state is set
   

  return (
  <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
   <Head>
      <title>Safety Tips | PocketShop.co.ke</title>
      <meta
        name="description"
        content="Stay safe while buying or selling on PocketShop.co.ke. Follow our safety tips to protect yourself and ensure a secure transaction."
      />
      <meta
        name="keywords"
        content="PocketShop, safety tips, buying, selling, secure transactions, online marketplace safety, PocketShop safety"
      />
      <meta property="og:title" content="Safety Tips | PocketShop.co.ke" />
      <meta
        property="og:description"
        content="Follow these important safety tips to protect yourself when buying or selling on PocketShop.co.ke."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.PocketShop.co.ke/safety" />
      <meta
        property="og:image"
        content="https://www.PocketShop.co.ke/assets/images/safety-tips-cover.jpg"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Safety Tips | PocketShop.co.ke" />
      <meta
        name="twitter:description"
        content="Learn how to stay safe while buying or selling on PocketShop.co.ke with our safety guidelines."
      />
      <meta
        name="twitter:image"
        content="https://www.PocketShop.co.ke/assets/images/safety-tips-cover.jpg"
      />
      <link rel="canonical" href="https://www.PocketShop.co.ke/safety" />
    </Head>

   <div className="top-0 z-10 fixed w-full">
                           <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"saftey"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                            handleOpenPerfomance={handleOpenPerfomance}
                            handleOpenSettings={handleOpenSettings}
                            handleOpenAbout={handleOpenAbout}
                            handleOpenTerms={handleOpenTerms}
                            handleOpenPrivacy={handleOpenPrivacy}
                            handleOpenSafety={handleOpenSafety} 
                            handleOpenShop={handleOpenShop}/>
                          </div>
    <div className="max-w-3xl mx-auto flex mt-[60px] p-1">
      <div className="hidden lg:inline mr-5"></div>

      <div className="flex-1">
  <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
  <div className="max-w-3xl mx-auto p-6">
  <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
    Safety Tips for PocketShop.co.ke
  </h2>

  <div className="space-y-6">
    {/* Seller Safety Tips */}
    <div>
      <h3 className="text-xl font-semibold text-orange-600 mb-2">For Sellers:</h3>
      <ul className="list-disc pl-6 space-y-2 dark:text-gray-300 text-gray-700">
        <li>
          <strong>Verify Buyer Identity:</strong> Request and confirm the buyer&apos;s phone number before sharing personal details or arranging a meeting.
        </li>
        <li>
          <strong>Meet in Safe, Public Places:</strong> Choose well-lit, crowded locations for meetings, preferably during daytime.
        </li>
        <li>
          <strong>Bring a Companion:</strong> Avoid meeting buyers alone. Bring a friend or family member for added security.
        </li>
        <li>
          <strong>Protect Your Privacy:</strong> Avoid sharing your home address or financial details. Communicate through PocketShop&apos;s messaging system.
        </li>
        <li>
          <strong>Secure Payments:</strong> Prefer cash or verified digital transfers. Avoid checks or money orders, and confirm payments before handing over the item.
        </li>
        <li>
          <strong>Keep Records:</strong> Save all messages, emails, and agreements related to the transaction for reference.
        </li>
        <li>
          <strong>Trust Your Instincts:</strong> If something seems suspicious or too good to be true, proceed with caution or walk away.
        </li>
      </ul>
    </div>

    {/* Buyer Safety Tips */}
    <div>
      <h3 className="text-xl font-semibold text-green-600 mb-2">For Buyers:</h3>
      <ul className="list-disc pl-6 space-y-2 dark:text-gray-300 text-gray-700">
        <li>
          <strong>Research the Seller:</strong> Check their profile, reviews, and activity history. Be cautious with new or unverified sellers.
        </li>
        <li>
          <strong>Inspect Before You Buy:</strong> Always examine the item in person to ensure it matches the listing description.
        </li>
        <li>
          <strong>Meet in Safe Locations:</strong> Choose public, secure places for meetings. Avoid secluded areas.
        </li>
        <li>
          <strong>Never Pay Upfront:</strong> Avoid sending money before seeing the item. Scammers often request payments in advance and disappear.
        </li>
        <li>
          <strong>Verify Ownership Documents:</strong> Ensure that the seller has legitimate ownership documents for the vehicle or item.
        </li>
        <li>
          <strong>Get a Second Opinion:</strong> If buying a vehicle, bring a trusted mechanic to inspect it for hidden issues.
        </li>
        <li>
          <strong>Use Secure Payment Methods:</strong> Opt for bank transfers or escrow services. Avoid large cash transactions when possible.
        </li>
        <li>
          <strong>Stay Alert for Scams:</strong> Watch out for unusually low prices, rushed deals, or non-traditional payment requests.
        </li>
      </ul>
    </div>
  </div>
</div>

    
  </div>
</div>


    </div>
    <footer>
      <div>
        <Footersub
                handleOpenAbout={handleOpenAbout}
                handleOpenTerms={handleOpenTerms}
                handleOpenPrivacy={handleOpenPrivacy}
                handleOpenSafety={handleOpenSafety} />
      </div>
    </footer>
  </ScrollArea>
  );
};
export default SafetyComponent;
