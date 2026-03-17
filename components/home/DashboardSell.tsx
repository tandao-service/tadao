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

  if (isDarkMode === null) return null;

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

        <div className="z-10 top-0 fixed w-full">
          <TopBar />
        </div>

        <div className="flex flex-col justify-center w-full h-full mt-[70px]">
          <div className="p-1 lg:p-2 flex min-h-[100vh] flex-col w-full lg:max-w-3xl lg:mx-auto h-full rounded-lg">
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
              handleAdView={(ad: any) => router.push(`/property/${ad._id}`)}
              handlePay={(ad: any) => router.push(`/pay/${ad._id}`)}
              handleOpenShop={(shopId: string) => router.push(`/profile/${shopId}`)}
              handleOpenTerms={() => router.push(`/terms`)}
              type={"Create"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSell;