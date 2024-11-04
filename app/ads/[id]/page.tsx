"use server";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/navbar";
import Skeleton from "@mui/material/Skeleton";
import { getAdById, getRelatedAdByCategory } from "@/lib/actions/ad.actions";
import Ads from "@/components/shared/Ads";
import { auth } from "@clerk/nextjs/server";
import { SearchParamProps } from "@/types";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import Contact from "@/components/shared/contact";
//import CollectionRelated from "@/components/shared/CollectionRelated";
import { Toaster } from "@/components/ui/toaster";
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

  if (!ad) {
    return (
      <div className="flex-center h-screen w-full bg-[#ebf2f7] bg-dotted-pattern bg-cover bg-fixed bg-center">
        <div className="top-0 z-10 fixed w-full">
          <Navbar userstatus="User" userId={userId || ""} />
        </div>
        <div className="max-w-6xl mx-auto mt-[70px]">
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
    <>
      <div className="top-0 z-10 fixed w-full">
        <Navbar userstatus="User" userId={userId || ""} />
      </div>
      <div className="max-w-6xl mx-auto mt-[40px] lg:mt-[70px]">
        <div className="text-sm p-0 hidden lg:inline">
          <div className="flex">
            <div className="bg-white p-1 rounded-full mr-2">
              <Link className="hover:text-green-700 no-underline" href={`/`}>
                <div className="flex cursor-pointer items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mr-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    ></path>
                  </svg>
                  <p className="text-xs lg:text-sm"> All Ads</p>
                </div>
              </Link>
            </div>
            <div className="bg-white p-1 rounded-full mr-2">
              <div className="flex items-center">
                {ad && (
                  <Link
                    className="flex hover:text-green-700 no-underline"
                    href={`/category?category=Vehicle&subcategory=${encodeURIComponent(
                      ad.subcategory
                    )}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      ></path>
                    </svg>
                    <p className="text-xs lg:text-sm">{ad.subcategory}</p>
                  </Link>
                )}
              </div>
            </div>
            <div className="bg-white p-1 rounded-full">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 mr-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                {ad && <p className="text-xs lg:text-sm">{ad.title}</p>}
              </div>
            </div>
          </div>
        </div>
        <Ads
          ad={ad}
          userId={userId || ""}
          userName={userName || ""}
          userImage={userImage || ""}
        />
        <h2 className="font-bold p-2 text-[30px]">Related Ads</h2>
        <div className="p-1 mb-24 lg:mb-0">
          <CollectionRelated
            emptyTitle="No Ads Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Ads"
            limit={16}
            userId={userId || ""}
            userName={userName || ""}
            userImage={userImage || ""}
            categoryId={ad.category._id}
            subcategory={ad.subcategory}
            adId={id}
          />
          <Toaster />
        </div>

        <footer>
          <div>
            <Footersub />
          </div>
        </footer>
        <div className="fixed bottom-0 left-0 right-0 bg-[#F2FFF2] lg:bg-transparent h-auto md:h-24 z-10 p-3 shadow-md flex flex-col md:flex-row justify-between items-center">
          <Contact
            ad={ad}
            userId={userId || ""}
            userName={userName || ""}
            userImage={userImage || ""}
          />
        </div>
      </div>
    </>
  );
};

export default AdDetails;
