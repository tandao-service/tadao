"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Unreadmessages from "./Unreadmessages";
import MobileNav from "./MobileNav";
import StyledBrandName from "./StyledBrandName";
import ToggleTheme from "./toggleTheme";
import ProgressPopup from "./ProgressPopup";
import { Button } from "../ui/button";
import { useAuth } from "@/app/hooks/useAuth";
import UserMenu from "./UserMenu";

type NavProps = {
  userstatus: string;
  userId: string;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  popup: string;
  user: any;
};

export default function Navbar({
  userstatus,
  onClose,
  popup,
  handleOpenSell,
  handleOpenChat,
  handleOpenBook,
  handleOpenPlan,
  handleOpenShop,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
  user,
}: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/";
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => setIsOpenP(false);

  //const { user, signOutUser } = useAuth(); // Firebase Auth

  const userId = user?._id || "";
  const requireAuthRedirect = () => {
    if (!user?._id) {
      setIsOpenP(true);
      router.push("/auth"); // your Firebase auth page
    }
  };

  return (
    <div className="h-[60px] bg-gradient-to-r from-orange-500 from-10% via-orange-500 via-40% to-orange-500 to-90% items-center flex p-2 lg:p-3 gap-1 w-full">
      <div className="flex-1 mt-1">
        <div className="flex items-center">
          <div
            className="mr-2 w-5 h-8 flex items-center text-white justify-center rounded-sm tooltip tooltip-bottom hover:cursor-pointer hover:text-gray-100"
            data-tip="Back"
            onClick={() => onClose()}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ArrowBackOutlinedIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <StyledBrandName />
          </div>
        </div>
      </div>

      <div className="hidden lg:inline">
        <div className="flex mt-1 items-center gap-2">
          {popup !== "bookmark" && (
            <>
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] text-white hover:bg-orange-400 tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Bookmark"
                onClick={() => {
                  user ? handleOpenBook() : requireAuthRedirect();
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BookmarkIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bookmark</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          )}

          {popup !== "chat" && (
            <>
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] text-white hover:bg-orange-400 tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Messages"
                onClick={() => {
                  user ? handleOpenChat() : requireAuthRedirect();
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative flex items-center justify-center">
                        <MessageIcon className="absolute" />
                        <div className="absolute z-10">
                          {user && <Unreadmessages userId={userId} />}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div
                        onClick={() => {
                          user && handleOpenChat();
                        }}
                        className="flex gap-1"
                      >
                        Chats
                        {user && <Unreadmessages userId={userId} />}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          )}

          {popup !== "plan" && (
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] hover:bg-orange-400 text-white hover:text-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Premium Services"
              onClick={handleOpenPlan}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DiamondIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Premium Services</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {popup !== "sell" && (
            <div className="flex gap-1">
              <button
                onClick={() => {
                  user ? handleOpenSell() : requireAuthRedirect();
                }}
                className={`w-[100px] dark:bg-[#131B1E] bg-white dark:hover:bg-[#2D3236] dark:text-gray-300 text-gray-500 hover:text-gray-900 p-1 rounded-full`}
              >
                <SellOutlinedIcon /> SELL
              </button>
            </div>
          )}

          <UserMenu userdata={user} handleOpenShop={handleOpenShop} handleOpenSettings={handleOpenSettings} />

        </div>
      </div>

      <MobileNav
        user={user}
        userstatus={userstatus}
        userId={userId}
        popup={popup}
        handleOpenSell={handleOpenSell}
        handleOpenBook={handleOpenBook}
        handleOpenPlan={handleOpenPlan}
        handleOpenChat={handleOpenChat}
        handleOpenShop={handleOpenShop}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenAbout={handleOpenAbout}
        handleOpenTerms={handleOpenTerms}
        handleOpenPrivacy={handleOpenPrivacy}
        handleOpenSafety={handleOpenSafety}
        onClose={onClose}
      />
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
