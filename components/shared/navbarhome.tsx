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
  AdsCountPerRegion:any;
  onLoading: () => void;
};

export default function Navbarhome({
  userstatus,
  userId,
  AdsCountPerRegion,
  onLoading,
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
  return (
    <div className="w-full bg-[#064E3B]">
      <div className="fixed bg-[#064E3B] z-10 flex p-3 w-full">
        <div className="flex-1">
          <div className="flex items-center">
            {!isActive && (
              <div
                className="mr-5 w-5 h-8 flex items-center justify-center rounded-sm text-white tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Back"
                onClick={() => {
                  router.back();
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
            <div className="rounded-full overflow-hidden">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                onClick={() => {
                  if (pathname !== "/") {
                    setIsOpenP(true);
                    router.push("/");
                  }
                }}
                className="hover:cursor-pointer"
                width={36}
                height={36}
              />
            </div>
            <span
              className="font-bold text-base lg:text-lg text-white hover:cursor-pointer"
              onClick={() => {
                if (pathname !== "/") {
                  setIsOpenP(true);
                  router.push("/");
                }
              }}
            >
              <StyledBrandName />
            </span>
          </div>
        </div>
        
        <div className="hidden lg:inline">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white emerald-500 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                if (pathname !== "/bookmark/") {
                  setIsOpenP(true);
                  router.push("/bookmark/");
                }
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BookmarkIcon sx={{ fontSize: 16 }} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                if (pathname !== "/chat/") {
                  setIsOpenP(true);
                  router.push("/chat/");
                }
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex items-center justify-center">
                      <MessageIcon sx={{ fontSize: 16 }} className="absolute" />
                      <div className="absolute z-10">
                        <Unreadmessages userId={userId} />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div
                      onClick={() => {
                        if (pathname !== "/chat/") {
                          setIsOpenP(true);
                          router.push("/chat/");
                        }
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

            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                if (pathname !== "/plan/") {
                  setIsOpenP(true);
                  router.push("/plan/");
                }
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DiamondIcon sx={{ fontSize: 16 }} />
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
                    if (pathname !== "/ads/create") {
                      setIsOpenP(true);
                      router.push("/ads/create");
                    }
                  }}
                  className={`w-[100px] dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-full`}
                >
                  <SellOutlinedIcon sx={{ fontSize: 16 }} /> SELL
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
                  className={`w-[100px] dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-full`}
                >
                  <SellOutlinedIcon sx={{ fontSize: 16 }} /> SELL
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
          <MobileNav userstatus={userstatus} userId={userId} />
        </div>
      </div>
      <div>
        <Header onLoading={onLoading} AdsCountPerRegion={AdsCountPerRegion}/>
        <AppPopup />
        <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      </div>
    </div>
  );
}
