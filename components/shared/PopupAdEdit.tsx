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
import { getAdById } from "@/lib/actions/dynamicAd.actions";
import Navbar from "./navbar";
import CircularProgress from "@mui/material/CircularProgress";
import BottomNavigation from "./BottomNavigation";
import { getallcategories } from "@/lib/actions/subcategory.actions";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdView: (ad: any) => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenBook: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId: any) => void;
  handleCategory: (value: string) => void;
  handlePay: (value: string) => void;
  type: string;
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
  user: any;
  subcategoryList: any;
  packagesList: any;
  category: string;
  subcategory: string;
}

const PopupAdEdit = ({ isOpen, category, subcategory, type, user, userId, userImage, userName, subcategoryList, packagesList, ad, handleOpenPerfomance,
  handleOpenSettings, handlePay,
  handleOpenShop, handleCategory, onClose, handleAdView, handleOpenBook, handleOpenChat, handleOpenPlan, handleOpenSell, handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety }: WindowProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden'); // Cleanup on unmount
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FAE6DA] z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">


        <DashboardSellMain
          userId={userId}
          type={type}
          subcategoryList={subcategoryList}
          userName={userName}
          onClose={onClose}
          handleOpenSell={handleOpenSell}
          handleAdView={handleAdView}
          popup={"sell"}
          adId={ad._id}
          ad={ad}
          user={user}
          packagesList={packagesList}
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
          handleOpenBook={handleOpenBook}
          handleOpenChat={handleOpenChat}
          handleOpenPlan={handleOpenPlan}
          handleOpenShop={handleOpenShop}
          handleOpenPerfomance={handleOpenPerfomance}
          handleOpenSettings={handleOpenSettings}
          handleCategory={handleCategory}
          userImage={userImage}
          category={category} subcategory={subcategory}
          handlePay={handlePay} />
        <Toaster />
      </div>
    </div>
  );
};

export default PopupAdEdit;
