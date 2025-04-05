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

const AboutComponent =  ({userId,user, onClose,
  handleOpenSell,
  handleOpenBook,
  handleOpenChat,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }:Props) => {
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
        <title>
          About PocketShop | Kenya&apos;s Leading Vehicle Marketplace
        </title>
        <meta
          name="description"
          content="Learn about PocketShop.co.ke, Kenya's premier platform for buying and selling vehicles. From cars to heavy-duty machinery, we connect buyers and sellers nationwide."
        />
        <meta
          property="og:title"
          content="About PocketShop | Kenya's Leading Vehicle Marketplace"
        />
        <meta
          property="og:description"
          content="At PocketShop.co.ke, we offer a seamless, transparent, and secure platform to buy and sell vehicles across Kenya. Discover a wide selection of cars, motorbikes, buses, and machinery."
        />
        <meta property="og:image" content="/assets/images/logo.png" />
        <meta property="og:url" content="https://PocketShop.co.ke/about" />
        <meta property="og:type" content="website" />
        <meta
          name="keywords"
          content="PocketShop, buy vehicles, sell vehicles, cars, motorbikes, buses, machinery, Kenya"
        />
        <meta name="author" content="PocketShop" />
      </Head>

     <div className="top-0 z-10 fixed w-full">
                        <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"about"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}

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
        <div className="max-w-4xl mx-auto p-8">
  <h1 className="text-3xl font-bold dark:text-gray-400 text-gray-800 mb-6 text-center">
    About PocketShop.co.ke
  </h1>

  <div className="space-y-6 dark:text-gray-300 text-gray-700">
    <p className="text-lg">
      Welcome to <span className="font-semibold text-emerald-600">PocketShop.co.ke</span>,
      Kenya&apos;s premier online marketplace for buying and selling a wide range of products.
      Whether you&apos;re looking for electronics, fashion, home appliances, vehicles, furniture,
      or even agricultural and industrial equipment, we provide a trusted platform that
      connects buyers and sellers across the country.
    </p>

    <div>
      <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
        Our Mission
      </h2>
      <p>
        At PocketShop.co.ke, our mission is simple: to make the process of buying and selling
        online as seamless, transparent, and secure as possible. We aim to create a safe
        environment where you can find what you need or sell with confidence.
      </p>
    </div>

    <div>
      <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
        Why Choose PocketShop.co.ke?
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <span className="font-semibold">Diverse Product Categories</span>: From fashion and
          electronics to home essentials and vehicles, our marketplace offers an extensive
          selection of products.
        </li>
        <li>
          <span className="font-semibold">User-Friendly Platform</span>: Easily post listings,
          search for products, and connect with buyers or sellers with just a few clicks.
        </li>
        <li>
          <span className="font-semibold">Safe and Secure</span>: We implement strong security
          measures to protect users and provide tips to avoid scams.
        </li>
        <li>
          <span className="font-semibold">Direct Communication</span>: Buyers and sellers can
          communicate directly via chat, email, or phone to negotiate and finalize transactions.
        </li>
        <li>
          <span className="font-semibold">Transparency and Trust</span>: We ensure accurate
          representation of listings and encourage honest communication between users.
        </li>
      </ul>
    </div>

    <div>
      <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
        Our Story
      </h2>
      <p>
        Founded with the vision of transforming e-commerce in Kenya, PocketShop.co.ke has
        quickly grown to become a trusted marketplace. Our team is dedicated to innovation
        and customer satisfaction, continuously improving our platform to better serve you.
      </p>
    </div>

    <div>
      <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
        Join Our Community
      </h2>
      <p>
        Whether you&apos;re a business owner, an independent seller, or a shopper looking for
        the best deals, PocketShop.co.ke is your go-to marketplace. Join our growing
        community today and experience a hassle-free buying and selling experience.
      </p>
      <p>
        Thank you for choosing <span className="font-semibold text-emerald-600">PocketShop.co.ke</span>.
        We look forward to connecting you with the best products and deals in Kenya!
      </p>
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
         handleOpenSafety={handleOpenSafety}/> 
      </div>
    </footer>

</ScrollArea>

  );
};
export default AboutComponent;
