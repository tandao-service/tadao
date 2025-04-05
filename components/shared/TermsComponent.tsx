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

const TermsComponent =  ({userId, user,handleOpenPerfomance,
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
      <title>Terms and Conditions | PocketShop.co.ke</title>
      <meta
        name="description"
        content="Read the terms and conditions for using PocketShop.co.ke, our vehicle marketplace. By accessing the site, you agree to be bound by these terms."
      />
      <meta
        name="keywords"
        content="PocketShop, terms and conditions, vehicle marketplace, online car sales, PocketShop terms"
      />
      <meta
        property="og:title"
        content="Terms and Conditions | PocketShop.co.ke"
      />
      <meta
        property="og:description"
        content="Understand the terms and conditions for using PocketShop.co.ke, your trusted vehicle marketplace in Kenya."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.PocketShop.co.ke/terms" />
      <meta
        property="og:image"
        content="https://www.PocketShop.co.ke/assets/images/terms-and-conditions-cover.jpg"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Terms and Conditions | PocketShop.co.ke"
      />
      <meta
        name="twitter:description"
        content="Review the terms and conditions for using PocketShop.co.ke. Learn more about our policies, user obligations, and legal guidelines."
      />
      <meta
        name="twitter:image"
        content="https://www.PocketShop.co.ke/assets/images/terms-and-conditions-cover.jpg"
      />
      <link rel="canonical" href="https://www.PocketShop.co.ke/terms" />
    </Head>


    <div className="top-0 z-10 fixed w-full">
                            <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"terms"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
        <div className="terms-and-conditions p-6 dark:text-gray-300 text-gray-800">
  <h1 className="text-2xl font-bold mb-4 dark:text-gray-400">Terms and Conditions</h1>

  <p className="mb-4">
    Welcome to PocketShop.co.ke! By using our website, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree to these terms, you should not use this website.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
  <p className="mb-4">
    By accessing and using PocketShop.co.ke, you accept and agree to be bound by these terms. Any posted guidelines or rules applicable to our services may be updated periodically and are incorporated into these Terms of Service.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">2. User Obligations</h2>
  <p className="mb-4">
    Users agree to provide accurate and complete information when listing products or services. You must not post any misleading or false information, and you are responsible for ensuring that all listings comply with applicable laws and regulations.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">3. Listing Guidelines</h2>
  <p className="mb-4">
    Users must list products or services in the appropriate categories and ensure that all descriptions, prices, and images are accurate. Any listings that violate our guidelines, are deemed inappropriate, or are fraudulent may be removed without notice.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">4. Payment and Fees</h2>
  <p className="mb-4">
    PocketShop.co.ke may charge fees for listing products or for other premium services. Any applicable charges will be clearly outlined on the website before using a paid service.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">5. No Guarantee of Sale</h2>
  <p className="mb-4">
    PocketShop.co.ke does not guarantee that your product or service will be sold within a certain time frame or at all. We are not responsible for transactions between buyers and sellers and do not act as a mediator in disputes.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">6. User Conduct</h2>
  <p className="mb-4">
    Users are prohibited from:
    <ul className="list-disc list-inside ml-6">
      <li>Posting illegal, fraudulent, or misleading content.</li>
      <li>Engaging in harassment, abusive behavior, or spamming other users.</li>
      <li>Attempting to disrupt, hack, or interfere with the website&apos;s operation.</li>
      <li>Violating any intellectual property rights.</li>
    </ul>
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">7. Intellectual Property</h2>
  <p className="mb-4">
    All content on PocketShop.co.ke, including text, images, logos, and designs, is the property of PocketShop.co.ke or its content suppliers and is protected by intellectual property laws. Users may not copy, reproduce, distribute, or create derivative works from any part of this site without permission.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">8. Limitation of Liability</h2>
  <p className="mb-4">
    PocketShop.co.ke is not responsible for any damages arising from your use of this website, including direct, indirect, incidental, or consequential damages, even if we have been advised of the possibility of such damages.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">9. Modifications to Terms</h2>
  <p className="mb-4">
    PocketShop.co.ke reserves the right to change these terms and conditions at any time. Changes will be posted on this page, and it is the responsibility of users to review these terms regularly. Continued use of the site constitutes acceptance of the new terms.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">10. Termination of Use</h2>
  <p className="mb-4">
    PocketShop.co.ke reserves the right to terminate or suspend your access to the website, without notice, for any violation of these Terms and Conditions or for any other reason deemed necessary.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">11. Governing Law</h2>
  <p className="mb-4">
    These terms and conditions are governed by and construed in accordance with the laws of Kenya. You agree to submit to the exclusive jurisdiction of Kenyan courts for any disputes arising from these terms.
  </p>

  <h2 className="text-xl font-semibold mt-6 mb-2">12. Contact Information</h2>
  <p className="mb-4">
    If you have any questions, please contact us at:
    <a href="mailto:support@PocketShop.co.ke" className="text-emerald-600 hover:underline">support@PocketShop.co.ke</a>
  </p>
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
         handleOpenSafety={handleOpenSafety}/>
      </div>
    </footer>
</ScrollArea>

  );
};
export default TermsComponent;
