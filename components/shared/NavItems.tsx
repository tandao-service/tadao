"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import StackedLineChartOutlinedIcon from "@mui/icons-material/StackedLineChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DiamondIcon from "@mui/icons-material/Diamond";
import SettingsIcon from "@mui/icons-material/Settings";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import ProgressPopup from "./ProgressPopup";
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
const NavItems = ({ userstatus, userId, user, popup, onClose, handleclicklink, handleOpenSettings, handleOpenPlan, handleOpenBook, handleOpenPerfomance, handleOpenChat, handleOpenSell, handleOpenShop }: NavItemsProps) => {
  const pathname = usePathname();
  const [isOpenP, setIsOpenP] = useState(false);
  const router = useRouter();
  const handleCloseP = () => {
    setIsOpenP(false);
  };
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const shareUrl = "https://tadaoservices.com"; // Replace with the URL you want to share

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out Tadao",
          text: "I found this amazing online marketing site!",
          url: shareUrl,
        });
        console.log("Share was successful.");
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      console.log("Share not supported on this browser.");
      // You can also show a modal or a tooltip with the URL or instructions here.
    }
  };
  return (
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white w-full">
      <ul>
        {headerLinks
          .filter((link) => !(userstatus === "User" && link.label === "Admin"))
          .map((link) => {
            const isActive = capitalizeFirstLetter(popup) === link.label;
            let linki = link.route;
            //  if (link.label === "My Shop") {
            //    linki = link.route + "/" + userId;
            //  }

            return (
              <>
                <SignedIn>
                  <li key={link.route}>
                    <div>

                      {link.label === "Home" && (<div
                        onClick={() => { onClose(); handleclicklink(); }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        <span>
                          <HomeIcon className="w-10 p-1" />
                        </span>
                        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1" />
                        </span></div>
                      )}
                      {link.label === "Sell" && (<div
                        onClick={() => { handleOpenSell(); handleclicklink() }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        <span>
                          <SellOutlinedIcon className="w-10 p-1" />

                        </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1" />


                        </span>
                      </div>
                      )}
                      {link.label === "My Shop" && (
                        <div
                          onClick={() => { handleOpenShop(user); handleclicklink(); }}
                          className={`${isActive &&
                            "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                            } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                        > <span>
                            <FormatListBulletedOutlinedIcon className="w-10 p-1" />
                          </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                            {link.label}
                          </span>
                          <span className="text-right my-auto">
                            <ArrowForwardIosIcon className="w-10 p-1" />

                          </span>
                        </div>
                      )}
                      {link.label === "Chat" && (<div
                        onClick={() => { handleOpenChat(); handleclicklink(); }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        <span>

                          <CommentOutlinedIcon className="w-10 p-1 " />
                        </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                      </div>
                      )}
                      {link.label === "Performance" && (<div
                        onClick={() => { handleOpenPerfomance(); handleclicklink(); }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        <span>
                          <StackedLineChartOutlinedIcon className="w-10 p-1 " />
                        </span>
                        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                      </div>)}
                      {link.label === "Bookmark" && (<div
                        onClick={() => { handleOpenBook(); handleclicklink(); }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        <span>
                          <BookmarkIcon className="w-10 p-1 " />
                        </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>

                      </div>
                      )}
                      {link.label === "Plan" && (<div
                        onClick={() => { handleOpenPlan(); handleclicklink(); }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        <span>
                          <DiamondIcon className="w-10 p-1 " />
                        </span>
                        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                      </div>
                      )}
                      {link.label === "Profile" && (<div
                        onClick={() => { handleOpenSettings(); handleclicklink(); }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >

                        <span>
                          <PersonOutlineOutlinedIcon className="w-10 p-1 " />
                        </span>
                        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                      </div>)}

                      {link.label === "Admin" && (<div
                        onClick={() => {
                          setIsOpenP(true);
                          //handleclicklink();
                          router.push("/home");
                        }}
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        <span>
                          <ManageAccountsOutlinedIcon className="w-10 p-1 " />
                        </span>
                        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                      </div>)}


                    </div>
                  </li>
                </SignedIn>

                <SignedOut>
                  <li key={link.route}>
                    <div
                      onClick={() => {
                        //if (!isActive) {
                        setIsOpenP(true);
                        // handleclicklink();
                        router.push("/sign-in");
                        // } else {
                        //  onClose();
                        //}
                      }}
                    >
                      <div
                        className={`${isActive &&
                          "dark:bg-[#BD7A4F] dark:text-white bg-[#BD7A4F] text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}
                      >
                        {link.label === "Home" && (
                          <span>
                            <HomeIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Sell" && (
                          <span>
                            <SellOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "My Shop" && (
                          <span>
                            <FormatListBulletedOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Chat" && (
                          <span>
                            <CommentOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Performance" && (
                          <span>
                            <StackedLineChartOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Bookmark" && (
                          <span>
                            <BookmarkIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Plan" && (
                          <span>
                            <DiamondIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Profile" && (
                          <span>
                            <PersonOutlineOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}

                        {link.label === "Admin" && (
                          <span>
                            <ManageAccountsOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                      </div>
                    </div>
                  </li>
                </SignedOut>

              </>
            );
          })}
      </ul>
      <div
        onClick={handleShare}
        className={`flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-[#FAE6DA] rounded-sm hover:text-[#BD7A4F] p-3 mb-1 hover:cursor-pointer`}>
        <span>
          <ShareOutlinedIcon className="w-10 p-1 " />
        </span>
        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
          Share
        </span>
        <span className="text-right my-auto">
          <ArrowForwardIosIcon className="w-10 p-1" />
        </span>
      </div>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
};

export default NavItems;
