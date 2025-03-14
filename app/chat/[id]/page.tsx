// components/Chat.js
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Image from "next/image";
import NavbarChats from "@/components/shared/NavbarChats";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardChat from "@/components/shared/dashboardChat";
const Sidebar = dynamic(() => import("@/components/shared/Sidebar"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full lg:w-[300px] h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});
const SendMessage = dynamic(() => import("@/components/shared/SendMessage"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});
const ChatBox = dynamic(() => import("@/components/shared/ChatBox"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});
type chatProps = {
  params: {
    id: string;
  };
};

const pagechat = async ({ params: { id } }: chatProps) => {
  // const user = await getUserById(id);
  const user = await getUserById(id);
  const { sessionClaims } = auth();
  const senderId = sessionClaims?.userId as string;
  const senderName = sessionClaims?.userName as string;
  //  const userEmail = sessionClaims?.userEmail as string;
  const senderImage = sessionClaims?.userImage as string;
  const recipientUid = id;

  // console.log(senderId);
 
  return (
   
      <DashboardChat
        user={user}
        recipientUid={recipientUid}
        senderId={senderId}
        senderName={senderName}
        senderImage={senderImage}
      />
    
  );
};

export default pagechat;
