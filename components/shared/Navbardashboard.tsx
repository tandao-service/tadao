"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import StyledBrandName from "./StyledBrandName";
import ProgressPopup from "./ProgressPopup";
import { useAuth } from "@/app/hooks/useAuth";


type NavProps = {
  userstatus: string;
  userId: string;
};

export default function Navbardashboard({ userstatus }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => setIsOpenP(false);

  const { user } = useAuth();

  const requireAuthRedirect = () => {
    if (!user) {
      setIsOpenP(true);
      router.push("/auth"); // Firebase auth page
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div className="fixed bg-gradient-to-r from-orange-500 from-10% via-orange-400 via-40% to-orange-500 to-90% border-b z-10 flex p-3 w-full">
        <div className="flex-1 flex items-center">
          {/* Back button */}
          <div
            className="mr-5 w-5 h-8 flex items-center justify-center rounded-sm text-white hover:text-gray-100 hover:cursor-pointer"
            data-tip="Back"
            onClick={() => router.back()}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ArrowBackOutlinedIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <StyledBrandName />
          </div>
        </div>

        <div className="hidden lg:inline flex items-center gap-2">
          {!user && (
            <button
              onClick={requireAuthRedirect}
              className="w-[100px] dark:bg-[#131B1E] dark:hover:bg-[#2D3236] dark:text-gray-300 bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-full"
            >
              <SellOutlinedIcon sx={{ fontSize: 16 }} /> Sign In
            </button>
          )}


        </div>
      </div>

      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
