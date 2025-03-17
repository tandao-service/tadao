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
import PackageComponent from "./PackageComponent";

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
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
  userId: string;
}

const PopupPlan = ({ isOpen, userId, onClose,handlePay, handleCategory, handleOpenSettings, handleOpenShop, handleOpenPerfomance, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety, handleOpenChat,handleOpenBook,handleOpenPlan, handleOpenSell }: WindowProps) => {
 const [user, setuser] = useState<any>([]);
   const [packagesList, setPackagesList] = useState<IPackages[]>([]);
   const [daysRemaining, setDaysRemaining] = useState(5);
   const [planPackage, setPlanPackage] = useState("Free");
    const [loading, setLoading] = useState<boolean>(true);
   
   let subscription: any = [];
  useEffect(() => {
      if (isOpen && userId) {
        const fetchData = async () => {
          try {
            setLoading(true);
            const user = await getUserById(userId);
            setuser(user);
            const packages = await getAllPackages();
            setPackagesList(packages);
            const createdAtDate = new Date(subscription[0].createdAt);
            setPlanPackage(subscription[0].plan)
            // Step 2: Extract the number of days from the period string
            const periodDays = parseInt(subscription[0].period);
        
            // Step 3: Calculate expiration date by adding period days to createdAt date
            const expirationDate = new Date(
              createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000
            );
            // Step 4: Calculate the number of days remaining until the expiration date
            const currentDate = new Date();
           const remainingDays = Math.ceil(
              (expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            setDaysRemaining(remainingDays);
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
                 <div className="h-screen w-full bg-gray-200"> 
                 <div className="top-0 z-10 fixed w-full">
                  <Navbar userstatus="User" userId={userId} onClose={onClose} popup={"plan"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
                 <PackageComponent
              packagesList={packagesList}
              userId={userId}
              user={user}
              planpackage={planPackage}
              daysRemaining={daysRemaining}
              onClose={onClose}
              handleOpenSell={handleOpenSell}
              handleOpenBook={handleOpenBook}
              handleOpenPlan={handleOpenPlan}
              handleOpenChat={handleOpenChat}
              handleOpenPerfomance={handleOpenPerfomance}
              handleOpenSettings={handleOpenSettings}
              handleOpenAbout={handleOpenAbout}
              handleOpenTerms={handleOpenTerms}
              handleOpenPrivacy={handleOpenPrivacy}
              handleOpenSafety={handleOpenSafety}
              handleOpenShop={handleOpenShop}
              handlePay={handlePay} 
              handleCategory={handleCategory} />
               )}
     
        <Toaster />
      </div>
    </div>
  );
};

export default PopupPlan;
