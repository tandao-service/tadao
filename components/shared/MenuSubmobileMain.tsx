"use client";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Image from "next/image";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import SubCategoryWindow from "./SubCategoryWindow";
import { useEffect, useState } from "react";
import ProgressPopup from "./ProgressPopup";
import { useAuth } from "@/app/hooks/useAuth";
import { App as CapacitorApp } from "@capacitor/app";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import GavelIcon from "@mui/icons-material/Gavel";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "../ui/use-toast";
type Subcategory = {
  title: string;
};

type Category = {
  adCount: number;
  _id: string;
  name: string;
  subcategory: string;
  fields: any;
  imageUrl: string;
};

type MobileProps = {
  categoryList: Category[];
  subcategoryList: any;
  handleSubCategory: (category: string, subcategory: string) => void;
  handleOpenSell: (category?: string, subcategory?: string) => void;
  userId: string;
  handleOpenChat: () => void;
  handleOpenSettings: () => void;
  handleCategory: (value: string) => void;
  handleOpenSearchTab: (value: string) => void;
  handlePayNow: (id: string) => void;
  loans: any;
  user: any;
  packagesList: any;
};

export default function MenuSubmobileMain({
  categoryList,
  subcategoryList,
  handleSubCategory,
  handlePayNow,
  userId,
  handleOpenChat,
  handleOpenSell,
  handleCategory,
  handleOpenSearchTab,
  handleOpenSettings,
  loans,
  user,
  packagesList,
}: MobileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();

  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const handleOpen = (query: string) => {
    setIsOpen(true);
    setCategory(query);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = (query: string) => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      CapacitorApp.addListener("backButton", ({ canGoBack }) => {

        setIsOpen(false);
      });
    }

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);
  return (
    <div className="mx-auto">
      <div className="grid bg-white p-2 rounded-2xl grid-cols-4 md:grid-cols-4 gap-4 m-2">

        {/* Post Ad */}

        <div
          onClick={() => {
            if (user?._id && currentUser) {
              // Logged in, ready
              handleOpenSell();
            } else if (!user?._id && currentUser) {
              // Logged in but user data still loading
              toast({
                title: "Please wait",
                description: (
                  <div className="flex items-center gap-2">
                    <CircularProgress sx={{ color: "#000000" }} size={20} />
                    <span>Loading...</span>
                  </div>
                ),
              });
            } else {
              // Not logged in
              router.push("/auth");
            }
          }}

          className="h-[100px] bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
        >
          <div className="p-3 rounded-full bg-orange-200 mb-2">
            <SellOutlinedIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="text-xs font-semibold text-orange-700">Post Ad</h2>
        </div>

        {/* Donated */}
        <div
          onClick={() => {
            if (user?._id && currentUser) {
              // Logged in, ready
              handleOpenSell('Donations', 'Donated Items');
            } else if (!user?._id && currentUser) {
              // Logged in but user data still loading
              toast({
                title: "Please wait",
                description: (
                  <div className="flex items-center gap-2">
                    <CircularProgress sx={{ color: "#000000" }} size={20} />
                    <span>Loading...</span>
                  </div>
                ),
              });
            } else {
              // Not logged in
              router.push("/auth");
            }
          }}
          className="h-[100px] bg-gradient-to-br from-green-50 to-green-100 border border-green-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
        >
          <div className="p-3 rounded-full bg-green-200 mb-2">
            <VolunteerActivismIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xs font-semibold text-green-700">Donated</h2>
        </div>

        {/* Auction */}
        <div
          onClick={() => {
            if (user?._id && currentUser) {
              // Logged in, ready
              handleOpenSell();
            } else if (!user?._id && currentUser) {
              // Logged in but user data still loading
              toast({
                title: "Please wait",
                description: (
                  <div className="flex items-center gap-2">
                    <CircularProgress sx={{ color: "#000000" }} size={20} />
                    <span>Loading...</span>
                  </div>
                ),
              });
            } else {
              // Not logged in
              router.push("/auth");
            }
          }}
          className="h-[100px] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
        >
          <div className="p-3 rounded-full bg-blue-200 mb-2">
            <GavelIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xs font-semibold text-blue-700">Auction</h2>
        </div>

        {/* Lost & Found */}
        <div
          onClick={() => {
            if (user?._id && currentUser) {
              // Logged in, ready
              handleOpenSell('Lost and Found', 'Lost and Found Items');
            } else if (!user?._id && currentUser) {
              // Logged in but user data still loading
              toast({
                title: "Please wait",
                description: (
                  <div className="flex items-center gap-2">
                    <CircularProgress sx={{ color: "#000000" }} size={20} />
                    <span>Loading...</span>
                  </div>
                ),
              });
            } else {
              // Not logged in
              router.push("/auth");
            }
          }}
          className="h-[100px] bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
        >
          <div className="p-3 rounded-full bg-purple-200 mb-2">
            <SearchIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xs font-semibold text-purple-700">Lost & Found</h2>
        </div>


      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-7 m-0 gap-1">


        {categoryList.map((category, index) => (
          <div
            key={index} // Using sub.title as a unique key
            // onClick={() => handleCategory(category.name)}
            onClick={() => handleOpen(category.name)}
            className="h-[120px] dark:bg-[#2D3236] text-black dark:text-[#F1F3F3] bg-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border hover:bg-gray-200"
          >
            <div className="flex flex-col items-center text-center justify-center">
              <div className="rounded-full dark:bg-[#131B1E] bg-gray-100 p-2">
                <Image
                  className="w-12 h-12 object-cover"
                  src={category.imageUrl[0]}
                  alt={category.name}
                  width={60}
                  height={60}
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xs">{category.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {category.name === "Buyer Requests" ? (category.adCount + loans.adCount) : category.adCount} ads
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SubCategoryWindow
        isOpen={isOpen}
        onClose={handleClose}
        category={category}
        subcategoryList={subcategoryList}
        userId={userId}
        handleSubCategory={handleSubCategory}
        handleOpenSell={handleOpenSell}
        handleOpenChat={handleOpenChat}
        handleCategory={handleCategory}
        handleOpenSearchTab={handleOpenSearchTab}
        handleOpenSettings={handleOpenSettings}
        loans={loans}
        user={user}
        packagesList={packagesList}
        handlePayNow={handlePayNow}

      />
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
