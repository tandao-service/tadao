"use client";

import { headerLinks } from "@/constants";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/app/hooks/useAuth";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { ScrollArea } from "@/components/ui/scroll-area";

type NavItemsProps = {
  userstatus: string;
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
  const router = useRouter();
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => setIsOpenP(false);

  const { user: currentUser } = useAuth();

  const shareUrl = "https://tadaomarket.com";

  const handleShare = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: "Check out Tadao Market",
          text: "I found this amazing online marketing site!",
          url: shareUrl,
          dialogTitle: "Share via",
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Check out Tadao Market!",
          url: shareUrl,
        });
      } else {
        alert("Sharing is not supported on this device.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const iconMap: Record<string, React.ReactNode> = {
    Home: <HomeIcon fontSize="small" />,
    Sell: <SellOutlinedIcon fontSize="small" />,
    "Public Profile": <FormatListBulletedOutlinedIcon fontSize="small" />,
    Chat: <CommentOutlinedIcon fontSize="small" />,
    "My dashboard": <StackedLineChartOutlinedIcon fontSize="small" />,
    Bookmark: <BookmarkIcon fontSize="small" />,
    Plan: <DiamondIcon fontSize="small" />,
    Settings: <PersonOutlineOutlinedIcon fontSize="small" />,
    Admin: <ManageAccountsOutlinedIcon fontSize="small" />,
  };

  const itemBase =
    "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200 cursor-pointer";
  const itemActive =
    "border-orange-200 bg-orange-500 text-white shadow-sm";
  const itemInactive =
    "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-[#2D3236] dark:text-slate-200 dark:hover:border-orange-500/30 dark:hover:bg-[#222C31] dark:hover:text-orange-300";

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-[24px] bg-white dark:bg-[#131B1E]">
      <div className="mb-4 px-1">
        <div className="rounded-[22px] border border-orange-100 bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-4 text-white shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-50">
            Navigation
          </p>
          <p className="mt-1 text-sm font-medium text-white/90">
            Quick access to your marketplace actions
          </p>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 pr-1">
        <ul className="space-y-2 px-1">
          {headerLinks
            .filter((link) => !(userstatus === "User" && link.label === "Admin"))
            .map((link) => {
              const isActive = popup === link.label;

              const handleItemClick = () => {
                if (currentUser) {
                  switch (link.label) {
                    case "Home":
                      onClose();
                      handleclicklink();
                      break;
                    case "Sell":
                      handleOpenSell();
                      handleclicklink();
                      break;
                    case "Public Profile":
                      handleOpenShop(user);
                      handleclicklink();
                      break;
                    case "Chat":
                      handleOpenChat();
                      handleclicklink();
                      break;
                    case "My dashboard":
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
                    case "Settings":
                      handleOpenSettings();
                      handleclicklink();
                      break;
                    case "Admin":
                      router.push("/home");
                      break;
                    default:
                      break;
                  }
                } else {
                  setIsOpenP(true);
                  router.push("/auth");
                }
              };

              return (
                <li key={link.route}>
                  <div
                    onClick={handleItemClick}
                    className={`${itemBase} ${isActive ? itemActive : itemInactive}`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${isActive
                        ? "bg-white/15 text-white"
                        : "bg-orange-50 text-orange-600 group-hover:bg-white dark:bg-orange-500/10 dark:text-orange-300"
                        }`}
                    >
                      {iconMap[link.label]}
                    </span>

                    <span className="flex-1 text-sm font-semibold">
                      {link.label}
                    </span>

                    <span
                      className={`transition ${isActive
                        ? "text-white/80"
                        : "text-slate-400 group-hover:text-orange-500 dark:text-slate-500 dark:group-hover:text-orange-300"
                        }`}
                    >
                      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>

        <div className="mt-4 border-t border-slate-100 px-1 pt-4 dark:border-slate-800">
          <div
            onClick={handleShare}
            className={`${itemBase} ${itemInactive}`}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition group-hover:bg-white dark:bg-orange-500/10 dark:text-orange-300">
              <ShareOutlinedIcon fontSize="small" />
            </span>

            <span className="flex-1 text-sm font-semibold">Share</span>

            <span className="text-slate-400 transition group-hover:text-orange-500 dark:text-slate-500 dark:group-hover:text-orange-300">
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </span>
          </div>
        </div>
      </ScrollArea>

      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}