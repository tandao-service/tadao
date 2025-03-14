// components/Chat.js
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Image from "next/image";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SellerProfile from "@/components/shared/SellerProfile";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import Sidebar from "@/components/shared/Sidebar";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Footersub from "@/components/shared/Footersub";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Sidebarmain from "@/components/shared/Sidebarmain";
import ChatComponent from "@/components/shared/ChatComponent";
const pagechat = async () => {
  const { sessionClaims } = auth();
  const senderId = sessionClaims?.userId as string;
  const user = await getUserById(senderId);

  const senderName = sessionClaims?.userName as string;
  //  const userEmail = sessionClaims?.userEmail as string;
  const senderImage = sessionClaims?.userImage as string;
  const recipientUid = senderId;
  // console.log(senderId);
 
  return (
    <>
    <ChatComponent user={user} senderImage={senderImage} senderId={senderId} senderName={senderName} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenBook={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenPlan={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenChat={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenSell={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenAbout={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenTerms={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenPrivacy={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenSafety={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenSettings={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenChatId={function (value: string): void {
        throw new Error("Function not implemented.");
      } } handleOpenReview={function (value: string): void {
        throw new Error("Function not implemented.");
      } } handleCategory={function (value: string): void {
        throw new Error("Function not implemented.");
      } } handleOpenShop={function (shopId: string): void {
        throw new Error("Function not implemented.");
      } } handleOpenPerfomance={function (): void {
        throw new Error("Function not implemented.");
      } } /> 
    </>
  );
};

export default pagechat;
