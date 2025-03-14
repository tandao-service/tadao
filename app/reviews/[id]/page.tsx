// components/Chat.js
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import Image from "next/image";
import NavbarReviews from "@/components/shared/NavbarReviews";
//import SellerProfile from "@/components/shared/Seller//Profile";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import ReviewsBoxMyAds from "@/components/shared/ReviewsBoxMyAds";
import SendReviewMyAds from "@/components/shared/SendReviewMyAds";

const SellerProfile = dynamic(
  () => import("@/components/shared/SellerProfile"),
  {
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
  }
);

const ReviewsBox = dynamic(() => import("@/components/shared/ReviewsBox"), {
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
const SendReview = dynamic(() => import("@/components/shared/SendReview"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full h-[50px] mt-2 flex bg-white rounded-lg flex-col items-center justify-center">
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
  const user = await getUserById(id);
  const { sessionClaims } = auth();
  const senderId = sessionClaims?.userId as string;
  const senderName = sessionClaims?.userName as string;
  //  const userEmail = sessionClaims?.userEmail as string;
  const senderImage = sessionClaims?.userImage as string;
  const recipientUid = id;
  if (!user) {
    return (
      <div className="flex-center min-h-screen w-full dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-gray-200 bg-dotted-pattern bg-cover bg-fixed bg-center">
        <div className="top-0 z-10 fixed w-full">
          <Navbar userstatus="User" userId={recipientUid || ""} />
        </div>
        <div className="max-w-6xl mx-auto mt-20">
          <div className="flex gap-1 items-center">
            <Image
              src="/assets/icons/loading.gif"
              alt="edit"
              width={60}
              height={60}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-gray-200">
      <div className="z-10 top-0 fixed w-full">
        <NavbarReviews recipient={user} userId={recipientUid} />
      </div>
      <div className="mx-auto flex mt-[60px] p-1">
        <div className="gap-2 hidden lg:inline w-[350px]  sidebar left-0 top-0 border dark:border-0 lg:p-4">
          <div className="w-full p-0">
            <SellerProfile
              user={user}
              loggedId={senderId}
              userId={recipientUid}
            />
          </div>
        </div>

        <div className="w-full lg:w-3/4 chat overflow-y-auto">
          <div className="lg:hidden border dark:border-0 w-full sidebar lg:fixed mb-2 rounded-lg">
            <div className="w-full p-1">
              <SellerProfile
                user={user}
                loggedId={senderId}
                userId={recipientUid}
              />
            </div>
          </div>

          <div className="mt-0 p-0 min-h-screen border items-center max-w-6xl mx-auto flex rounded-lg flex-col">
            <div className="items-center w-full flex flex-col">
              <div className="flex gap-1 items-center">
              {/*  <div className="font-bold dark:text-gray-400 text-emerald-950">
                 
                  Customer feedback for
                </div>
                <div className="font-bold text-emerald-600">
                  {user.firstName} {user.lastName}
                </div>*/} 
              </div>
              <ReviewsBox
                displayName={senderName}
                uid={senderId}
                photoURL={senderImage}
                recipientUid={recipientUid}
                recipient={user}
              />
            </div>
            <SendReviewMyAds
              displayName={senderName}
              uid={senderId}
              photoURL={senderImage}
              recipientUid={recipientUid}
            />
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
};

export default pagechat;
