"use client"
import { getAllPackages } from "@/lib/actions/packages.actions";
import Image from "next/image";
import { getData } from "@/lib/actions/transactions.actions";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@clerk/nextjs/server";
import Listpackages from "@/components/shared/listpackages";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
interface PackProps {
  userId: string;
  planpackage: string;
  user: any;
  packagesList: any;
  daysRemaining:number;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
 
}

const PackageComponent =  ({userId,user,packagesList,daysRemaining,planpackage, onClose,handlePay, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenChat, handleOpenPlan, handleOpenBook, handleOpenSell}:PackProps) => {
 
 
  //console.log("-------" + user);
 
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
      
      <div className="top-0 z-10 fixed w-full">
        <Navbar userstatus={user.status} userId={userId} onClose={onClose} popup={"plan"} handleOpenPlan={handleOpenPlan} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenChat={handleOpenChat}
         handleOpenPerfomance={handleOpenPerfomance}
         handleOpenSettings={handleOpenSettings}
         handleOpenAbout={handleOpenAbout}
         handleOpenTerms={handleOpenTerms}
         handleOpenPrivacy={handleOpenPrivacy}
         handleOpenSafety={handleOpenSafety} 
         handleOpenShop={handleOpenShop}
        />
      </div>
      <div className="max-w-6xl mx-auto flex mt-[70px] lg:mt-[60px] mb-10 p-1">
   
        <div className="flex-1">
          <div className="w-full flex flex-col">
            <div className="">
              <section className="bg-bg-white p-1 rounded-lg">
                <p className="text-[25px] font-bold">Plan</p>
                <div className="wrapper flex">
                  <div className="text-center sm:text-left">
                    {daysRemaining > 0 ? (
                      <>
                        <div className="flex flex-col">
                          <div className="font-bold">
                            Subscription: {planpackage}
                          </div>
                          <div>Days remaining: {daysRemaining}</div>
                        </div>
                      </>
                    ) : (
                      <>Choose the plan that will work for you</>
                    )}
                  </div>
                </div>
              </section>
              <Listpackages
                packagesList={packagesList}
                userId={userId}
                daysRemaining={daysRemaining}
                packname={planpackage}
                user={user}
                handlePayNow={handlePay} 
              />
              <Toaster />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default PackageComponent;
