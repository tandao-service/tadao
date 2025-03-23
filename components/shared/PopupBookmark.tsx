// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import PackageForm from "./packageForm";
import { IPackages } from "@/lib/database/models/packages.model";
import { Toaster } from "../ui/toaster";
import { FreePackId, mode } from "@/constants";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { getData } from "@/lib/actions/transactions.actions";
import DashboardSellMain from "./DashboardSellMain";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "./navbar";
import DashboardBookmark from "./dashboardBookmark";
import CircularProgress from "@mui/material/CircularProgress";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
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
  handleCategory:(value:string) => void;
  handleOpenShop: (value:string) => void;
    handleOpenChatId: (value:string) => void;
    handleOpenSettings: () => void;
    handleOpenPerfomance: () => void;
  //type: string;
  userId: string;
 // userName: string;
}

const PopupBookmark = ({ isOpen, userId, onClose, handleOpenShop,
  handleOpenChatId,
  handleOpenSettings,
  handleOpenPerfomance, handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenSell, handleAdEdit,handleAdView, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
  const [user, setuser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      const fetchData = async () => {
        try {
         const user = await getUserById(userId);
         setuser(user);
        
        } catch (error) {
          console.error("Failed to fetch data", error);
        } finally {
          setLoading(false); // Mark loading as complete
        }
      };

      fetchData();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center dark:bg-[#131B1E] dark:text-gray-300 bg-gray-200 h-screen z-50">
     
          {loading ? (
                 <div className="h-screen w-full bg-gray-200"> 
                 <div className="top-0 z-10 fixed w-full">
                  <Navbar userstatus="User" userId={userId} onClose={onClose} popup={"bookmark"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                   handleOpenPerfomance={handleOpenPerfomance}
                   handleOpenSettings={handleOpenSettings}
                   handleOpenAbout={handleOpenAbout}
                   handleOpenTerms={handleOpenTerms}
                   handleOpenPrivacy={handleOpenPrivacy}
                   handleOpenSafety={handleOpenSafety} 
                   handleOpenShop={handleOpenShop}/>
                 </div>
                  <div className="flex justify-center items-center h-full text-lg font-bold">
                  <div className="flex gap-2 items-center">  <CircularProgress sx={{ color: "gray" }} size={30} /> <div className="hidden lg:inline">Loading...</div></div>
                 </div>
                 </div>
                
               ) : (
      <DashboardBookmark
              userId={userId}
              user={user}
              emptyTitle="No ads have been created yet"
              emptyStateSubtext="Go create some now"
              collectionType="Ads_Organized"
              limit={20}
              urlParamName="adsPage"
              onClose={onClose}
              handleOpenSell={handleOpenSell}
              handleOpenAbout={handleOpenAbout}
              handleOpenTerms={handleOpenTerms}
              handleOpenPrivacy={handleOpenPrivacy}
              handleOpenSafety={handleOpenSafety}
              handleAdView={handleAdView}
              handleAdEdit={handleAdEdit}
              handleOpenPlan={handleOpenPlan}
              handleOpenBook={handleOpenBook} 
              handleOpenChat={handleOpenChat}
              handleOpenChatId={handleOpenChatId}
              handleOpenShop={handleOpenShop}
              handleOpenPerfomance={handleOpenPerfomance}
              handleOpenSettings={handleOpenSettings}/>)}
     
        <Toaster />
      </div>
    
  );
};

export default PopupBookmark;
