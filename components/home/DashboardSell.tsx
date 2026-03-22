"use client";

import { useEffect, useState } from "react";
import { mode } from "@/constants";
import TopBar from "./TopBar.client";
import { useRouter } from "next/navigation";
import EventForm from "../shared/EventForm";

type dashboardProps = {
  userId: string;
  user: any;
  userImage: string;
  userName: string;
  type: string;
  ad?: any;
  adId?: string;
  packagesList: any;
  category?: string;
  subcategory?: string;
  subcategoryList: any;
  payStatus?: string;
  tx?: string;
};

const DashboardSell = ({
  userId,
  user,
  userName,
  userImage,
  type,
  ad,
  adId,
  packagesList,
  category,
  subcategory,
  subcategoryList,
  payStatus,
  tx,
}: dashboardProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const router = useRouter();

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

  const resolveAdId = (value: any) =>
    value?._id || value?.adId?._id || value?.adId || value?.id || "";

  if (isDarkMode === null) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-black dark:bg-[#131B1E] dark:text-[#F1F3F3]">
      <TopBar />

      <div className="mx-auto w-full max-w-5xl px-3 pb-10 pt-[calc(var(--topbar-h,64px)+12px)] lg:px-4">
        <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm dark:border-[#2D3236] dark:bg-[#1B2225]">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-6 text-white lg:px-8 lg:py-8">
            <h1 className="text-2xl font-extrabold tracking-[-0.02em] lg:text-4xl">
              {type === "Update" ? "Update Your Ad" : "Create New Ad"}
            </h1>
            <p className="mt-2 text-sm text-orange-50 lg:text-base">
              {type === "Update"
                ? "Edit your listing details, photos, and pricing, then save your changes."
                : "Fill in your ad details and publish professionally on Tadao Market."}
            </p>
          </div>

          <div className="p-2 lg:p-4">
            <EventForm
              userId={userId}
              userImage={userImage}
              ad={ad}
              categories={subcategoryList}
              adId={adId}
              user={user}
              userName={userName}
              category={category}
              subcategory={subcategory}
              packagesList={packagesList}
              payStatus={payStatus}
              tx={tx}
              handleAdView={(ad: any) => {
                const id = resolveAdId(ad);
                if (!id) return;
                router.push(`/ads/${id}`);
              }}
              handlePay={(value: any) => {
                const orderTrackingId =
                  value?.orderTrackingId || value?.tx || value?._id || value;
                if (!orderTrackingId) return;
                router.push(`/pay/${orderTrackingId}`);
              }}
              handleOpenShop={(shopId: string) => router.push(`/profile/${shopId}`)}
              handleOpenTerms={() => router.push(`/terms`)}
              type={type === "Update" ? "Update" : "Create"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSell;