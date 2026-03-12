"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Unreadmessages from "./Unreadmessages";
import MobileNav from "./MobileNav";
import StyledBrandName from "./StyledBrandName";
import ProgressPopup from "./ProgressPopup";
import Header from "@/components/shared/Header";
import { useAuth } from "@/app/hooks/useAuth";
import UserMenu from "./UserMenu";
import CircularProgress from "@mui/material/CircularProgress";
import { Toast } from "@radix-ui/react-toast";
import { useToast } from "../ui/use-toast";
import { Icon } from "@iconify/react";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1"; // Correct import

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

export default function NavbarhomeSkeleton({
  userstatus,
  AdsCountPerRegion,
  isnav,
  user,
  onClose,
  popup,
  handleFilter,
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
  handleOpenSearchByTitle,
}: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === "/";
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => setIsOpenP(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast()

  return (
    <div
      className={`w-full bg-gradient-to-r from-orange-500 from-10% via-orange-500 via-40% to-orange-500 to-90% ${isnav
        ? "lg:from-orange-500 lg:via-orange-400 lg:to-orange-500"
        : "lg:from-transparent lg:via-transparent lg:to-transparent"
        }`}
    >
      <div
        className={`fixed z-10 flex p-3 w-full bg-gradient-to-r from-orange-500 from-10% via-orange-500 via-40% to-orange-500 to-90% ${isnav
          ? "lg:from-orange-500 lg:via-orange-400 lg:to-orange-500"
          : "lg:from-transparent lg:via-transparent lg:to-transparent"
          }`}
      >
        <div className="flex-1 flex items-center gap-2">
          <StyledBrandName />
        </div>

        <div className="hidden lg:inline">
          <div className="flex items-center gap-2">
            {/* Bookmark */}
            <div
              className="w-8 h-8 flex text-white hover:bg-orange-300 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Bookmark"
              onClick={() =>
                toast({
                  title: "Please wait",
                  description: (
                    <div className="flex items-center gap-2">
                      <CircularProgress sx={{ color: '#000000' }} size={20} />
                      <span>Loading...</span>
                    </div>
                  ),
                })
              }
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

            {/* Chat */}
            <div
              className="w-8 h-8 flex text-white hover:bg-orange-400 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() =>
                toast({
                  title: "Please wait",
                  description: (
                    <div className="flex items-center gap-2">
                      <CircularProgress sx={{ color: '#000000' }} size={20} />
                      <span>Loading...</span>
                    </div>
                  ),
                })
              }
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex items-center justify-center">
                      <MessageIcon className="absolute" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>

                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Premium */}
            <div
              className="w-8 h-8 flex text-white hover:bg-orange-400 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Premium Services"
              onClick={() =>
                toast({
                  title: "Please wait",
                  description: (
                    <div className="flex items-center gap-2">
                      <CircularProgress sx={{ color: '#000000' }} size={20} />
                      <span>Loading...</span>
                    </div>
                  ),
                })
              }
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

            {/* Sell */}
            <button
              onClick={() =>
                toast({
                  title: "Please wait",
                  description: (
                    <div className="flex items-center gap-2">
                      <CircularProgress sx={{ color: '#000000' }} size={20} />
                      <span>Loading...</span>
                    </div>
                  ),
                })
              }
              className={`w-[100px] dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-white text-gray-500 hover:text-gray-900 p-1 rounded-full`}
            >
              <SellOutlinedIcon /> SELL
            </button>

            {/* User avatar */}
          </div>
        </div>
        <Icon icon={Gooeyballs} className="w-10 h-10 text-white" />
      </div>

      <Header handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle} AdsCountPerRegion={AdsCountPerRegion} />
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
