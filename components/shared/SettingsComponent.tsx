"use client";

import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Verification from "@/components/shared/Verification";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import SettingsEdit from "./SettingsEdit";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import NotificationPreferences from "./NotificationPreferences";
import TopBar from "../home/TopBar.client";

type setingsProp = {
  userId: string;
  user: any;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId: any) => void;
  handlePay: (id: string) => void;
  handleCategory: (value: string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSearchTab: (value: string) => void;
};

const SettingsComponent = ({
  userId,
  user,
  handlePay,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
}: setingsProp) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode;
    const isDark = savedTheme === mode;

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;

    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null;

  const isAdCreator = true;

  return (
    <div className="min-h-screen bg-slate-50 text-black dark:bg-[#131B1E] dark:text-[#F1F3F3]">

      {/* TopBar */}
      <TopBar />

      {/* MAIN WRAPPER */}
      <div className="mx-auto w-full max-w-4xl px-2 pb-24 pt-[calc(var(--topbar-h,64px)+16px)] md:px-4">

        {/* HEADER CARD */}
        <div className="mb-4 rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <SettingsOutlinedIcon />
              </div>

              <div>
                <h1 className="text-xl font-extrabold md:text-2xl">
                  Settings
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage your account, profile and preferences
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <Verification
                user={user}
                userId={userId}
                isAdCreator={isAdCreator}
                handlePayNow={handlePay}
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS CARD */}
        <div className="mb-4 rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-orange-500">
            Notifications
          </h2>

          <NotificationPreferences
            userId={userId}
            defaultValues={{ email: true, fcm: true }}
          />
        </div>

        {/* PROFILE SETTINGS */}
        <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">

          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-orange-500">
            Profile Information
          </h2>

          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-[#1B2225]">
            <SettingsEdit user={user} type="Update" userId={userId} />
          </div>

          <Toaster />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="hidden lg:block">
        <Footersub
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
        />
      </footer>

    </div>
  );
};

export default SettingsComponent;