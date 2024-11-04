"use client";
import React from "react";
import { UpdateUserParams } from "@/types";
import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
import ViewListIcon from "@mui/icons-material/ViewList";
import Image from "next/image";
import { useRouter, redirect, usePathname } from "next/navigation";
//import { useSession } from "next-auth/react";
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
};
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
const NavbarChats = ({ recipient, userId }: sidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/";

  return (
    <div className="flex p-2 lg:p-3 gap-1 w-full bg-gradient-to-b lg:bg-gradient-to-r from-emerald-800 to-emerald-950">
      <div className="flex-1">
        <div className="flex items-center">
          {!isActive && (
            <div
              className="mr-5 w-5 h-8 flex items-center justify-center rounded-sm text-white tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Back"
              onClick={() => router.back()}
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
                <Link
                  href={`/shop/${userId}`}
                  className="no-underline font-boldm-1"
                >
                  <span className="text-gray-100 text-sm cursor-pointer font-bold">
                    {recipient.firstName} {recipient.lastName}
                  </span>
                </Link>
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white emerald-500 tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Messages"
            onClick={() => router.push(`/bookmark/`)}
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Messages"
            onClick={() => router.push(`/plan/`)}
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
              <Link href="/ads/create">
                <button
                  className={`w-[100px] bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] hover:bg-[#30AF5B] text-white p-1 rounded-full`}
                >
                  <AddCircleOutlineOutlinedIcon /> SELL
                </button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <button
                  className={`w-[100px] bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] hover:bg-[#30AF5B] text-white p-1 rounded-full`}
                >
                  <AddCircleOutlineOutlinedIcon /> SELL
                </button>
              </Link>
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
