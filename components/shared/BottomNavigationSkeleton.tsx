"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Unreadmessages from "./Unreadmessages";
import ProgressPopup from "./ProgressPopup";
import { useAuth } from "@/app/hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "../ui/use-toast";

type navprop = {
  userId: string;
  popup: string;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchTab: (value: string) => void;
  handleOpenP: () => void;
};

const BottomNavigationSkeleton = ({
  userId,
  popup,
  handleOpenP,
  handleOpenSearchTab,
  handleOpenSettings,
  handleOpenSell,
  handleOpenChat,
  onClose,
}: navprop) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user: currentUser } = useAuth(); // Firebase user
  const { toast } = useToast()

  return (
    <nav className="dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bottom-0 z-5 w-full bg-white shadow-md border-t dark:border-gray-700 border-gray-200">
      <div className="flex justify-around py-2 relative">

        {/* Home */}
        <div onClick={onClose}>
          <div
            className={`flex cursor-pointer flex-col items-center hover:text-orange-500 ${popup === "home" ? "text-orange-500" : "dark:text-gray-400 text-gray-600"
              }`}
          >
            <span><HomeIcon /></span>
            <span className="text-xs">Home</span>
          </div>
        </div>

        {/* Search */}
        <div onClick={() => handleOpenSearchTab("Vehicle")}>
          <div
            className={`flex flex-col cursor-pointer items-center hover:text-orange-500 ${popup === "category" ? "text-orange-500" : "dark:text-gray-400 text-gray-600"
              }`}
          >
            <span><SearchOutlinedIcon /></span>
            <span className="text-xs">Search</span>
          </div>
        </div>

        {/* Sell */}
        <div
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
          <div
            className={`flex flex-col cursor-pointer items-center hover:text-orange-500 ${popup === "sell" ? "text-orange-500" : "dark:text-gray-400 text-gray-600"
              }`}
          >
            <span><AddCircleOutlineOutlinedIcon /></span>
            <span className="text-xs">Sell</span>
          </div>
        </div>

        {/* Chat */}
        <div
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
          <div
            className={`flex cursor-pointer flex-col items-center hover:text-orange-500 ${popup === "chat" ? "text-orange-500" : "dark:text-gray-400 text-gray-600"
              }`}
          >
            <span className="relative inline-block w-6 h-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <CommentOutlinedIcon />
              </div>

            </span>
            <span className="text-xs">Chat</span>
          </div>
        </div>

        {/* Profile */}
        <div
          className={`flex flex-col cursor-pointer items-center hover:text-orange-500 ${popup === "settings" ? "text-orange-500" : "dark:text-gray-400 text-gray-600"
            }`}
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
          <span><PersonOutlineOutlinedIcon /></span>
          <span className="text-xs">Profile</span>
        </div>

      </div>
    </nav>
  );
};

export default BottomNavigationSkeleton;
