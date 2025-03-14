"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
  Polygon,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';;
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import OpenWithOutlinedIcon from '@mui/icons-material/OpenWithOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import TurnSharpLeftOutlinedIcon from '@mui/icons-material/TurnSharpLeftOutlined';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DrawerDemo } from "./DrawerDemo";
import { DrawerPublic } from "./DrawerPublic";
import { getAlldynamicAd, getListingsNearLocation } from "@/lib/actions/dynamicAd.actions";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import HorizontalCard from "./HorizontalCard";
import VerticalCard from "./VerticalCard";
import ProgressPopup from "./ProgressPopup";
import HorizontalCardPublic from "./HorizontalCardPublic";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { mode } from "@/constants";
import CategoryMenu from "./CategoryMenu";
import Masonry from "react-masonry-css";
import CardAutoHeight from "./CardAutoHeight";
import Navbarhome from "./navbarhome";

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

const HomePage = ({
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
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };
  const router = useRouter();
  const pathname = usePathname();
  const isAdCreator = pathname === "/ads/";
  const [newpage, setnewpage] = useState(false);
  const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
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
        setAds((prevAds: IdynamicAd[]) => {
          const existingAdIds = new Set(prevAds.map((ad) => ad._id));

          // Filter out ads that are already in prevAds
          const newAds = Ads?.data.filter(
            (ad: IdynamicAd) => !existingAdIds.has(ad._id)
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
    default: 4, // 3 columns on large screens
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

  
   return (<>
    <div className="flex w-full h-screen">
  
      <div
        className={`bg-white shadow-lg transition-transform duration-300 ease-in-out fixed md:relative ${
          showSidebar ? "w-full md:w-1/3 p-4" : "-translate-x-full md:w-0 md:translate-x-0"
        }`}
      >
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          className="mb-4 md:hidden"
        >
          {showSidebar ? "Hide" : "Show"} Sidebar
        </Button>


       
        {showSidebar && (
          <div className="flex flex-col space-y-4">
             <div className="flex justify-between items-center w-full">
            <p className="p-1">Properties Nearby</p>



            <SignedIn>

<Button onClick={() => {
    
    setIsOpenP(true);
    router.push("/ads/create");
  
}} variant="outline" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
</Button>

</SignedIn>

<SignedOut>
<Button  onClick={() => {
      setIsOpenP(true);
      router.push("/sign-in");
    }} variant="outline" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
</Button>

  
</SignedOut>
</div>
<CategoryMenu
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            footerRef={footerRef}
          />
      </div>
        )}
      </div>

      {/* Map Section with Toggle Button */}
      <div className={`w-full relative transition-all duration-300 h-screen ${
        showSidebar ? "hidden md:block" : "block"
      }`}>
      
      
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute bottom-[90px] left-4 z-20 md:block bg-white text-gray-700 shadow-lg hover:text-white"
        >
         {showSidebar ? (<><KeyboardArrowLeftOutlinedIcon/> Hide Nearby Properties</>) : (<><KeyboardArrowRightOutlinedIcon/> Show Nearby Properties</>)} 
        </Button>
        
        <div className="absolute top-3 right-20 z-10  grid grid-cols-7 mb-0 flex gap-1">

<button  title="Calculate the best route from selected points" 
  className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  rounded-l-lg bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white`}
  //</div>className="p-1 flex flex-col items-center text-[10px] bg-green-100 border border-green-500 text-green-500 rounded"
  >
<PushPinOutlinedIcon sx={{ fontSize: 16 }}/> Other route
</button>



</div>
<div className="flex w-full flex-col items-center">
<div className="top-0 z-10 w-full">
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
      
           
{data.length > 0 ? (
            <div className="flex w-full h-[90vh] overflow-y-auto flex-col items-center gap-10 p-0">
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
         
      </div>
      </div>

      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
     
    
     
    </div> </>
  );
}
export default HomePage;