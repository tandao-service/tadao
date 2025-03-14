"use client";
import EventForm from "@/components/shared/EventForm";
import { IAd } from "@/lib/database/models/ad.model";
import Footersub from "./Footersub";
import BottomNavigation from "./BottomNavigation";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
type Package = {
  imageUrl: string;
  name: string;
  _id: string;
  description: string;
  price: string[];
  features: string[];
  color: string;
};
type dashboardProps = {
  userId: string;
  planId: string;
  daysRemaining: number;
  packname: string;
  userName: string;
  type: string;
  ad?: any;
  adId?: string;
  packagesList: any;
  listed: number;
  priority: number;
  expirationDate: Date;
  adstatus: string;
};
const dashboard = ({
  userId,
  planId,
  packname,
  userName,
  daysRemaining,
  type,
  ad,
  adId,
  packagesList,
  listed,
  priority,
  expirationDate,
  adstatus,
}: dashboardProps) => {
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
    <>
    <div className="min-h-screen bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
        <div className="z-10 top-0 fixed w-full">
          <Navbar userstatus="User" userId={""} />
        </div>
        <div className="mt-[50px] mb-[65px] lg:mb-0">
          <div className="min-h-[500px] max-w-3xl mx-auto flex mt-2 p-1">
            <div className="flex-1">
            
      <div className="max-w-6xl mx-auto flex mt-4 p-2 dark:bg-[#131B1E] bg-white rounded-lg">
        <div className="flex-1">
          <div className="rounded-sm max-w-6xl mx-auto lg:flex-row mt-0 p-0 justify-center">
            <EventForm
              userId={userId}
              type={type}
              ad={ad}
              adId={adId}
              planId={planId}
              userName={userName}
              daysRemaining={daysRemaining}
              packname={packname}
              listed={listed}
              priority={priority}
              expirationDate={expirationDate}
              adstatus={adstatus}
              packagesList={packagesList}
            />
          </div>
        </div>
      </div>
      </div>
            </div>
          </div>
      
        <footer>
          <div>
            <div className="hidden lg:inline">
              <Footersub />
            </div>
            <div className="lg:hidden">
              <BottomNavigation userId={userId} />
            </div>
          </div>
        </footer>
        </div>
    </>
  );
};

export default dashboard;
