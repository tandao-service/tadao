"use client";

import { useEffect, useState } from "react";
import { mode } from "@/constants";
import TopBar from "./TopBar.client";
import { useRouter } from "next/navigation";
import EventForm from "../shared/EventForm";

type DashboardProps = {
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

export default function DashboardSell({
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
}: DashboardProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode;
    setIsDarkMode(savedTheme === mode);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;
    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const resolveAdId = (value: any) =>
    value?._id || value?.adId?._id || value?.adId || value?.id || "";

  // TopBar already renders a spacer for its fixed status bar.
  // Only add a small visual gap here (not another --topbar-h offset).
  return (
    <div className="min-h-screen bg-[#EBEEF2] text-slate-900 dark:bg-[#131B1E] dark:text-[#F1F3F3]">
      <TopBar />

      <main className="mx-auto w-full max-w-[900px] px-3 pb-8 pt-2 sm:px-4 lg:px-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)] dark:border-[#2D3236] dark:bg-[#1B2225]">
          <div className="p-4 sm:p-5 lg:p-6">
            {isDarkMode === null ? (
              <div className="flex min-h-44 items-center justify-center gap-3 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
                Preparing the form...
              </div>
            ) : (
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
                handleAdView={(createdAd: any) => {
                  const id = resolveAdId(createdAd);
                  if (id) router.push(`/ads/${id}`);
                }}
                handlePay={(value: any) => {
                  const orderTrackingId =
                    value?.orderTrackingId || value?.tx || value?._id || value;
                  if (orderTrackingId) router.push(`/pay/${orderTrackingId}`);
                }}
                handleOpenShop={(shopId: string) => router.push(`/profile/${shopId}`)}
                handleOpenTerms={() => router.push("/terms")}
                type={type === "Update" ? "Update" : "Create"}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
