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
import AboutComponent from "./AboutComponent";
import SettingsComponent from "./SettingsComponent";
import { getUserById } from "@/lib/actions/user.actions";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "./navbar";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
  userId: string;
}

const PopupSettings = ({ isOpen, userId, handleCategory, handleOpenShop,handlePay,
  handleOpenPerfomance, handleOpenSettings, onClose, handleOpenBook,handleOpenChat,handleOpenPlan, handleOpenSell,handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-1 w-full h-[100vh] flex flex-col">
        {loading ? (
                        <div className="h-screen w-full dark:bg-[#131B1E] dark:text-gray-300 bg-gray-200"> 
                        <div className="top-0 z-10 fixed w-full">
                         <Navbar userstatus={"User"} userId={userId} onClose={onClose} popup={"reviews"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                         handleOpenPerfomance={handleOpenPerfomance}
                         handleOpenSettings={handleOpenSettings}
                         handleOpenAbout={handleOpenAbout}
                         handleOpenTerms={handleOpenTerms}
                         handleOpenPrivacy={handleOpenPrivacy}
                         handleOpenSafety={handleOpenSafety} 
                         handleOpenShop={handleOpenShop}/>
                        </div>
                         <div className="flex justify-center items-center h-full text-lg dark:text-gray-400">
                         <div className="flex gap-2 items-center">  <CircularProgress sx={{ color: "gray" }} size={30} /> <div className="hidden lg:inline">Loading...</div></div>
                        </div>
                        </div>
                       
                      ) : (
      <SettingsComponent 
      userId={userId} 
      onClose={onClose}
        handleOpenAbout={handleOpenAbout}
        handleOpenTerms={handleOpenTerms}
        handleOpenPrivacy={handleOpenPrivacy}
        handleOpenSafety={handleOpenSafety}
        handleOpenSell={handleOpenSell}
        handleOpenBook={handleOpenBook}
        handleOpenChat={handleOpenChat}
        handleOpenPlan={handleOpenPlan}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenShop={handleOpenShop}
        handlePay={handlePay}
        handleCategory={handleCategory}
        user={user}/>)}
        <Toaster />
      </div>
    </div>
  );
};

export default PopupSettings;
