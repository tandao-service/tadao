"use client";

import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { Toaster } from "../ui/toaster";
import TopBar from "./TopBar.client";
import SellerProfileSidebar from "../shared/SellerProfileSidebar";
import CollectionMyads from "../shared/CollectionMyads";
import Footersub from "../shared/Footersub";
type CollectionProps = {
  userId: string;
  shopAcc: any;
  sortby: string;
  userImage: string;
  userName: string;
  user: any;
  loans: any;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  queryObject: any;
  urlParamName?: string;
  // isAdCreator: boolean;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdEdit: (ad: any) => void;
  handleAdView: (ad: any) => void;
  handleOpenReview: (value: any) => void;
  handleOpenChatId: (value: string) => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id: string) => void;
};

const DashboardMyads = ({
  userId,
  //data,
  // packname,
  // daysRemaining,
  loans,
  emptyTitle,
  emptyStateSubtext,
  sortby,
  userImage,
  userName,
  collectionType,
  urlParamName,
  // isAdCreator,
  user,
  shopAcc,
  queryObject,
  handlePay,
  handleOpenReview,
  handleOpenChatId,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPerfomance,
  onClose, handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenSell, handleAdEdit, handleAdView, handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety,
}: // Accept the onSortChange prop
  CollectionProps) => {
  //  const [activeButton, setActiveButton] = useState(0);
  const [isVertical, setisVertical] = useState(true);
  const [loading, setLoading] = useState(false);
  const isAdCreator = userId === shopAcc._id;
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {

    const sub = user?.subscription;

    let remaining = 0;
    let expiresAt: Date | null = null;

    if (sub && sub.planName && String(sub.planName).toLowerCase() !== "free") {

      remaining = sub.remainingAds ?? 0;
      expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;

      const expired =
        expiresAt instanceof Date && !isNaN(expiresAt.getTime())
          ? new Date() > expiresAt
          : false;

      if (expiresAt && !expired) {
        const diff =
          Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) || 0;
        setDaysRemaining(diff);
      } else {
        setDaysRemaining(0);
      }
    } else {
      remaining = Number(user?.subscription?.remainingAds ?? 0) || 999999;
      setDaysRemaining(0);
    }
  }, [user]);


  //console.log("loggedId:" + loggedId);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
    const isDark = savedTheme === mode;

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return; // Prevent running on initial mount

    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null; // Avoid flickering before state is set

  return (
    <>
      <div className="h-[100vh] bg-gray-100 p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] overflow-hidden">
        <div className="h-full overflow-y-auto bg-gray-100 border">
          <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>
          <div className="top-0 z-10 fixed w-full">
            <TopBar />
          </div>
          <div className="lg:p-4 mt-[60px]">
            <div className="w-full flex flex-col">
              <div className="w-full flex">
                <div className="hidden lg:inline">
                  <div className="w-full">

                    <div className="flex mt-2 lg:mt-0 gap-1 flex-col rounded-lg flex justify-center items-center w-full h-full">


                      <SellerProfileSidebar
                        user={shopAcc}
                        loggedId={userId}
                        userId={shopAcc._id}
                        daysRemaining={daysRemaining}
                        pack={user?.subscription?.planName || "Free"}
                        color={"#000000"}
                        handleOpenReview={handleOpenReview}
                        handleOpenChatId={handleOpenChatId}
                        handleOpenSettings={handleOpenSettings}
                        handleOpenPlan={handleOpenPlan}
                        handlePay={handlePay} />


                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-screen">
                  <div className="p-1 lg:hidden">
                    <div className="flex flex-col gap-1 w-full ">



                      <SellerProfileSidebar
                        user={shopAcc}
                        loggedId={userId}
                        userId={shopAcc._id}
                        daysRemaining={daysRemaining}
                        pack={user?.subscription?.planName || "Free"}
                        color={"#000000"}
                        handleOpenReview={handleOpenReview}
                        handleOpenChatId={handleOpenChatId}
                        handleOpenSettings={handleOpenSettings}
                        handleOpenPlan={handleOpenPlan}
                        handlePay={handlePay} />
                    </div>
                  </div>
                  <div className="lg:flex-row lg:m-3 justify-center">


                    <section className="p-1">

                      <CollectionMyads
                        emptyTitle="No ads have been created yet"
                        emptyStateSubtext="Go create some now"
                        collectionType="Ads_Organized"
                        limit={20}
                        loans={loans}
                        sortby={sortby}
                        urlParamName="adsPage"
                        userId={shopAcc._id}
                        isAdCreator={isAdCreator}
                        isVertical={isVertical}
                        loadPopup={loading}
                        handleAdView={handleAdView}
                        handleAdEdit={handleAdEdit}
                        handleOpenPlan={handleOpenPlan}
                        handleOpenChatId={handleOpenChatId}
                      />
                    </section>
                  </div>
                </div>
              </div>

            </div>
            <Toaster />
          </div>
          <footer>
            <Footersub
              handleOpenAbout={handleOpenAbout}
              handleOpenTerms={handleOpenTerms}
              handleOpenPrivacy={handleOpenPrivacy}
              handleOpenSafety={handleOpenSafety} />
          </footer>
        </div>
      </div>
    </>
  );
};

export default DashboardMyads;
