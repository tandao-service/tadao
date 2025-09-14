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
import GavelIcon from "@mui/icons-material/Gavel";             // Auction
import SearchIcon from "@mui/icons-material/Search";           // Lost & Found
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Alt for Lost & Found
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
type NavProps = {
  userstatus: string;
  userId: string;
  user: any;
  AdsCountPerRegion: any;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: (category?: string, subcategory?: string) => void;
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

export default function Navbarhome({
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
  const { user: currentUser, signOutUser } = useAuth(); // Firebase auth


  const requireAuthRedirect = () => {
    if (!user?._id) {
      setIsOpenP(true);
      router.push("/auth"); // your Firebase auth page
    } else {

    }
  };

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


            {/* Secondary actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Post Ad (Primary CTA) */}
              {!user && currentUser ? (<></>) : (<>
                <button
                  onClick={() => (user?._id ? handleOpenSell() : requireAuthRedirect())}

                  className="w-[120px] text-sm dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-white hover:text-orange-400 text-gray-900 p-1 rounded-full flex items-center justify-center gap-1"
                >
                  <SellOutlinedIcon /> Post Ad
                </button>

                {/* Donated Items */}
                <button
                  onClick={() => (user?._id ? handleOpenSell() : requireAuthRedirect())}
                  className="px-3 py-1 text-sm dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-white hover:text-orange-400 text-gray-900 p-1 rounded-full flex items-center justify-center gap-1"
                >
                  <VolunteerActivismIcon fontSize="small" /> Donated
                </button>

                {/* Auction */}
                <button
                  onClick={() => (user?._id ? handleOpenSell('Donations', 'Donated Items') : requireAuthRedirect())}
                  className="px-3 py-1 text-sm dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-white hover:text-orange-400 text-gray-900 p-1 rounded-full flex items-center justify-center gap-1"
                >
                  <GavelIcon fontSize="small" /> Auction
                </button>

                {/* Lost & Found */}
                <button
                  onClick={() => (user?._id ? handleOpenSell('Lost and Found', 'Lost and Found Items') : requireAuthRedirect())}
                  className="px-3 py-1 text-sm dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-white hover:text-orange-400 text-gray-900 p-1 rounded-full flex items-center justify-center gap-1"
                >
                  <SearchIcon fontSize="small" /> Lost & Found
                </button>
              </>)}

            </div>
            <div
              className="w-8 h-8 flex text-white hover:bg-orange-300 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Bookmark"
              onClick={() => (user?._id ? handleOpenBook() : requireAuthRedirect())}
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
              className="w-8 h-8 flex text-white hover:bg-orange-300 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => (user?._Id ? handleOpenChat() : requireAuthRedirect())}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex items-center justify-center">
                      <MessageIcon className="absolute" />
                      <div className="absolute z-10">{user?._Id && <Unreadmessages userId={user?._Id} />}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div onClick={() => user?._Id && handleOpenChat()} className="flex gap-1">
                      Chats
                      {user?._Id && <Unreadmessages userId={user?._Id} />}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Premium */}
            <div
              className="w-8 h-8 flex text-white hover:bg-orange-300 items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] tooltip tooltip-bottom hover:cursor-pointer"
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
            {/* User avatar */}
          </div>
        </div>
        <UserMenu userdata={user} handleOpenShop={handleOpenShop} handleOpenSettings={handleOpenSettings} />
        <MobileNav
          user={user}
          userstatus={userstatus}
          userId={user?._Id}
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
      </div>

      <Header handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle} AdsCountPerRegion={AdsCountPerRegion} />
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
