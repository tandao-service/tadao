"use client";
import { IAd } from "@/lib/database/models/ad.model";
import Link from "next/link";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { IUser } from "@/lib/database/models/user.model";
import ReviewsBoxMyAds from "./ReviewsBoxMyAds";
import SendReviewMyAds from "./SendReviewMyAds";
import Footersub from "./Footersub";
import Navbar from "./navbar";
import { mode } from "@/constants";
import { Toaster } from "../ui/toaster";
import { ScrollArea } from "../ui/scroll-area";
//import RatingsCard from "./RatingsCard";
//import CollectionMyads from "./CollectionMyads";

const CollectionMyads = dynamic(() => import("./CollectionMyads"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});

const SellerProfile = dynamic(() => import("./SellerProfile"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full lg:w-[300px] h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});
type CollectionProps = {
  userId: string;
  loggedId: string;
  daysRemaining?: number;
  packname?: string;
  color: string;
  sortby: string;
  userImage: string;
  userName: string;
  user: IUser;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  queryObject:any;
  urlParamName?: string;
  isAdCreator: boolean;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdEdit: (id:string) => void;
  handleAdView: (id:string) => void;
  handleOpenReview: (value:string) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
};

const DashboardMyads = ({
  userId,
  //data,
  packname,
  daysRemaining,
  color,
  emptyTitle,
  emptyStateSubtext,
  sortby,
  userImage,
  userName,
  collectionType,
  urlParamName,
  isAdCreator,
  user,
  loggedId,
  queryObject,
  handlePay,
  handleOpenReview,
  handleOpenChatId,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPerfomance,
  onClose, handleOpenChat, handleOpenBook,handleOpenPlan, handleOpenSell, handleAdEdit,handleAdView, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety,
}: // Accept the onSortChange prop
CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [isVertical, setisVertical] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleButtonClick = (index: number) => {
    setActiveButton(index);
    if (index === 0) {
      setisVertical(true);
    } else {
      setisVertical(false);
    }
  };

  const [query, setQuery] = useState("");
   const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
 
 
  const handleSortChange = (selectedOption: string) => {
    //let newUrl = "";
    if (selectedOption) {

     setNewqueryObject({
       ...queryObject, // Preserve existing properties
       sortby:selectedOption,
     });

     setActiveButton(1);
   
    }
   
  };

 

  //console.log("loggedId:" + loggedId);
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
        <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       <div className="top-0 z-10 fixed w-full">
                        <Navbar userstatus={"User"} userId={loggedId} onClose={onClose} popup={"shop"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                                            handleOpenPerfomance={handleOpenPerfomance}
                                            handleOpenSettings={handleOpenSettings}
                                            handleOpenAbout={handleOpenAbout}
                                            handleOpenTerms={handleOpenTerms}
                                            handleOpenPrivacy={handleOpenPrivacy}
                                            handleOpenSafety={handleOpenSafety} 
                                            handleOpenShop={handleOpenShop}/>
                       </div>
      <div className="flex mt-[70px] mt-[60px] p-2 w-full bg-blue-500">
     {/* <div className="flex bg-black hidden lg:inline">
            <div className="border dark:border-0 rounded-lg flex justify-center items-center w-full h-full">
                <SellerProfile
                      user={user}
                      loggedId={loggedId}
                      userId={userId}
                      handleOpenReview={handleOpenReview} 
                      handleOpenChatId={handleOpenChatId} 
                      handleOpenSettings={handleOpenSettings}
                      handlePay={handlePay}
                      />
              </div>
            </div>
          */}

          <div className="min-h-screen">
          <div className="bg-red-400 lg:hidden">
              <SellerProfile user={user} loggedId={loggedId} userId={userId} handleOpenReview={handleOpenReview} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings} handlePay={handlePay}/>
            </div>
          </div>
      <Toaster />
      </div>
      <footer>
         <Footersub
                handleOpenAbout={handleOpenAbout}
                 handleOpenTerms={handleOpenTerms}
                 handleOpenPrivacy={handleOpenPrivacy}
                 handleOpenSafety={handleOpenSafety}/>
      </footer>
    </ScrollArea>
    </>
  );
};

export default DashboardMyads;
