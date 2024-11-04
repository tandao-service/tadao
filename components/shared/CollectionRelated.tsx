"use client";
import { IAd } from "@/lib/database/models/ad.model";
import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import Pagination from "./Pagination";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRelatedAdByCategory } from "@/lib/actions/ad.actions";
//import Card from './Card'
//import Pagination from './Pagination'

type CollectionProps = {
  //  data: IAd[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  categoryId: string;
  adId: string;
  subcategory: string;
  // page: number | string;
  // totalPages?: number;
  urlParamName?: string;
  userId: string;
  userName: string;
  userImage: string;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

const CollectionRelated = ({
  // data,
  emptyTitle,
  emptyStateSubtext,
  // page,
  // totalPages = 0,
  collectionType,
  urlParamName,
  categoryId,
  subcategory,
  adId,
  userId,
  userName,
  userImage,
}: CollectionProps) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };
  const pathname = usePathname();
  const isAdCreator = pathname === "/ads/";

  const [data, setAds] = useState<IAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const relatedAds: any = await getRelatedAdByCategory({
        categoryId: categoryId,
        subcategory: subcategory,
        adId: adId,
        page,
      });

      // Update ads state using the latest prevAds for filtering
      setAds((prevAds: IAd[]) => {
        const existingAdIds = new Set(prevAds.map((ad) => ad._id));

        // Filter out ads that are already in prevAds
        const newAds = relatedAds?.data.filter(
          (ad: IAd) => !existingAdIds.has(ad._id)
        );

        return [...prevAds, ...newAds]; // Return updated ads
      });
      setTotalPages(relatedAds?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page]);

  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage((prevPage: any) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10 p-0">
          <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
            {data.map((ad: any, index: number) => {
              const hasOrderLink = collectionType === "Ads_Organized";
              const hidePrice = collectionType === "My_Tickets";

              if (data.length === index + 1) {
                return (
                  <div
                    ref={lastAdRef}
                    key={ad._id}
                    className="flex justify-center"
                  >
                    {/* Render Ad */}
                    <Card
                      ad={ad}
                      hasOrderLink={hasOrderLink}
                      hidePrice={hidePrice}
                      userId={userId}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={ad._id} className="flex justify-center">
                    {/* Render Ad */}
                    <Card
                      ad={ad}
                      hasOrderLink={hasOrderLink}
                      hidePrice={hidePrice}
                      userId={userId}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      ) : (
        loading === false && (
          <>
            <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
              <h3 className="font-bold text-[16px] lg:text-[25px]">
                {emptyTitle}
              </h3>
              <p className="text-sm lg:p-regular-14">{emptyStateSubtext}</p>
            </div>
          </>
        )
      )}

      {loading && (
        <div>
          <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
            <Image
              src="/assets/icons/loading2.gif"
              alt="loading"
              width={40}
              height={40}
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionRelated;
