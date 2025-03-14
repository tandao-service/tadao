"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllAd } from "@/lib/actions/ad.actions";
import { getAlldynamicAd } from "@/lib/actions/dynamicAd.actions";
import CardAutoHeight from "./CardAutoHeight";
//import Card from './Card'
//import Pagination from './Pagination'
import Masonry from "react-masonry-css";
import ProgressPopup from "./ProgressPopup";
import Navbarhome from "./navbarhome";
import MenuSubmobile from "./MenuSubmobile";
import Menu from "./menu";
import CategoryMenu from "./CategoryMenu";
import Footer from "./Footer";
import BottomNavigation from "./BottomNavigation";
import { AdminId, mode } from "@/constants";
import Head from "next/head";
import Skeleton from "@mui/material/Skeleton";
import { Box, Grid, Card } from "@mui/material";
import { checkUserOnlineStatus } from "./checkUserOnlineStatus";
import Chatt from "./ReceiveChat";
import NotificationButton from "./NotificationButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PropertyMap from "./PropertyMap";
type CollectionProps = {
  limit: number;
  userId: string;
  emptyTitle: string;
  emptyStateSubtext: string;
  queryObject: any;
  urlParamName?: string;
  user: any;
  userName: string;
  userImage: string;
  categoryList: any;
  subcategoryList: any;
  AdsCountPerRegion:any;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

const CollectionInfinite = ({
  user,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  urlParamName,
  queryObject,
  userId,
  userName,
  userImage,
  categoryList,
  subcategoryList,
  AdsCountPerRegion,
}: CollectionProps) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };
  const pathname = usePathname();
  const isAdCreator = pathname === "/ads/";
  const [newpage, setnewpage] = useState(false);
  const [data, setAds] = useState<IAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);
  
  const fetchAds = async () => {
    setLoading(true);
    try {
      const Ads = await getAlldynamicAd({
        queryObject: queryObject,
        page,
        limit: 20,
      });

      if (newpage) {
        setnewpage(false);
        setAds((prevAds: IAd[]) => {
          const existingAdIds = new Set(prevAds.map((ad) => ad._id));

          // Filter out ads that are already in prevAds
          const newAds = Ads?.data.filter(
            (ad: IAd) => !existingAdIds.has(ad._id)
          );

          return [...prevAds, ...newAds]; // Return updated ads
        });
      } else {
        setnewpage(false);
        setAds(Ads?.data);
      }

      setTotalPages(Ads?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
      setIsOpenP(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (!newpage) {
      setPage(1);
    }
    fetchAds();
  }, [page, queryObject]);

  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setnewpage(true);
        setPage((prevPage: any) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };
  const breakpointColumns = {
    default: 3, // 3 columns on large screens
    1100: 3, // 2 columns for screens <= 1100px
    700: 2, // 1 column for screens <= 700px
  };
  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = () => {
    setIsOpenP(true);
  };
  const onLoading = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };

  const footerRef = useRef<HTMLDivElement | null>(null);
 const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
    const isDark = savedTheme === mode;
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return; // Prevent running on initial mount

    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null; // Avoid flickering before state is set

  return (
    <>
     <div className="bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] min-h-screen">
        <Head>
          <title>PocketShop | Buy and Sell Online in Kenya</title>
          <meta
            name="description"
            content="PocketShop.co.ke is Kenya's leading online vehicle marketplace. Buy or sell cars, motorbikes, buses, pickups, heavy-duty machinery, and more with ease."
          />
          <meta
            property="og:title"
            content="PocketShop | Buy and Sell Online in Kenya"
          />
          <meta
            property="og:description"
            content="Welcome to PocketShop.co.ke, the trusted platform for buying and selling Online across Kenya. Find your perfect ride or sell your vehicle today!"
          />
          <meta property="og:image" content="/assets/images/logo.png" />
          <meta property="og:url" content="https://PocketShop.co.ke" />
          <meta property="og:type" content="website" />
          <meta
            name="keywords"
            content="PocketShop, buy Online, sell Online, cars, motorbikes, buses, machinery, Kenya"
          />
          <meta name="author" content="PocketShop" />
          <link rel="canonical" href="https://PocketShop.co.ke" />
        </Head>

        <div className="w-full h-full">
      <div className="sm:hidden fixed top-0 z-10 w-full">
        {user ? (
          <Navbarhome
            userstatus={user.status}
            userId={userId}
            onLoading={onLoading}
            AdsCountPerRegion={AdsCountPerRegion}
          />
        ) : (
          <Navbarhome userstatus="User" userId="" onLoading={onLoading} AdsCountPerRegion={AdsCountPerRegion} />
        )}
      </div>
      <div className="hidden sm:inline">
        <div className="w-full">
          {user ? (
            <Navbarhome
              userstatus={user.status}
              userId={userId}
              AdsCountPerRegion={AdsCountPerRegion}
              onLoading={onLoading}
            />
          ) : (
            <Navbarhome userstatus="User" userId="" AdsCountPerRegion={AdsCountPerRegion} onLoading={onLoading} />
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex mt-3 ">
        <div className="hidden lg:inline mr-5">
          <CategoryMenu
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            footerRef={footerRef}
          />
        </div>

        {/* Right Content (Scrolls Normally) */}
        <div className="flex-1">
          <div className="lg:hidden">
            <MenuSubmobile
              categoryList={categoryList}
              subcategoryList={subcategoryList}
            />
          </div>
          <div>
          <h2 className="font-bold p-2 text-[30px]">Trending Ads</h2>
          <div className="flex flex-col w-full gap-1">
                  <button
                    onClick={handleOpenPopup}
                    className="flex gap-2 items-center justify-center w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 rounded-md hover:bg-gray-200"
                  >
                    🗺️ Virtual Tour of Property Location
                  </button>

                  {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 z-50">
                      <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-200 p-2 w-full items-center justify-center relative">
             
                        <div className="flex flex-col items-center justify-center dark:bg-[#2D3236] bg-gray-200">
                    
<PropertyMap queryObject={queryObject} onClose={handleClosePopup}
/>
                        </div>
                        
                      </div>
                    </div>
                     
                  )}
                </div>
                </div>
          {data.length > 0 ? (
            <div className="flex w-full flex-col items-center gap-10 p-0">
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"> */}
              <div className="w-full">
                <Masonry
                  breakpointCols={breakpointColumns}
                  className="flex gap-4"
                  columnClassName="bg-clip-padding"
                >
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
                          <CardAutoHeight
                            ad={ad}
                            hasOrderLink={hasOrderLink}
                            hidePrice={hidePrice}
                            userId={userId}
                            handleOpenP={handleOpenP}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={ad._id} className="flex justify-center">
                          {/* Render Ad */}
                          <CardAutoHeight
                            ad={ad}
                            hasOrderLink={hasOrderLink}
                            hidePrice={hidePrice}
                            userId={userId}
                            handleOpenP={handleOpenP}
                          />
                        </div>
                      );
                    }
                  })}
                </Masonry>
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

          {userId && (
            <>
              <FloatingChatIcon onClick={toggleChat} isOpen={isChatOpen} />
              <ChatWindow
                isOpen={isChatOpen}
                onClose={toggleChat}
                senderId={userId}
                senderName={userName}
                senderImage={userImage}
                recipientUid={AdminId}
              />
            </>
          )}
           {loading && (
        <div>
          {isInitialLoading ? (
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
           {Array.from({ length: 12 }).map((_, index) => (
             <div key={index} className="bg-gray-200 dark:bg-[#2D3236] p-4 rounded-lg shadow-md">
               <Skeleton variant="rectangular" width="100%" height={140} />
               <Skeleton variant="text" width="80%" height={30} className="mt-2" />
               <Skeleton variant="text" width="60%" height={25} />
             </div>
           ))}
         </div>
          
          ) : (
            <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
              <Image
                src="/assets/icons/loading2.gif"
                alt="loading"
                width={40}
                height={40}
                unoptimized
              />
            </div>
          )}
        </div>
      )}
          <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
        </div>
      </div>
       </div>
      <footer
        ref={footerRef}
        className="dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-white"
      >
        <div className="hidden lg:inline">
          <Footer />
        </div>
        <div className="lg:hidden">
          <BottomNavigation userId={userId} />
        </div>
      </footer>
      </div>
    </>
  );
};

export default CollectionInfinite;
