"use client"
import { getAllPackages } from "@/lib/actions/packages.actions";
import Image from "next/image";
import { getData } from "@/lib/actions/transactions.actions";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import Listpackages from "@/components/shared/listpackages";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
import { IPackages } from "@/lib/database/models/packages.model";
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale";
import PricingPlansSkeleton from "./PricingPlansSkeleton";
interface PackProps {
  userId: string;
  user: any;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handlePay: (id: string) => void;
  handleCategory: (value: string) => void;
  packagesList: any;
}

const PackageComponent = ({ userId, user, packagesList, onClose, handlePay, handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenChat, handleOpenPlan, handleOpenBook, handleOpenSell }: PackProps) => {

  const createdAt = new Date(user.transaction?.createdAt || new Date());
  const periodInDays = parseInt(user.transaction?.period) || 0;
  const expiryDate = new Date(createdAt.getTime() + periodInDays * 24 * 60 * 60 * 1000);
  const currentTime = new Date();
  const remainingTime = expiryDate.getTime() - currentTime.getTime();
  const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
  const planPackage = user.currentpack.name;
  const color = user.currentpack.color;




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
          <Navbar user={user?.user ?? []} userstatus={user?.user?.status ?? ""} userId={userId} onClose={onClose} popup={"plan"} handleOpenPlan={handleOpenPlan} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenChat={handleOpenChat}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            handleOpenShop={handleOpenShop}
          />
        </div>
        <div className="max-w-6xl mx-auto flex mt-[60px] mb-10 p-1">

          <div className="flex-1">
            <div className="w-full flex flex-col">
              <div className="">
                <section className="bg-bg-white p-1 rounded-lg">
                  <p className="text-[25px] font-bold">Plan</p>
                  <div className="wrapper flex">
                    <div className="text-center sm:text-left">
                      {daysRemaining > 0 ? (
                        <>
                          <div className="flex flex-col">
                            <div className="font-bold">
                              Subscription: {planPackage}
                            </div>
                            <div>Days remaining: {daysRemaining}</div>
                          </div>
                        </>
                      ) : (
                        <>Choose the plan that will work for you</>
                      )}


                    </div>
                  </div>
                </section>
                <Listpackages
                  packagesList={packagesList}
                  userId={userId}
                  daysRemaining={daysRemaining}
                  packname={planPackage}
                  user={user}
                  handlePayNow={handlePay}
                />
                <Toaster />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PackageComponent;
