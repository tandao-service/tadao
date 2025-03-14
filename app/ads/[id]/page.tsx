"use server";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import Skeleton from "@mui/material/Skeleton";
import { getRelatedAdByCategory } from "@/lib/actions/ad.actions";
import Ads from "@/components/shared/Ads";
import { auth } from "@clerk/nextjs/server";
import { SearchParamProps } from "@/types";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import Contact from "@/components/shared/contact";
//import CollectionRelated from "@/components/shared/CollectionRelated";
import { Toaster } from "@/components/ui/toaster";
import { getAdById } from "@/lib/actions/dynamicAd.actions";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import AdsComponent from "@/components/shared/AdsComponent";
const CollectionRelated = dynamic(
  () => import("@/components/shared/CollectionRelated"),
  {
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
  }
);

const AdDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;
  const ad = await getAdById(id);
 
  return (
    <>
      <AdsComponent ad={ad}
      userId={userId}
      userName={userName}
      userImage={userImage}
      id={id} onClose={function (): void {
        throw new Error("Function not implemented.");
      } } handleOpenSell={function (): void {
        throw new Error("Function not implemented.");
      } } handleAdView={function (id: string): void {
        throw new Error("Function not implemented.");
      } }/>
      
    </>
  );
};

export default AdDetails;
