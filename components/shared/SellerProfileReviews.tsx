"use client";

import React, { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Verification from "./Verification";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Button } from "../ui/button";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

type CollectionProps = {
  userId: string;
  loggedId: string;
  user: any;
  handleOpenReview: (value: any) => void;
  handleOpenChatId: (value: string) => void;
  handleOpenSettings: () => void;
  handlePay: (id: string) => void;
};

const SellerProfileReviews = ({
  userId,
  loggedId,
  user,
  handlePay,
  handleOpenChatId,
}: CollectionProps) => {
  const [showphone, setshowphone] = useState(false);
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const isAdCreator = userId === loggedId;

  const handleShowPhoneClick = () => {
    setshowphone(true);
    window.location.href = `tel:${user.phone}`;
  };

  const handlewhatsappClick = () => {
    window.location.href = `https://wa.me/${user.whatsapp}/`;
  };

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex w-full flex-col items-center lg:w-[350px]">
      <div className="w-full overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#2D3236] dark:text-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-6 text-white">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-24 w-24 rounded-full border-4 border-white/70 bg-white shadow-md">
              <Zoom>
                {user?.photo ? (
                  <Image
                    className="h-full w-full rounded-full object-cover"
                    src={user.photo}
                    alt="Avatar"
                    width={200}
                    height={200}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full text-2xl font-extrabold text-orange-600">
                    {initials || "U"}
                  </div>
                )}
              </Zoom>

              {user.verified && user?.verified[0]?.accountverified === true ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-1.5 text-white shadow-md">
                        <VerifiedUserOutlinedIcon />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-emerald-600">Verified Seller</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute bottom-0 right-0 rounded-full bg-slate-500 p-1.5 text-white shadow-md">
                        <ShieldOutlinedIcon />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-slate-600">Unverified Seller</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="mt-4 text-xl font-extrabold">
              {user.firstName} {user.lastName}
            </div>

            {user?.businessname ? (
              <div className="mt-1 text-sm text-orange-50">
                {user.businessname}
              </div>
            ) : null}

            <div className="mt-3">
              <Verification
                fee={user.fee}
                user={user}
                userId={userId}
                isAdCreator={isAdCreator}
                handlePayNow={handlePay}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5">
          {currentUser ? (
            <Button
              onClick={handleShowPhoneClick}
              className="h-12 w-full rounded-2xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600"
            >
              <CallIcon sx={{ fontSize: 18 }} />
              <div>Call</div>
            </Button>
          ) : (
            <Button
              onClick={() => {
                router.push(`/auth`);
              }}
              className="h-12 w-full rounded-2xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600"
            >
              <CallIcon sx={{ fontSize: 18 }} />
              <div>Call</div>
            </Button>
          )}

          {userId !== loggedId ? (
            currentUser ? (
              <Button
                onClick={() => {
                  handleOpenChatId(userId);
                }}
                variant="outline"
                className="h-12 w-full rounded-2xl border-orange-200 bg-orange-50 text-sm font-semibold text-orange-600 hover:bg-orange-100"
              >
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                <div>Message</div>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  router.push(`/auth`);
                }}
                variant="outline"
                className="h-12 w-full rounded-2xl border-orange-200 bg-orange-50 text-sm font-semibold text-orange-600 hover:bg-orange-100"
              >
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                <div>Message</div>
              </Button>
            )
          ) : null}

          {user.whatsapp ? (
            currentUser ? (
              <Button
                onClick={handlewhatsappClick}
                variant="outline"
                className="h-12 w-full rounded-2xl border-green-200 bg-green-50 text-sm font-semibold text-green-600 hover:bg-green-100"
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
                <div>WhatsApp</div>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  router.push(`/auth`);
                }}
                variant="outline"
                className="h-12 w-full rounded-2xl border-green-200 bg-green-50 text-sm font-semibold text-green-600 hover:bg-green-100"
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
                <div>WhatsApp</div>
              </Button>
            )
          ) : null}

          {showphone ? (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {user.phone}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SellerProfileReviews;