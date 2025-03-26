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
import DashboardPerformance from "./dashboardPerfomance";
import DashboardMyads from "./dashboardMyads";

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
  handlePay: (id:string) => void;
  handleOpenReview: (value:string) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  shopId: string;
  userId: string;
  userName: string;
  userImage: string;
  queryObject:any;
}

const PopupShop = ({ isOpen, userId, shopId, queryObject, userName,userImage, onClose,handlePay, handleOpenShop,
  handleOpenPerfomance, handleOpenSettings, handleOpenChatId, handleOpenReview, handleOpenChat, handleOpenBook,handleOpenPlan, handleOpenSell, handleAdEdit,handleAdView, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
  const [user, setuser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [remainingAds, setRemainingAds] = useState(0);
  const [planPackage, setPlanPackage] = useState("Free");
  const [color, setColor] = useState("#000000");
 const isAdCreator = shopId === userId;
 
  useEffect(() => {
     if (isOpen) {
       const fetchData = async () => {
         try {
          setLoading(true);
 const user = await getUserById(userId);
 setuser(user);

           const subscriptionData = await getData(userId);
           if (subscriptionData) {
           
             const listedAds = subscriptionData.ads || 0;
             setRemainingAds(Number(subscriptionData.currentpack.list) - listedAds);
             setColor(subscriptionData.currentpack.color);
             setPlanPackage(subscriptionData.currentpack.name);
            
             const createdAtDate = new Date(subscriptionData.transaction?.createdAt || new Date());
             const periodDays = parseInt(subscriptionData.transaction?.period) || 0;
             const expiryDate = new Date(createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000);
           
             const currentDate = new Date();
             const remainingDays = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
             setDaysRemaining(remainingDays);
           
           }
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
                  <Navbar userstatus={"User"} userId={userId} onClose={onClose} popup={"shop"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
                <DashboardMyads
                          userId={shopId}
                          loggedId={userId}
                          isAdCreator={isAdCreator}
                          user={user}
                          daysRemaining={daysRemaining}
                          packname={planPackage}
                          color={color}
                          userImage={userImage}
                          userName={userName}
                          emptyTitle="No ads have been created yet"
                          emptyStateSubtext="Go create some now"
                          collectionType="Ads_Organized"
                          limit={3}
                          sortby={"recommeded"}
                          urlParamName="adsPage"
                          onClose={onClose}
                          handleOpenSell={handleOpenSell}
                          handleOpenAbout={handleOpenAbout}
                          handleOpenTerms={handleOpenTerms}
                          handleOpenPrivacy={handleOpenPrivacy}
                          handleOpenSafety={handleOpenSafety}
                          handleAdView={handleAdView}
                          handleAdEdit={handleAdEdit} 
                          handleOpenBook={handleOpenBook}
                          handleOpenChat={handleOpenChat} 
                          handleOpenPlan={handleOpenPlan}
                          handleOpenReview={handleOpenReview}
                          handleOpenChatId={handleOpenChatId}
                          handleOpenSettings={handleOpenSettings}
                          queryObject={queryObject}
                          handlePay={handlePay}
                          handleOpenPerfomance={handleOpenPerfomance}
                          handleOpenShop={handleOpenShop}
                        />
                 
    )}
     
        <Toaster />
      </div>
    </div>
  );
};

export default PopupShop;
