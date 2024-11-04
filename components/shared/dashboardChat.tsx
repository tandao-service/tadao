"use client";
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
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      <div className="w-full h-[50px] flex bg-white rounded-lg flex-col items-center justify-center">
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
      <div className="w-full h-[300px] mb-2 bg-white rounded-lg flex flex-col items-center justify-center">
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
type payProps = {
  senderName: string;
  senderImage: string;
  user: any;
  recipientUid: string;
  senderId: string;
};
const DashboardChat = ({
  recipientUid,
  user,
  senderId,
  senderName,
  senderImage,
}: payProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="z-10 top-0 fixed w-full">
        <NavbarChats recipient={user} userId={recipientUid} />
      </div>

      <div className="max-w-6xl mx-auto flex mt-[50px] lg:mt-[60px] mb-0 p-1">
        <div className="hidden lg:inline mr-5">
          <div className="bg-white w-full p-0">
            <div className="p-1 w-full items-center justify-center">
              <span className="logo font-bold text-[25px] text-emerald-950">
                Messanger
              </span>
              <div className="flex gap-1 items-center">
                <PeopleOutlinedIcon />
                Latest Chats
              </div>
            </div>
            <Sidebar userId={senderId} />
          </div>
        </div>

        <div className="flex-1 w-full flex-col">
          <div className="rounded-lg max-w-6xl mx-auto flex flex-col p-0 mt-0">
            <div className="w-full flex flex-col">
              <ChatBox
                displayName={senderName}
                uid={senderId}
                photoURL={senderImage}
                recipientUid={recipientUid}
                recipient={user}
                client={false}
              />

              <SendMessage
                displayName={senderName}
                uid={senderId}
                photoURL={senderImage}
                recipientUid={recipientUid}
                client={false}
              />
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default DashboardChat;
