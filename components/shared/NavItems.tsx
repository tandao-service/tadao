"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { ArrowForwardIos as ArrowForwardIosIcon } from "@mui/icons-material";
import {
  Home as HomeIcon,
  SellOutlined as SellOutlinedIcon,
  FormatListBulletedOutlined as FormatListBulletedOutlinedIcon,
  CommentOutlined as CommentOutlinedIcon,
  StackedLineChartOutlined as StackedLineChartOutlinedIcon,
  Bookmark as BookmarkIcon,
  Diamond as DiamondIcon,
  PersonOutlineOutlined as PersonOutlineOutlinedIcon,
  ManageAccountsOutlined as ManageAccountsOutlinedIcon,
  ShareOutlined as ShareOutlinedIcon,
} from "@mui/icons-material";
import ProgressPopup from "./ProgressPopup";

import StyledBrandName from "./StyledBrandName";
import { useAuth } from "@/app/hooks/useAuth";

type NavItemsProps = {
  userstatus: string;
  userId: string;
  popup: string;
  user: any;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleclicklink: () => void;
};

export default function NavItems({
  userstatus,
  userId,
  user,
  popup,
  onClose,
  handleclicklink,
  handleOpenSettings,
  handleOpenPlan,
  handleOpenBook,
  handleOpenPerfomance,
  handleOpenChat,
  handleOpenSell,
  handleOpenShop,
}: NavItemsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => setIsOpenP(false);

  const { user: currentUser } = useAuth(); // Firebase user

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const shareUrl = "https://tadaomarket.com"; // Replace with your share URL

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out Tadao",
          text: "I found this amazing online marketing site!",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      console.log("Share not supported on this browser.");
    }
  };

  return (
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white w-full">
      <ul>
        {headerLinks
          .filter((link) => !(userstatus === "User" && link.label === "Admin"))
          .map((link) => {
            const isActive = capitalizeFirstLetter(popup) === link.label;

            // If user is logged in
            if (currentUser) {
              return (
                <li key={link.route}>
                  <div
                    onClick={() => {
                      switch (link.label) {
                        case "Home":
                          onClose();
                          handleclicklink();
                          break;
                        case "Sell":
                          handleOpenSell();
                          handleclicklink();
                          break;
                        case "My Shop":
                          handleOpenShop(user);
                          handleclicklink();
                          break;
                        case "Chat":
                          handleOpenChat();
                          handleclicklink();
                          break;
                        case "Performance":
                          handleOpenPerfomance();
                          handleclicklink();
                          break;
                        case "Bookmark":
                          handleOpenBook();
                          handleclicklink();
                          break;
                        case "Plan":
                          handleOpenPlan();
                          handleclicklink();
                          break;
                        case "Profile":
                          handleOpenSettings();
                          handleclicklink();
                          break;
                        case "Admin":
                          setIsOpenP(true);
                          router.push("/home");
                          break;
                        default:
                          break;
                      }
                    }}
                    className={`${isActive
                      ? "dark:bg-orange-500 dark:text-white bg-orange-500 text-white rounded-full"
                      : "dark:bg-[#2D3236] dark:hover:bg-gray-800 hover:bg-gray-100 rounded-sm hover:text-orange-500"
                      } flex p-3 mb-1 hover:cursor-pointer`}
                  >
                    <span className="w-10 p-1">
                      {{
                        Home: <HomeIcon />,
                        Sell: <SellOutlinedIcon />,
                        "My Shop": <FormatListBulletedOutlinedIcon />,
                        Chat: <CommentOutlinedIcon />,
                        Performance: <StackedLineChartOutlinedIcon />,
                        Bookmark: <BookmarkIcon />,
                        Plan: <DiamondIcon />,
                        Profile: <PersonOutlineOutlinedIcon />,
                        Admin: <ManageAccountsOutlinedIcon />,
                      }[link.label]}
                    </span>
                    <span className="flex-1 text-sm mr-5 my-auto">{link.label}</span>
                    <span className="text-right my-auto">
                      <ArrowForwardIosIcon className="w-10 p-1" />
                    </span>
                  </div>
                </li>
              );
            }

            // If user is not logged in
            return (
              <li key={link.route}>
                <div
                  onClick={() => {
                    setIsOpenP(true);
                    router.push("/auth"); // Firebase login page
                  }}
                  className={`${isActive
                    ? "dark:bg-orange-500 dark:text-white bg-orange-500 text-white rounded-full"
                    : "dark:bg-[#2D3236] dark:hover:bg-gray-800 hover:bg-gray-100 rounded-sm hover:text-orange-500"
                    } flex p-3 mb-1 hover:cursor-pointer`}
                >
                  <span className="w-10 p-1">
                    {{
                      Home: <HomeIcon />,
                      Sell: <SellOutlinedIcon />,
                      "My Shop": <FormatListBulletedOutlinedIcon />,
                      Chat: <CommentOutlinedIcon />,
                      Performance: <StackedLineChartOutlinedIcon />,
                      Bookmark: <BookmarkIcon />,
                      Plan: <DiamondIcon />,
                      Profile: <PersonOutlineOutlinedIcon />,
                      Admin: <ManageAccountsOutlinedIcon />,
                    }[link.label]}
                  </span>
                  <span className="flex-1 text-sm mr-5 my-auto">{link.label}</span>
                  <span className="text-right my-auto">
                    <ArrowForwardIosIcon className="w-10 p-1" />
                  </span>
                </div>
              </li>
            );
          })}
      </ul>

      {/* Share button */}
      <div
        onClick={handleShare}
        className="flex dark:bg-[#2D3236] dark:hover:bg-gray-800 hover:bg-gray-100 rounded-sm hover:text-orange-500 p-3 mb-1 hover:cursor-pointer"
      >
        <span className="w-10 p-1">
          <ShareOutlinedIcon />
        </span>
        <span className="flex-1 text-sm mr-5 my-auto">Share</span>
        <span className="text-right my-auto">
          <ArrowForwardIosIcon className="w-10 p-1" />
        </span>
      </div>

      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
