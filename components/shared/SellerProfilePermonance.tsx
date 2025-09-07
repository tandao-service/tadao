"use client";
import React, { useEffect, useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faTiktok,
  faChrome,
} from "@fortawesome/free-brands-svg-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CreateUserParams } from "@/types";

import Streetmap from "./Streetmap";
import Link from "next/link";
import StreetmapOfice from "./StreetmapOffice";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { format, isToday, isYesterday } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
//import Share from "./Share";
import { v4 as uuidv4 } from "uuid";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { getVerfiesfee } from "@/lib/actions/verifies.actions";
import Verification from "./Verification";
import { IUser } from "@/lib/database/models/user.model";
import Image from "next/image";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IAd } from "@/lib/database/models/ad.model";
import Ratingsmobile from "./ratingsmobile";
import Verificationmobile from "./Verificationmobile";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ProgressPopup from "./ProgressPopup";
type chatProps = {
  userId: string;
  userName: string;
  userImage: string;
  user: any;
  handleOpenShop: (shopId: any) => void;
  handleOpenReview: (value: any) => void;
  handlePay: (id: string) => void;
};
const SellerProfilePermonance = ({
  userId,
  userName,
  userImage,
  user,
  handleOpenShop,
  handleOpenReview,
  handlePay,
}: chatProps) => {
  const pathname = usePathname();
  const [isOpenP, setIsOpenP] = useState(false);
  const router = useRouter();
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <div className="flex gap-1 items-center">
      <div className="flex flex-col lg:flex-row gap-1 items-center p-1 w-full">
        <div
          onClick={() => {
            handleOpenShop(user);
          }}
          className="cursor-pointer no-underline font-bold m-1"
        >
          <div className="w-12 h-12 rounded-full bg-white">
            <Zoom>
              {user?.photo ? (
                <img
                  src={user?.photo}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                  <span>👤</span>
                </div>
              )}
            </Zoom>
          </div>
        </div>
        <div className="flex flex-col">
          <div
            onClick={() => {
              handleOpenShop(user);
            }}
            className="cursor-pointer no-underline font-boldm-1"
          >
            <p className="ml-2 font-bold">{user.firstName}{" "}{user.lastName}</p>
          </div>

          <Verification user={user} fee={user.fee} userId={userId} isAdCreator={true} handlePayNow={handlePay} />
          <Ratingsmobile user={user} recipientUid={userId} handleOpenReview={handleOpenReview} />
        </div>
      </div>

    </div>
  );
};

export default SellerProfilePermonance;
