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

const FaqComponent =  ({userId, user,handleOpenPerfomance,
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
    <ScrollArea className="h-[100vh] bg-white dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
      <Head>
        <title>Frequently Asked Questions | PocketShop.co.ke</title>
        <meta
          name="description"
          content="Find answers to common questions about using PocketShop.co.ke, including how to post a product, contact sellers, and more."
        />
        <meta
          name="keywords"
          content="PocketShop, FAQ, frequently asked questions, product marketplace, post a product, contact seller"
        />
        <meta
          property="og:title"
          content="Frequently Asked Questions | PocketShop.co.ke"
        />
        <meta
          property="og:description"
          content="Get help with common questions about posting products, contacting sellers, and managing your listings on PocketShop.co.ke."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.PocketShop.co.ke/faq" />
        <meta
          property="og:image"
          content="https://www.PocketShop.co.ke/assets/images/faq-cover.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Frequently Asked Questions | PocketShop.co.ke"
        />
        <meta
          name="twitter:description"
          content="Find answers to your questions about posting products and using PocketShop.co.ke. Learn more about our marketplace."
        />
        <meta
          name="twitter:image"
          content="https://www.PocketShop.co.ke/assets/images/faq-cover.jpg"
        />
        <link rel="canonical" href="https://www.PocketShop.co.ke/faq" />
        </Head>
   <div className="top-0 z-10 fixed w-full">
        <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"faq"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
   
           handleOpenPerfomance={handleOpenPerfomance}
           handleOpenSettings={handleOpenSettings}
           handleOpenAbout={handleOpenAbout}
           handleOpenTerms={handleOpenTerms}
           handleOpenPrivacy={handleOpenPrivacy}
           handleOpenSafety={handleOpenSafety} 
           handleOpenShop={handleOpenShop}/>
                          </div>
      <div className="max-w-3xl mx-auto flex mt-20 p-1">
        <div className="hidden lg:inline mr-5"></div>

        <div className="flex-1">
          <div className="rounded-[20px] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
          <div className="max-w-3xl mx-auto p-6">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    Frequently Asked Questions
  </h2>

  <div className="space-y-8">
    <div>
      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
        1. How can I list my product on PocketShop.co.ke?
      </h3>
      <p className="text-gray-700">
        To list your product, sign up or log into your account, go to the
        &quot;Sell&quot; section, and complete the required details. Upload
        clear images, set your price, and submit your listing.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
        2. Is it free to post a product listing?
      </h3>
      <p className="text-gray-700">
        Yes, posting a standard product listing is free. However, we offer
        premium options to boost your listing&apos;s visibility for a small fee.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
        3. How do I contact a seller?
      </h3>
      <p className="text-gray-700">
        You can reach a seller through the chat feature on PocketShop.co.ke or
        use the provided phone number and email on the listing page.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
        4. What should I do if I find a suspicious listing?
      </h3>
      <p className="text-gray-700">
        If you suspect a fraudulent listing, click the &quot;Report&quot;
        button on the ad page. Our team will review the report and take the
        necessary action.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
        5. How can I update or remove my product listing?
      </h3>
      <p className="text-gray-700">
        Log into your account, go to &quot;My Listings,&quot; and select the
        listing you want to edit or remove.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
        6. Can I get a refund for a premium listing?
      </h3>
      <p className="text-gray-700">
        Refunds for premium listings are subject to our refund policy. Please
        review our policy or contact customer support for assistance.
      </p>
    </div>
  </div>


            </div>
          </div>
        </div>
      </div>

      <footer>
      
      </footer>
    </ScrollArea>
  );
};
export default FaqComponent;
