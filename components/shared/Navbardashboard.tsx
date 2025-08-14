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
};

export default function Navbardashboard({
  userstatus,
  userId,
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
    <div className="w-full bg-gray-100">
      <div className="fixed bg-gradient-to-r from-orange-400 from-10% via-orange-500 via-40% to-orange-500 to-90% border-b z-10 flex p-3 w-full">
        <div className="flex-1">
          <div className="flex items-center">

            <div
              className="mr-5 w-5 h-8 flex items-center justify-center rounded-sm text-white hover:text-gray-100 hover:cursor-pointer"
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

            <div className="flex items-center gap-2">

              <StyledBrandName />
            </div>

          </div>
        </div>

        <div className="hidden lg:inline">
          <div className="flex items-center gap-2">

            <div>
              <SignedOut>
                <button
                  onClick={() => {
                    setIsOpenP(true);
                    router.push("/sign-in");
                  }}
                  className={`w-[100px] dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-full`}
                >
                  <SellOutlinedIcon sx={{ fontSize: 16 }} /> Sign In
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

        </div>
      </div>
      <div>
        <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      </div>
    </div>
  );
}
