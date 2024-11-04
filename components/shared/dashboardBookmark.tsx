"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { CreateUserParams } from "@/types";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import CollectionBookmark from "./CollectionBookmark";
import BookmarkIcon from "@mui/icons-material/Bookmark";

type CollectionProps = {
  userId: string;
  // data: IAd[];
  user: CreateUserParams;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  //page: number | string;
  //totalPages?: number;
  urlParamName?: string;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

const DashboardBookmark = ({
  userId,
  // data,
  user,
  emptyTitle,
  emptyStateSubtext,
  // page,
  //totalPages = 0,
  collectionType,
  urlParamName,
}: // Accept the onSortChange prop
CollectionProps) => {
  const [isVertical, setisVertical] = useState(true);

  return (
    <>
      <div className="max-w-6xl mx-auto flex mt-3 p-1">
        <div className="flex-1">
          <div className="max-w-6xl mx-auto lg:flex-row mt-2 p-1 justify-center">
            <section className="bg-grey-50 bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
              <div className="wrapper flex gap-1 items-center justify-center">
                <BookmarkIcon />
                <h3 className="font-bold text-[25px] sm:text-left">Bookmark</h3>
              </div>
            </section>
            <section className=" my-2">
              <CollectionBookmark
                // data={data}
                emptyTitle="No Saved Ad"
                emptyStateSubtext="Go and bookmark your favorite ads"
                collectionType="Ads_Organized"
                limit={20}
                //page={page}
                urlParamName="adsPage"
                //totalPages={totalPages}
                userId={userId}
                isAdCreator={false}
                isVertical={isVertical}
              />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardBookmark;
