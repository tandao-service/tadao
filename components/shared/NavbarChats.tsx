"use client";
import React, { useState } from "react";
import { UpdateUserParams } from "@/types";
import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
import ViewListIcon from "@mui/icons-material/ViewList";
import Image from "next/image";
import { useRouter, redirect, usePathname } from "next/navigation";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
//import { useSession } from "next-auth/react";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import MobileNav from "./MobileNav";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import dynamic from "next/dynamic";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ProgressPopup from "./ProgressPopup";
import ToggleTheme from "./toggleTheme";
import { Button } from "../ui/button";
const SignedIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedIn),
  { ssr: false }
);
const SignedOut = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedOut),
  { ssr: false }
);
const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);

type sidebarProps = {
  recipient: any;
  userId: string;
  onClose: () => void;
  handleOpenBook: () => void;
    handleOpenPlan: () => void;
    handleOpenChat: () => void;
    handleOpenSell: () => void;
    
    handleOpenShop: (shopId:string) => void;
    
};

const NavbarChats = ({ recipient, userId, onClose,handleOpenBook,handleOpenPlan,handleOpenSell,handleOpenShop }: sidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/";
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => {
    setIsOpenP(false);
  };

  return (
    <div className="h-[60px] flex p-2 lg:p-3 gap-1 w-full dark:bg-[#064E3B] bg-white">
      <div className="flex-1">
        <div className="flex items-center">
          {!isActive && (
            <div
              className="mr-5 w-5 h-8 flex items-center justify-center rounded-sm tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Back"
              onClick={() => {
                // setIsOpenP(true);
                onClose();
              }}
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
          )}
          {recipient.firstName ? (
            <div className="flex gap-1 items-center">
              <Image
                src={recipient.photo}
                alt="Profile Image"
                className="rounded-full object-cover"
                width={26}
                height={26}
              />
              <div className="items-center justify-center">
                <div
                  onClick={() => {
                   // if (pathname !== `/shop/${userId}`) {
                      handleOpenShop(userId);
                      //router.push(`/shop/${userId}`);
                  //  }
                  }}
                  className="no-underline font-boldm-1"
                >
                  <span className="cursor-pointer">
                    {recipient.firstName} {recipient.lastName}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-1 items-center">
              <div>
                <span className="text-lg ">Select Chat!</span>
              </div>
            </div>
          )}
        </div>
      </div>

     

      <div className="hidden lg:inline">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white emerald-500 tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Messages"
            onClick={() => {
             // if (pathname !== "/bookmark/") {
                handleOpenBook();
                //router.push("/bookmark/");
              //}
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

          <div
            className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Plan"
            onClick={() => {
             // if (pathname !== "/plan/") {
                handleOpenPlan();
              //  router.push("/plan/");
              //}
            }}
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
          <div className="flex gap-1">
          <SignedIn>

<Button  onClick={() => {
                   handleOpenSell();
                 
                  }} 
                  variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

</SignedIn>

<SignedOut>
<Button  onClick={() => {
     // setIsOpenP(true);
      router.push("/sign-in");
    }} variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

  
</SignedOut>
          </div>
        </div>
      </div>
      <SignedIn>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white tooltip tooltip-bottom hover:cursor-pointer">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <MobileNav userstatus={"User"} userId={userId} />
    
    </div>
  );
};

export default NavbarChats;
