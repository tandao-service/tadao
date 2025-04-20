"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAllAd } from "@/lib/actions/ad.actions";
import { getAdById, getAlldynamicAd } from "@/lib/actions/dynamicAd.actions";
import CardAutoHeight from "./CardAutoHeight";
import * as ScrollArea from "@radix-ui/react-scroll-area";
//import Card from './Card'
//import Pagination from './Pagination'
import Masonry from "react-masonry-css";
import ProgressPopup from "./ProgressPopup";
import Navbarhome from "./navbarhome";
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
import PopupCategory from "./PopupCategory";
import PopupShop from "./PopupShop";
import PopupSell from "./PopupSell";
import PopupAdEdit from "./PopupAdEdit";
import PopupBookmark from "./PopupBookmark";
import PopupAdView from "./PopupAdView";
import PopupPlan from "./PopupPlan";
import PopupChat from "./PopupChat";
import PopupChatId from "./PopupChatId";
import PopupReviews from "./PopupReviews";
import PopupSafety from "./PopupSafety";
import PopupPrivacy from "./PopupPrivacy";
import PopupTerms from "./PopupTerms";
import PopupAbout from "./PopupAbout";
import PopupSettings from "./PopupSettings";
import PopupPerfomance from "./PopupPerfomance";
import PopupPay from "./PopupPay";
import MenuSubmobileMain from "./MenuSubmobileMain";
import PopupFaq from "./PopupFaq";
import SearchTabWindow from "./SearchTabWindow";
import { Icon } from "@iconify/react";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1"; // Correct import
import { getUserById } from "@/lib/actions/user.actions";
import SearchByTitle from "./SearchByTitle";
import PopupAccount from "./PopupAccount";
 // Correct import
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
  const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenSell, setIsOpenSell] = useState(false);
  const [isOpenAdView, setIsOpenAdView] = useState(false);
  const [isOpenAdEdit, setIsOpenAdEdit] = useState(false);
  const [isOpenPay, setIsOpenPay] = useState(false);
  const [txtId, setTxtId] = useState('');
  const [recipient, setrecipient] = useState<any>([]);
  const [recipientUid, setrecipientUid] = useState('');
  const [shopId, setshopId] = useState<any>([]);
  const [isOpenAbout, setIsOpenAbout] = useState(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  const [isOpenPrivacy, setIsOpenPrivacy] = useState(false);
  const [isOpenSafety, setIsOpenSafety] = useState(false);
  const [isOpenFaq, setIsOpenFaq] = useState(false);
  const [isOpenBook, setIsOpenBook] = useState(false);
  const [isOpenPlan, setIsOpenPlan] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [isOpenChatId, setIsOpenChatId] = useState(false);
  const [isOpenReview, setIsOpenReview] = useState(false);
  const [isOpenShop, setIsOpenShop] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenPerfomance, setIsOpenPerfomance] = useState(false);
  const [isOpenSearchTab, setIsOpenSearchTab] = useState(false);
  const [adId, setadId] = useState<any>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [CategorySelect, setCategorySelect] = useState('');
  const [isOpenSearchByTitle, setIsOpenSearchByTitle] = useState(false);
 
  const [showBottomNav, setShowBottomNav] = useState(true);

  const scrollRefB = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const SCROLL_THRESHOLD = 150; // pixels
    useEffect(() => {
      const timer = setTimeout(() => {
        const el = scrollRefB.current;
        if (el) {
         
        const handleScroll = () => {
        const currentScrollTop = el.scrollTop;
        const scrollDiff = currentScrollTop - lastScrollTop.current;
    
        // Ignore small scrolls
        if (Math.abs(scrollDiff) < SCROLL_THRESHOLD) return;
    
        if (scrollDiff > 0) {
          // Scrolling down
          setShowBottomNav(false);
        } else {
          // Scrolling up
          setShowBottomNav(true);
        }
    
        lastScrollTop.current = currentScrollTop;
      };
          el.addEventListener('scroll', handleScroll);
        }
      }, 0);
      return () => clearTimeout(timer);
    }, []);

    
  
  
 const handleHoverCategory = (value:string) => {
 setHoveredCategory(value);
 }
   const router = useRouter();
   
   const handleClose = () => {
     setIsOpenAbout(false);
     setIsOpenTerms(false);
     setIsOpenPrivacy(false);
     setIsOpenSafety(false);
     setIsOpenFaq(false);
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
     //setIsOpenSearchByTitle(false);
     setIsOpenAdEdit(false);
     setIsOpenPay(false);
     setIsOpenSearchTab(false);
    // setIsOpenCategory(false);
    setIsOpenProfile(false);
   };
   useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("Ad");
      const Profile = params.get("Profile");
      const action = params.get("action");
  
      if (id) {
        const ad = await getAdById(id);
        setadId(ad);
        setIsOpenAdView(true);
      } else {
        setIsOpenAdView(false);
      }
  
      if (Profile) {
        const shopAcc = await getUserById(Profile);
        setadId(shopAcc);
        setshopId(Profile);
        setIsOpenShop(true);
      } else {
        setIsOpenShop(false);
      }
      if (action) {
        setIsOpenChat(true);
      } else {
        setIsOpenChat(false);
      }
    };
  
    fetchData();
  }, []);
  const handleOpenPopup = () => {
    setShowPopup(true);
  };
  const handleOpenSearchTab = (value:string) => {
    handleClose();
    setIsOpenCategory(false);
    setCategorySelect(value);
    setIsOpenSearchTab(true);
  };
  const handleCloseSearchTab = () => {
    setIsOpenSearchTab(false);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleCloseSearchByTitle = () => {
    setIsOpenSearchByTitle(false);
  };
  const handleOpenSearchByTitle = () => {
    setIsOpenSearchByTitle(true);
  };
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);
  const handleClosePerfomance = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
  
    setshopId([])
    setIsOpenShop(false);
  };
 
  const handleOpenShop = (shopId:any) => {
    handleClose();
    setshopId(shopId)
    setIsOpenShop(true);
    };
  const handleCloseReview = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipient([])
    setIsOpenReview(false);
  };
  const handleOpenReview = (value:any) => {
    handleClose();
    setrecipient(value)
    setIsOpenReview(true);
    };

  const handleCloseChat = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
      setIsOpenPrivacy(false);
    };
    const handleOpenPrivacy = () => {
      handleClose();
      setIsOpenPrivacy(true);
      };
      const handleOpenFaq = () => {
        handleClose();
        setIsOpenFaq(true);
        };

        const handleCloseFaq = () => {
          const params = new URLSearchParams(window.location.search);
      const Profile = params.get("Profile");
      const Ad = params.get("Ad");
      const action = params.get("action");
      if(Profile || Ad || action){
        router.push("/", { scroll: false });
        setNewqueryObject([])
      }
         
          setIsOpenFaq(false);
        };

      const handleCloseSafety = () => {
        const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenPay(false);
  };
  const handleOpenProfile = () => {
    
    handleClose();
    setIsOpenProfile(true);
    
  
  };
  const handleCloseProfile = () => {
      handleClose();
      setIsOpenProfile(false);
  };
const handleCloseAdEdit = () => {
  const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
  setadId([]);
  setIsOpenAdEdit(false);
};

const handleAdEdit = (ad:any) => {
  handleClose();
  setadId(ad);
  setIsOpenAdEdit(true);
  };

const handleCloseAdView = () => {
  const params = new URLSearchParams(window.location.search);
  const ad = params.get("Ad");
  if(ad){
    router.push("/", { scroll: false });
    setNewqueryObject([])
  }
 
  setadId([]);
  setIsOpenAdView(false);
};

  const handleCloseCategory = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
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
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenSell(false);
  };
  const handleAdView = (ad:any) => {
    handleClose();
    setadId(ad);
    setIsOpenAdView(true);
    };
 
   const handleFilter = (value:any) => {
    
    setNewqueryObject({
      ...queryObject, // Preserve existing properties
      ...value,
    });
    };
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
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href="https://PocketShop.co.ke" />
        </Head>

        <div className="w-full h-full">
      <div  onMouseEnter={() => handleHoverCategory('')} className="sm:hidden fixed top-0 z-10 w-full">
        {user ? (
          <Navbarhome
          user={user}
            userstatus={user.status}
            userId={userId}
                  AdsCountPerRegion={AdsCountPerRegion}  
                  onClose={handleClose} 
                  popup={"home"}
                  handleOpenSell={handleOpenSell}
                  handleOpenBook={handleOpenBook}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety} 
                  handleOpenShop={handleOpenShop}
                  handleFilter={handleFilter}
                  handleOpenSearchByTitle={handleOpenSearchByTitle}
          />
        ) : (
          <Navbarhome 
                  userstatus="User"
                  userId=""
                  AdsCountPerRegion={AdsCountPerRegion}
                  onClose={handleClose}
                  popup={"home"}
                  handleOpenSell={handleOpenSell}
                  handleOpenBook={handleOpenBook}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety}
                  handleOpenShop={handleOpenShop}
                  handleOpenSearchByTitle={handleOpenSearchByTitle}
                  handleFilter={handleFilter} user={undefined} />
        )}
      </div>
      <div className="hidden sm:inline">
        <div  onMouseEnter={() => handleHoverCategory('')} className="w-full">
          {user ? (
            <Navbarhome
            user={user}
                  userstatus={user.status}
                  userId={userId}
                  AdsCountPerRegion={AdsCountPerRegion}  
                  onClose={handleClose} 
                  popup={"home"}
                  handleOpenSell={handleOpenSell}
                  handleOpenBook={handleOpenBook}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety} 
                  handleOpenShop={handleOpenShop}
                  handleFilter={handleFilter}
                  handleOpenSearchByTitle={handleOpenSearchByTitle}
            />
          ) : (
            <Navbarhome 
             user={undefined}
            userstatus="User" 
            userId="" 
            AdsCountPerRegion={AdsCountPerRegion}
            popup={"home"}
            onClose={handleClose} 
                  handleOpenSell={handleOpenSell}
                  handleOpenBook={handleOpenBook}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety} 
                  handleOpenShop={handleOpenShop}
                  handleOpenSearchByTitle={handleOpenSearchByTitle}
                  handleFilter={handleFilter}/>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex mt-3 ">
        <div className="hidden lg:inline mr-5">
          <CategoryMenu
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            hoveredCategory={hoveredCategory}
            handleHoverCategory={handleHoverCategory}
            handleCategory={handleCategory}
            handleSubCategory={handleSubCategory}
            footerRef={footerRef}
          />
        </div>

        {/* Right Content (Scrolls Normally) */}
        <ScrollArea.Root className="flex-1 overflow-hidden">
      <ScrollArea.Viewport onMouseEnter={() => handleHoverCategory('')} ref={scrollRefB}  className="h-full overflow-y-auto">
     
       {/* <div ref={viewportRef} onMouseEnter={() => handleHoverCategory('')} className="flex-1"> */}
          <div className="mt-[170px] lg:hidden">
           <MenuSubmobileMain
                 categoryList={categoryList}
                 subcategoryList={subcategoryList}
                 handleSubCategory={handleSubCategory}
                 handleOpenSell={handleOpenSell}
                 handleCategory={handleCategory}
                 handleOpenChat={handleOpenChat}
                 handleOpenSearchTab={handleOpenSearchTab}
                 handleOpenSettings={handleOpenSettings}
                 userId={userId}
               />
          </div>
          <div>
          <h2 className="font-bold p-2 text-[30px]">Trending Ads</h2>
        
                </div>
          {data.length > 0 ? (
          
            <div className="flex w-full flex-col items-center gap-10 p-0">
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"> */}
              <div className="w-full mb-20">
                <Masonry
                 
                  breakpointCols={breakpointColumns}
                  className="flex gap-4"
                  columnClassName="bg-clip-padding"
                >
        {data.map((ad: any, index: number) => {
          const hasOrderLink = collectionType === "Ads_Organized";
          const hidePrice = collectionType === "My_Tickets";

          return (
            <div
              ref={data.length === index + 1 ? lastAdRef : null}
              key={ad._id}
              className="flex justify-center w-full"
            >
              <CardAutoHeight
                ad={ad}
                hasOrderLink={hasOrderLink}
                hidePrice={hidePrice}
                userId={userId}
                handleAdEdit={handleAdEdit}
                handleAdView={handleAdView}
                handleOpenPlan={handleOpenPlan}
              
              />
            </div>
          );
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
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView} 
        handleCategory={handleCategory}
        handleOpenSell={handleOpenSell}
        handleOpenPlan={handleOpenPlan}
      />
        </>  )}
           {loading && (
        <div>
          {isInitialLoading ? (
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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
            <Icon icon={Gooeyballs} className="w-10 h-10 text-gray-500" />
            </div>
          )}
        </div>
      )}
      <PopupCategory isOpen={isOpenCategory} onClose={handleCloseCategory} userId={userId} userName={userName} userImage={userImage} queryObject={newqueryObject} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
              handleOpenShop={handleOpenShop}
              handleOpenPerfomance={handleOpenPerfomance}
              handleOpenSettings={handleOpenSettings}
              handleAdEdit={handleAdEdit}
              handleCategory={handleCategory}
              handleOpenSearchTab={handleOpenSearchTab} 
              handleOpenSearchByTitle={handleOpenSearchByTitle}
              categoryList={categoryList}
              subcategoryList={subcategoryList}
              user={user}/>

      <PopupShop isOpen={isOpenShop} handleOpenReview={handleOpenReview} onClose={handleCloseShop} userId={userId} shopAcc={shopId} userName={userName} userImage={userImage} queryObject={newqueryObject} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings} 
      handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance} 
      handlePay={handlePay}
      user={user}/>

      <PopupSell isOpen={isOpenSell} onClose={handleCloseSell} type={"Create"} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handlePay={handlePay} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleCategory={handleCategory}
              handleOpenShop={handleOpenShop}
              handleOpenPerfomance={handleOpenPerfomance}
              handleOpenSettings={handleOpenSettings}
              handleOpenSearchTab={handleOpenSearchTab}
              subcategoryList={subcategoryList}
              handleAdView={handleAdView}
              user={user} />

      <PopupAdEdit isOpen={isOpenAdEdit} onClose={handleCloseAdEdit} type={"Update"} userId={userId} userName={userName} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
              handleOpenShop={handleOpenShop}
              handleOpenPerfomance={handleOpenPerfomance}
              handleOpenSettings={handleOpenSettings}
              handleCategory={handleCategory} 
              subcategoryList={subcategoryList}
              user={user} />
 
      <PopupAdView isOpen={isOpenAdView} onClose={handleCloseAdView} userId={userId} userName={userName} userImage={userImage} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleSubCategory={handleSubCategory} type={"Create"} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenReview={handleOpenReview} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
      handleOpenSettings={handleOpenSettings}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory} 
      handlePay={handlePay}
      user={user}/>

      <PopupBookmark isOpen={isOpenBook} onClose={handleCloseBook} userId={userId} handleOpenSell={handleOpenSell} handleAdEdit={handleAdEdit} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory} 
      handleOpenShop={handleOpenShop} 
      handleOpenChatId={handleOpenChatId} 
      handleOpenSettings={handleOpenSettings}
      user={user}/>

      <PopupPerfomance isOpen={isOpenPerfomance} onClose={handleClosePerfomance} userId={userId} handleOpenSell={handleOpenSell} handleAdEdit={handleAdEdit} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} userName={userName} userImage={userImage}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory}
      handleOpenShop={handleOpenShop}
      handleOpenChatId={handleOpenChatId}
      handleOpenSettings={handleOpenSettings}
      handlePay={handlePay} 
      handleOpenReview={handleOpenReview}
      user={user}/>

      <PopupPlan isOpen={isOpenPlan} onClose={handleClosePlan} userId={userId} handleOpenPlan={handleOpenPlan} handleOpenBook={handleOpenBook} handleOpenSell={handleOpenSell} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory}
      handleOpenShop={handleOpenShop}
      handleOpenSettings={handleOpenSettings}
      handlePay={handlePay} 
      handleOpenAbout={handleOpenAbout} 
      handleOpenTerms={handleOpenTerms} 
      handleOpenPrivacy={handleOpenPrivacy} 
      handleOpenSafety={handleOpenSafety}
      user={user}/>

      <PopupChat isOpen={isOpenChat} onClose={handleCloseChat} handleOpenChatId={handleOpenChatId} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenSettings={handleOpenSettings} handleCategory={handleCategory} handleOpenReview={handleOpenReview}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenShop={handleOpenShop}
      handlePay={handlePay}
      handleOpenSearchTab={handleOpenSearchTab}
      user={user}/>

      <PopupChatId isOpen={isOpenChatId} onClose={handleCloseChatId} recipientUid={recipientUid} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory} 
      handleAdEdit={handleAdEdit} 
      handleAdView={handleAdView}
      handleOpenSearchTab={handleOpenSearchTab}
      user={user}/>
      
      <PopupReviews isOpen={isOpenReview} onClose={handleCloseReview} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} recipient={recipient} handleOpenSettings={handleOpenSettings} handleOpenChatId={handleOpenChatId} handleOpenReview={handleOpenReview}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenShop={handleOpenShop}
      handleCategory={handleCategory}
      handlePay={handlePay}
      user={user}/>


<PopupSettings isOpen={isOpenProfile} onClose={handleCloseProfile} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory}
      handlePay={handlePay}
      handleOpenShop={handleOpenShop}
      user={user}
      handleOpenSearchTab={handleOpenSearchTab}/>

     <PopupAccount isOpen={isOpenSettings} onClose={handleCloseSettings} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory}
      handlePay={handlePay}
      handleOpenShop={handleOpenShop}
      user={user}
      handleOpenSearchTab={handleOpenSearchTab}
      handleOpenProfile={handleOpenProfile}
      handleOpenFaq={handleOpenFaq}
      userImage={userImage}
      userName={userName}
      handleAdEdit={handleAdEdit}
      handleAdView={handleAdView}
      handleOpenReview={handleOpenReview}/>
     
      <PopupPay txtId={txtId} isOpen={isOpenPay} onClose={handleClosePay} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory}
      handleOpenShop={handleOpenShop} 
      handleOpenChatId={handleOpenChatId}
      user={user}/>
       
      <PopupAbout isOpen={isOpenAbout} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseAbout} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleOpenShop={handleOpenShop}
      user={user}/>

      <PopupTerms isOpen={isOpenTerms} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseTerms} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenPerfomance={handleOpenPerfomance}
       handleOpenSettings={handleOpenSettings}
       handleOpenShop={handleOpenShop}
       user={user}
       />

      <PopupPrivacy isOpen={isOpenPrivacy} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleClosePrivacy} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenPerfomance={handleOpenPerfomance}
       handleOpenSettings={handleOpenSettings}
       handleOpenShop={handleOpenShop}
       user={user}
       />

      <PopupSafety isOpen={isOpenSafety} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseSafety} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      user={user}
     />

<PopupFaq isOpen={isOpenFaq} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseFaq} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings} 
      user={user}
     />
      <SearchTabWindow 
                isOpen={isOpenSearchTab}
                handleSubCategory={handleSubCategory}
                onClose={handleCloseSearchTab}
                categoryList={categoryList}
                subcategoryList={subcategoryList}
                hoveredCategory={hoveredCategory} 
                handleCategory={handleCategory} 
                handleHoverCategory={handleHoverCategory}/>
                   <SearchByTitle 
        isOpen={isOpenSearchByTitle}
        userId={userId}
        handleOpenSearchByTitle={handleOpenSearchByTitle}
        onClose={handleCloseSearchByTitle}
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView}
        handleOpenPlan={handleOpenPlan}
        queryObject={queryObject} />
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>

      </div>
       </div>
      <footer
        ref={footerRef}
        className="dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-white"
      >
        <div className="hidden lg:inline">
        <Footer
      handleOpenAbout={handleOpenAbout}
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}
      handleOpenFaq={handleOpenFaq}
    />
        </div>
         <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <BottomNavigation userId={userId} 
                     popup={"home"}
                     onClose={handleClose} 
                     handleOpenSell={handleOpenSell}
                     handleOpenChat={handleOpenChat}
                     handleOpenSettings={handleOpenSettings} 
                     handleOpenSearchTab={handleOpenSearchTab} 
                    />
        </div>
      </footer>
      </div>
    </>
  );
};

export default CollectionInfinite;
