"use client";

import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DiamondIcon from "@mui/icons-material/Diamond";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useRouter, redirect, usePathname } from "next/navigation";
//import { useSession } from "next-auth/react";
//import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import MobileNav from "./MobileNav";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import Image from "next/image";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Header from "@/components/shared/Header";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
//import Unreadmessages from "./Unreadmessages";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Unreadmessages from "./Unreadmessages";
import dynamic from "next/dynamic";
import StyledBrandName from "./StyledBrandName";
import AppPopup from "./AppPopup ";
import ToggleTheme from "./toggleTheme";
import ProgressPopup from "./ProgressPopup";
import HeaderMain from "./HeaderMain";
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

type NavProps = {
  userstatus: string;
  userId: string;
  user: any;
  AdsCountPerRegion: any;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenShop: (shopId: string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleFilter: (value: any) => void;
  handleOpenSearchByTitle: () => void;
  popup: string;
  isnav: boolean;
};
export default function Navbarhome({ userstatus, user, userId, AdsCountPerRegion, isnav, onClose, popup, handleFilter, handleOpenSell, handleOpenChat, handleOpenBook, handleOpenPlan,
  handleOpenShop,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
  handleOpenSearchByTitle,
}: NavProps) {
  // const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();
  // Get the params of the User
  const pathname = usePathname();
  const isActive = pathname === "/";
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => {
    setIsOpenP(false);
  };
  //isnav
  return (
    <div
      className={`w-full bg-gradient-to-r from-orange-500 from-10% via-orange-500 via-40% to-orange-500 to-90% ${isnav ? "lg:from-orange-500  lg:via-orange-400 lg:to-orange-500" : "lg:from-transparent  lg:via-transparent lg:to-transparent"
        }`}
    >
      <div

        className={`fixed z-10 flex p-3 w-full bg-gradient-to-r from-orange-500 from-10% via-orange-500 via-40% to-orange-500 to-90% ${isnav ? "lg:from-orange-500  lg:via-orange-400 lg:to-orange-500" : "lg:from-transparent  lg:via-transparent lg:to-transparent"
          }`}
      >
        <div className="flex-1">
          <div className="flex items-center">

            <div className="flex items-center gap-2">

              <StyledBrandName />
            </div>

          </div>
        </div>

        <div className="hidden lg:inline">
          <div className="flex items-center gap-2">
            <SignedIn>
              <div
                className="w-8 h-8 flex text-white hover:bg-orange-300 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Messages"
                onClick={() => {
                  handleOpenBook();
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
            </SignedIn>
            <SignedOut>
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] text-white hover:bg-orange-400 tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Messages"
                onClick={() => {
                  setIsOpenP(true);
                  router.push("/sign-in");
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
            </SignedOut>
            <SignedIn>
              <div
                className="w-8 h-8 flex text-white hover:bg-orange-400 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Messages"
                onClick={() => {
                  handleOpenChat();
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative flex items-center justify-center">
                        <MessageIcon className="absolute" />
                        <div className="absolute z-10">
                          <Unreadmessages userId={userId} />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div
                        onClick={() => {
                          handleOpenChat();
                        }}
                        className="flex gap-1"
                      >
                        Chats
                        <Unreadmessages userId={userId} />
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </SignedIn>
            <SignedOut>
              <div
                className="w-8 h-8 flex text-white hover:bg-orange-400 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Messages"
                onClick={() => {
                  setIsOpenP(true);
                  router.push("/sign-in");
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <MessageIcon className="absolute" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </SignedOut>


            <div
              className="w-8 h-8 flex text-white hover:bg-orange-400 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                handleOpenPlan();
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


            <div>
              <SignedIn>
                <button
                  onClick={() => {
                    handleOpenSell();

                  }}
                  className={`w-[100px] dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-white text-gray-500 hover:text-gray-900 p-1 rounded-full`}
                >
                  <SellOutlinedIcon /> SELL
                </button>
              </SignedIn>
            </div>
            <div>
              <SignedOut>
                <button
                  onClick={() => {
                    setIsOpenP(true);
                    router.push("/sign-in");
                  }}
                  className={`w-[100px] dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-white text-gray-500 hover:text-gray-900 p-1 rounded-full`}
                >
                  <SellOutlinedIcon /> SELL
                </button>
              </SignedOut>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <SignedIn>
            <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <MobileNav user={user} userstatus={userstatus} userId={userId}
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
            handleOpenSafety={handleOpenSafety} onClose={onClose} />

        </div>
      </div>
      <div>
        <Header handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle} AdsCountPerRegion={AdsCountPerRegion}

        />
        {/**  <AppPopup />*/}
        <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      </div>
    </div>
  );
}
