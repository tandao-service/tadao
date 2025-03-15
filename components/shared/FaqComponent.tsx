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
  handleOpenSell:() => void;
  onClose:() => void;
  handleOpenAbout:() => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  
}

const FaqComponent =  ({userId,handleOpenSell,onClose,handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:Props) => {
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
        <title>Frequently Asked Questions | AutoYard.co.ke</title>
        <meta
          name="description"
          content="Find answers to common questions about using AutoYard.co.ke, including how to post a vehicle, contact sellers, and more."
        />
        <meta
          name="keywords"
          content="AutoYard, FAQ, frequently asked questions, vehicle marketplace, car sales, post a vehicle, contact seller"
        />
        <meta
          property="og:title"
          content="Frequently Asked Questions | AutoYard.co.ke"
        />
        <meta
          property="og:description"
          content="Get help with common questions about posting vehicles, contacting sellers, and managing your listings on AutoYard.co.ke."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.autoyard.co.ke/faq" />
        <meta
          property="og:image"
          content="https://www.autoyard.co.ke/assets/images/faq-cover.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Frequently Asked Questions | AutoYard.co.ke"
        />
        <meta
          name="twitter:description"
          content="Find answers to your questions about posting vehicles and using AutoYard.co.ke. Learn more about our marketplace."
        />
        <meta
          name="twitter:image"
          content="https://www.autoyard.co.ke/assets/images/faq-cover.jpg"
        />
        <link rel="canonical" href="https://www.autoyard.co.ke/faq" />
      </Head>
     {/* <div className="z-10 top-0 fixed w-full">
                <Navbar userstatus="User" userId={userId} onClose={onClose} handleOpenSell={handleOpenSell} popup={"privacy"} />
              </div>
 */}
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
                    1. How do I post a vehicle for sale on AutoYard.co.ke?
                  </h3>
                  <p className="text-gray-700">
                    To post a vehicle, simply create an account, navigate to the
                    &quot;Sell &quot; section, and fill out the required
                    details. Upload photos, set your price, and submit your
                    listing.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                    2. Is there a fee for posting a vehicle?
                  </h3>
                  <p className="text-gray-700">
                    Posting a basic vehicle listing on AutoYard.co.ke is free.
                    However, we offer premium listing options for increased
                    visibility, which come with a small fee.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                    3. How can I contact a seller?
                  </h3>
                  <p className="text-gray-700">
                    You can contact a seller directly via the chat function on
                    the website, or by using the provided email or phone number
                    listed in the vehicle details.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                    4. What should I do if I suspect a fraudulent listing?
                  </h3>
                  <p className="text-gray-700">
                    If you suspect a fraudulent listing, please report it
                    immediately using the &quot;Report &quot; button on the
                    listing page. Our team will review and take appropriate
                    action.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                    5. How do I edit or delete my vehicle listing?
                  </h3>
                  <p className="text-gray-700">
                    You can edit or delete your listing by logging into your
                    account, navigating to &quot;My Listings, &quot; and
                    selecting the option to edit or delete the desired vehicle
                    listing.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                    6. Can I get a refund for a premium listing?
                  </h3>
                  <p className="text-gray-700">
                    Refunds for premium listings are subject to our refund
                    policy. Please review the policy or contact our support team
                    for assistance.
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
