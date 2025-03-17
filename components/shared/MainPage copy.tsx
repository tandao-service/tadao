"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { AdminId, mode } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import { getAlldynamicAd } from "@/lib/actions/dynamicAd.actions";
import CategoryMenuMain from "./CategoryMenuMain";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DiamondIcon from "@mui/icons-material/Diamond";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import ProgressPopup from "./ProgressPopup";
import MenuSubmobileMain from "./MenuSubmobileMain";
import Masonry from "react-masonry-css";
import CardAutoHeight from "./CardAutoHeight";
import AppPopup from "./AppPopup ";
import HeaderMain from "./HeaderMain";
import MobileNav from "./MobileNav";
import Unreadmessages from "./Unreadmessages";
import Footer from "./Footer";
import Footersub from "./Footersub";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import Skeleton from "@mui/material/Skeleton";
import PopupSell from "./PopupSell";
import PopupCategory from "./PopupCategory";
import PopupAdView from "./PopupAdView";
import VerticalCard from "./VerticalCard";
import PopupAdEdit from "./PopupAdEdit";
import PopupPay from "./PopupPay";
import PopupAbout from "./PopupAbout";
import PopupTerms from "./PopupTerms";
import PopupSafety from "./PopupSafety";
import PopupPrivacy from "./PopupPrivacy";
import PopupBookmark from "./PopupBookmark";
import PopupPlan from "./PopupPlan";
import PopupChat from "./PopupChat";
import PopupReviews from "./PopupReviews";
import PopupChatId from "./PopupChatId";
import PopupShop from "./PopupShop";
import PopupSettings from "./PopupSettings";
import BottomNavigation from "./BottomNavigation";
import PopupPerfomance from "./PopupPerfomance";
import { useToast } from "../ui/use-toast";
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

const MainPage = ({
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
 // const isAdCreator = pathname === "/ads/";
 const [newpage, setnewpage] = useState(false);
 const observer = useRef<IntersectionObserver | null>(null);
 const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [adId, setadId] = useState('');
 const [loading, setLoading] = useState(true);
 const [isInitialLoading, setIsInitialLoading] = useState(true);
 const [showPopup, setShowPopup] = useState(false);
 const [isOpenP, setIsOpenP] = useState(false);
 const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
 const [isOpenCategory, setIsOpenCategory] = useState(false);
 const [isOpenSell, setIsOpenSell] = useState(false);
 const [isOpenAdView, setIsOpenAdView] = useState(false);
 const [isOpenAdEdit, setIsOpenAdEdit] = useState(false);
 const [isOpenPay, setIsOpenPay] = useState(false);
 const [txtId, setTxtId] = useState('');
 const [recipientUid, setrecipientUid] = useState('');
 const [shopId, setshopId] = useState('');
 const [isOpenAbout, setIsOpenAbout] = useState(false);
 const [isOpenTerms, setIsOpenTerms] = useState(false);
 const [isOpenPrivacy, setIsOpenPrivacy] = useState(false);
 const [isOpenSafety, setIsOpenSafety] = useState(false);
 const [isOpenBook, setIsOpenBook] = useState(false);
 const [isOpenPlan, setIsOpenPlan] = useState(false);
 const [isOpenChat, setIsOpenChat] = useState(false);
 const [isOpenChatId, setIsOpenChatId] = useState(false);
 const [isOpenReview, setIsOpenReview] = useState(false);
 const [isOpenShop, setIsOpenShop] = useState(false);
 const [isOpenSettings, setIsOpenSettings] = useState(false);
 const [isOpenPerfomance, setIsOpenPerfomance] = useState(false);
 const { toast } = useToast()
 
  const router = useRouter();
  const handleClose = () => {
    setIsOpenAbout(false);
    setIsOpenTerms(false);
    setIsOpenPrivacy(false);
    setIsOpenSafety(false);
    setIsOpenBook(false);
    setIsOpenPlan(false);
    setIsOpenChat(false);
    setIsOpenChatId(false);
    setIsOpenReview(false);
    setIsOpenShop(false);
    setIsOpenSettings(false);
    setIsOpenPerfomance(false);
    setIsOpenSell(false);
    setIsOpenAdView(false);
    setIsOpenAdEdit(false);
    setIsOpenPay(false);
    setIsOpenCategory(false);
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const Ad = params.get("Ad");
    const Profile = params.get("Profile");
    if (Ad) {
      setadId(Ad);
      setIsOpenAdView(true);
    } else {
      setIsOpenAdView(false);
    }
    if (Profile) {
      setshopId(Profile);
      setIsOpenShop(true);
    } else {
      setIsOpenShop(false);
    }
  }, []);


  const [showSidebar, setShowSidebar] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false); // Disable sidebar on mobile
      } else {
        setShowSidebar(true); // Enable sidebar on desktop
      }
    };

    // Initial check
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showSidebar && window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showSidebar]);

  const handleSidebarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSidebar(!showSidebar);
  };
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };
 

  const handleClosePerfomance = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenPerfomance(false);
  };
  const handleOpenPerfomance = () => {
   handleClose();
    setIsOpenPerfomance(true);
    };

  const handleCloseSettings = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenSettings(false);
  };
  const handleOpenSettings = () => {
    handleClose();
    setIsOpenSettings(true);
    };

  const handleCloseChatId = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipientUid('')
    setIsOpenChatId(false);
  };
  const handleOpenChatId = (value:string) => {
   // handleClose();
    setrecipientUid(value)
    setIsOpenChatId(true);
   
    };

  const handleCloseShop = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
  
    setshopId('')
    setIsOpenShop(false);
  };
 
  const handleOpenShop = (shopId:string) => {
    handleClose();
    setshopId(shopId)
    setIsOpenShop(true);
    };
  const handleCloseReview = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipientUid('')
    setIsOpenReview(false);
  };
  const handleOpenReview = (value:string) => {
    handleClose();
    setrecipientUid(value)
    setIsOpenReview(true);
    };

  const handleCloseChat = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setIsOpenChat(false);
  };
  const handleOpenChat = () => {
    handleClose();
    setIsOpenChat(true);
    };

  const handleClosePlan = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([]);
    }
   
    setIsOpenPlan(false);
  };
  const handleOpenPlan = () => {
    handleClose();
    setIsOpenPlan(true);
    };
  const handleCloseBook = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenBook(false);
  };
  const handleOpenBook = () => {
    handleClose();
    setIsOpenBook(true);
    };

  const handleCloseTerms = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setIsOpenTerms(false);
  };
  const handleOpenTerms = () => {
    handleClose();
    setIsOpenTerms(true);
    };
    const handleClosePrivacy = () => {
      const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
      setIsOpenPrivacy(false);
    };
    const handleOpenPrivacy = () => {
      handleClose();
      setIsOpenPrivacy(true);
      };
      const handleCloseSafety = () => {
        const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
  
        setIsOpenSafety(false);
      };
      const handleOpenSafety = () => {
        handleClose();
        setIsOpenSafety(true);
        };
  const handleCloseAbout = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    
    setIsOpenAbout(false);
  };
  const handleOpenAbout = () => {
    handleClose();
    setIsOpenAbout(true);
    };
  
const handlePay = (id:string) => {
  handleClose();
  setTxtId(id);
  setIsOpenPay(true);
  };

  const handleClosePay = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenPay(false);
  };
const handleCloseAdEdit = () => {
  const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
  setadId('');
  setIsOpenAdEdit(false);
};

const handleAdEdit = (id:string) => {
  handleClose();
  setadId(id);
  setIsOpenAdEdit(true);
  };

const handleCloseAdView = () => {
  const params = new URLSearchParams(window.location.search);
  const ad = params.get("Ad");
  if(ad){
    router.push("/", { scroll: false });
    setNewqueryObject([])
  }
 
  setadId('');
  setIsOpenAdView(false);
};

  const handleCloseCategory = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
    }
    setNewqueryObject([])
    setIsOpenCategory(false);
  };

  const handleOpenSell = () => {
    handleClose();
    setIsOpenSell(true);
 };

  const handleCloseSell = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    if(Profile || Ad){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenSell(false);
  };
  const handleAdView = (id:string) => {
    handleClose();
    setadId(id);
    setIsOpenAdView(true);
    };
 
   const handleFilter = (value:any) => {
    
    setNewqueryObject({
      ...queryObject, // Preserve existing properties
      ...value,
    });
    };
  
  const fetchAds = async () => {
    setLoading(true);
    try {
      const Ads = await getAlldynamicAd({
        queryObject: newqueryObject,
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
  }, [page, newqueryObject]);

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
 
  

  const footerRef = useRef<HTMLDivElement | null>(null);
 const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
    const isDark = savedTheme === mode;
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  //const searchParams = useSearchParams();
  const HoveredCategoryReset = () => {
    setHoveredCategory(null)
  }
  const handleCategory = (query: string) => {
   
  
   // let newUrl = "";
    if (query) {
      handleClose();
      setNewqueryObject({
        ...queryObject, // Preserve existing properties
        category: query.toString(),
        });
        setHoveredCategory(null);
        setIsOpenCategory(true);
        //setIsOpenAdView(false);
        //setIsOpenSell(false);
  
  };
};
  const handleSubCategory = (category: string, subcategory: string) => {

    if (category && subcategory) {
      handleClose();
   setNewqueryObject({
    ...queryObject, // Preserve existing properties
    category: category.toString(),
    subcategory: subcategory.toString(),});
    setHoveredCategory(null);
    setIsOpenCategory(true);
    setIsOpenAdView(false);
    setIsOpenSell(false);
    }else{
      if (category) {
        setNewqueryObject({
         ...queryObject, // Preserve existing properties
         category: category.toString(),});
         setHoveredCategory(null);
         setIsOpenCategory(true);
         setIsOpenAdView(false);
         setIsOpenSell(false);
    }
    }
  };
  return (
    <div className="relative flex w-full h-screen">
  {/* Sidebar */}
  <div
    onClick={(e) => e.stopPropagation()} // Prevent sidebar from closing on itself click
    className={`bg-white shadow-lg transition-transform duration-300 ease-in-out fixed md:relative z-10 ${
      showSidebar
        ? "w-full md:w-1/4 p-3 transform translate-x-0"
        : "-translate-x-full md:w-0 md:translate-x-0"
    }`}
  >
    <Button onClick={handleSidebarToggle} className="mb-4 md:hidden">
      {showSidebar ? "Hide" : "Show"} Sidebar
    </Button>

    {showSidebar && (
      <div className="flex flex-col space-y-4 h-full">
        <div className="flex justify-between items-center w-full">
          <p className="p-1">CATEGORIES</p>

          <Button onClick={handleSidebarToggle} className="md:hidden">
            <X />
          </Button>
        </div>
        {/* Categories Section */}
      </div>
    )}
  </div>

  {/* Overlay */}
  {showSidebar && window.innerWidth < 768 && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={() => setShowSidebar(false)}
    ></div>
  )}

  {/* Ads Section */}
  <div
    className={`flex-1 flex-col transition-all duration-300 h-screen ${
      showSidebar ? "hidden md:block" : "block"
    }`}
  >
    <Button
      onClick={handleSidebarToggle}
      className="hidden lg:inline absolute bottom-1 left-4 z-10 md:block bg-green-600 text-white shadow-lg hover:bg-green-700"
    >
      {showSidebar ? (
        <>
          <KeyboardArrowLeftOutlinedIcon /> Hide Categories
        </>
      ) : (
        <>
          <KeyboardArrowRightOutlinedIcon /> Show Categories
        </>
      )}
    </Button>

    <div onMouseEnter={() => setHoveredCategory(null)} className="p-0 lg:p-2 h-full flex flex-col">
      {/* Header Section */}

      {/* List Ads Section */}
      {/* <div className="space-y-4 overflow-y-auto mt-0 flex-1"> */}

      <footer>
        <div className="lg:hidden">
          <BottomNavigation
            userId={userId}
            popup={"home"}
            onClose={handleClose}
            handleOpenSell={handleOpenSell}
            handleOpenChat={handleOpenChat}
            handleCategory={handleCategory}
          />
        </div>
      </footer>
    </div>
  </div>
</div>

  );
};

export default MainPage;