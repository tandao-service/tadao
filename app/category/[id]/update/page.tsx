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
import CategoryForm from "@/components/shared/CategoryForm";
import Footersub from "@/components/shared/Footersub";
import {
  getAllCategories,
  getCategoryById,
} from "@/lib/actions/category.actions";

type chatProps = {
  params: {
    id: string;
  };
};

const pagechat = async ({ params: { id } }: chatProps) => {
  // const user = await getUserById(id);
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  //const senderName = sessionClaims?.userName as string;
  //  const userEmail = sessionClaims?.userEmail as string;

  // const senderImage = sessionClaims?.userImage as string;
  const category = await getCategoryById(id);
  const categoryId = id;
  if (!category) {
    return (
      <div className="flex-center h-screen w-full bg-[#ebf2f7] bg-dotted-pattern bg-cover bg-fixed bg-center">
        <div className="top-0 z-10 fixed w-full">
          <Navbar userstatus="User" userId={userId} />
        </div>
        <div className="max-w-6xl mx-auto mt-20">
          <div className="flex gap-1 items-center">
            <Image
              src="/assets/icons/loading.gif"
              alt="edit"
              width={60}
              height={60}
            />
            Loading...
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-full">
      <div className="z-10 top-0 fixed w-full">
        <Navbar userstatus="User" userId={userId} />
      </div>
      <div className="mt-[50px]">
        <CategoryForm
          type={"Update"}
          categoryId={categoryId}
          category={category}
        />
        <Toaster />
      </div>
      <footer>
        <Footersub />
      </footer>
    </div>
  );
};

export default pagechat;
