"use client";
import { IAd } from "@/lib/database/models/ad.model";
import Link from "next/link";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { IUser } from "@/lib/database/models/user.model";
import ReviewsBoxMyAds from "./ReviewsBoxMyAds";
import SendReviewMyAds from "./SendReviewMyAds";
//import RatingsCard from "./RatingsCard";
//import CollectionMyads from "./CollectionMyads";

const CollectionMyads = dynamic(() => import("./CollectionMyads"), {
  ssr: false,
  loading: () => (
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
  ),
});

const SellerProfile = dynamic(() => import("./SellerProfile"), {
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
type CollectionProps = {
  userId: string;
  loggedId: string;
  daysRemaining?: number;
  packname?: string;
  color: string;
  sortby: string;
  userImage: string;
  userName: string;
  user: IUser;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  //page: number | string;
  // totalPages?: number;
  urlParamName?: string;
  isAdCreator: boolean;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

const DashboardMyads = ({
  userId,
  //data,
  packname,
  daysRemaining,
  color,
  emptyTitle,
  emptyStateSubtext,
  sortby,
  userImage,
  userName,
  collectionType,
  urlParamName,
  isAdCreator,
  user,
  loggedId,
}: // Accept the onSortChange prop
CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [isVertical, setisVertical] = useState(true);
  const handleButtonClick = (index: number) => {
    setActiveButton(index);
    if (index === 0) {
      setisVertical(true);
    } else {
      setisVertical(false);
    }
  };

  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  const handleSortChange = (selectedOption: string) => {
    if (selectedOption === "nearby") {
      getCurrentLocation(selectedOption);
    } else {
      let newUrl = "";
      if (selectedOption) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "sortby",
          value: selectedOption,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["sortby"],
        });
      }
      setQuery(selectedOption);
      router.push(newUrl, { scroll: false });
    }
    setActiveButton(1);
  };

  function getCurrentLocation(selectedOption: string) {
    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
      // Request permission to access user's location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback, position object contains coordinates
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          let newUrl = "";

          if (latitude && longitude) {
            newUrl = formUrlQuerymultiple({
              params: searchParams.toString(),
              updates: {
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                sortby: selectedOption,
              },
            });
            setQuery(selectedOption);
          } else {
            newUrl = removeKeysFromQuery({
              params: searchParams.toString(),
              keysToRemove: ["sortby"],
            });
          }

          router.push(newUrl, { scroll: false });
        },
        (error) => {
          // Error callback, handle errors here
          console.error("Error getting location:", error.message);
          alert("error: " + error.message.toString());
        }
      );
    } else {
      // Geolocation not supported by the browser
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser. ");
    }
  }
  //console.log("loggedId:" + loggedId);
  return (
    <>
      <div className="max-w-6xl mx-auto flex flex-col mt-3 p-1">
        <div className="w-full flex">
          <div className="hidden lg:inline mr-5">
            <div className="w-full">
              <div className="flex justify-center items-center w-full h-full">
                <SellerProfile
                  user={user}
                  loggedId={loggedId}
                  userId={userId}
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="lg:hidden">
              <SellerProfile user={user} loggedId={loggedId} userId={userId} />
            </div>
            <div className="max-w-6xl mx-auto lg:flex-row mt-3 justify-center">
              <section className="bg-grey-50 bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
                <div className="flex items-center p-1 justify-between">
                  <h3 className="font-bold text-[25px] text-center sm:text-left">
                    Ads List
                  </h3>

                  {isAdCreator &&
                    packname !== "Free" &&
                    daysRemaining &&
                    daysRemaining > 0 && (
                      <>
                        <div
                          style={{
                            backgroundColor: color,
                          }}
                          className="text-center sm:text-left rounded-lg p-3 text-white relative"
                        >
                          <div className="flex flex-col">
                            <div className="font-bold text-sm mt-4">
                              Plan: {packname}
                            </div>
                            <div className="text-xs">
                              Days remaining: {daysRemaining}
                            </div>
                          </div>
                          {/* Green ribbon */}
                          <div className="absolute top-0 shadow-lg left-0 bg-green-500 text-white text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                            Active
                          </div>
                          <Link href="/plan">
                            <div className="p-1 items-center flex flex-block text-black underline text-xs cursor-pointer border-2 border-transparent rounded-full hover:bg-[#000000]  hover:text-white">
                              <div>Upgrade Plan</div>
                            </div>
                          </Link>
                        </div>
                      </>
                    )}
                </div>
              </section>

              <section className=" my-2">
                <div className="flex w-full justify-between">
                  <div className="flex flex-wrap justify-center md:justify-start items-center mb-4 md:mb-0">
                    <div
                      className={`bg-white rounded-sm border p-1 cursor-pointer ${
                        activeButton === 0 ? "text-[#30AF5B]" : "text-gray-400"
                      }`}
                      onClick={() => handleButtonClick(0)}
                    >
                      <ViewModuleIcon />
                    </div>
                    <div
                      className={`bg-white rounded-sm border p-1 cursor-pointer ${
                        activeButton === 1 ? "text-[#30AF5B]" : "text-gray-400"
                      }`}
                      onClick={() => handleButtonClick(1)}
                    >
                      <ViewListIcon />
                    </div>
                  </div>
                  <div className="rounded-full bg-white border p-1 flex items-center">
                    <div className="text-[#30AF5B]">
                      <SwapVertIcon />
                    </div>
                    <Select onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px] border-0 rounded-full">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="recommeded">
                            Recommended first
                          </SelectItem>
                          <SelectItem value="new">Newest first</SelectItem>
                          <SelectItem value="lowest">
                            Lowest price first
                          </SelectItem>
                          <SelectItem value="highest">
                            Highest price first
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <CollectionMyads
                  // data={data}
                  emptyTitle="No ads have been created yet"
                  emptyStateSubtext="Go create some now"
                  collectionType="Ads_Organized"
                  limit={20}
                  sortby={sortby}
                  urlParamName="adsPage"
                  //totalPages={totalPages}
                  userId={userId}
                  isAdCreator={isAdCreator}
                  isVertical={isVertical}
                />
              </section>
            </div>
          </div>
        </div>
        <div className="rounded-xl w-full flex flex-col">
          <span className=" p-2 logo font-bold text-[25px] text-emerald-950">
            Customer feedback
          </span>

          <ReviewsBoxMyAds
            displayName={userName}
            uid={loggedId}
            photoURL={userImage}
            recipientUid={userId}
            recipient={user}
          />

          <SendReviewMyAds
            displayName={userName}
            uid={loggedId}
            photoURL={userImage}
            recipientUid={userId}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardMyads;
