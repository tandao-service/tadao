"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
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
import { DrawerDemo } from "./DrawerDemo";
import PopupOrder from "./PopupOrder";
import { updateTransaction } from "@/lib/actions/transactions.actions";
import { App as CapacitorApp } from "@capacitor/app";
import NavbarhomeSkeleton from "./navbarhomeSkeleton";
import BottomNavigationSkeleton from "./BottomNavigationSkeleton";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import GavelIcon from "@mui/icons-material/Gavel";
import SearchIcon from "@mui/icons-material/Search";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/app/hooks/useAuth";
import { useToast } from "../ui/use-toast";
// Correct import
type CollectionProps = {
  limit: number;
  userId: string;
  emptyTitle: string;
  emptyStateSubtext: string;
  queryObject: any;
  urlParamName?: string;
  user: any;
  loans: any;
  myloans: any;
  uid: string;
  packagesList: any;
  userName: string;
  userImage: string;
  categoryList: any;
  subcategoryList: any;
  AdsCountPerRegion: any;
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
  loans,
  myloans,
  packagesList,
  uid,
}: CollectionProps) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast()
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
  const [isOpenOrderView, setIsOpenOrderView] = useState(false);
  const [isOpenOrderId, setIsOpenOrderId] = useState<any>([]);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenPerfomance, setIsOpenPerfomance] = useState(false);
  const [isOpenSearchTab, setIsOpenSearchTab] = useState(false);
  const [adId, setadId] = useState<any>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [CategorySelect, setCategorySelect] = useState('');
  const [isOpenSearchByTitle, setIsOpenSearchByTitle] = useState(false);
  const [wantedsubcategory, setWantedsubcategory] = useState('');
  const [showWantedPopup, setShowWantedPopup] = useState(false);
  const [wantedcategory, setWantedcategory] = useState('');
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [searchvalue, setSearchvalue] = useState('');

  let closepopup = false;
  const scrollRefB = useRef<HTMLDivElement>(null);

  const [scrollDir, setScrollDir] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";

      if (direction !== scrollDir && Math.abs(currentScrollY - lastScrollY) > 10) {
        // setScrollDir(direction);
        if (direction === "up") {
          setShowBottomNav(true)
        } else { setShowBottomNav(false) }
      }

      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDir);

    return () => {
      window.removeEventListener("scroll", updateScrollDir);
    };
  }, [scrollDir]);





  const handleHoverCategory = (value: string) => {
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
    setShowWantedPopup(false);
    setIsOpenAdEdit(false);
    setIsOpenPay(false);
    setIsOpenSearchTab(false);
    setIsOpenSearchByTitle(false);
    setIsOpenProfile(false);
    setIsOpenOrderView(false);
    setSearchvalue('');
    closepopup = false;
    router.replace("/", { scroll: false });
  };
  // ✅ Check if ANY popup is open
  const isAnyPopupOpen = () => {
    return (
      isOpenCategory ||
      isOpenSell ||
      isOpenAdView ||
      isOpenAdEdit ||
      isOpenPay ||
      isOpenAbout ||
      isOpenTerms ||
      isOpenPrivacy ||
      isOpenSafety ||
      isOpenFaq ||
      isOpenBook ||
      isOpenPlan ||
      isOpenChat ||
      isOpenChatId ||
      isOpenReview ||
      isOpenShop ||
      isOpenOrderView ||
      isOpenSettings ||
      isOpenProfile ||
      isOpenPerfomance ||
      isOpenSearchTab ||
      isOpenSearchByTitle ||
      showWantedPopup
    );
  };
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      CapacitorApp.addListener("backButton", ({ canGoBack }) => {

        // 1. If popup open → just close it

        // 2. If can go back → navigate back
        if (canGoBack) {
          window.history.back();
          return;
        }
        if (closepopup) {
          closepopup = false;
          setIsOpenCategory(false);
          handleClose();
          return;
        }
        setIsOpenCategory(false);
        handleClose();
        // 3. Otherwise → show exit modal
        setShowExitModal(true);
      });
    }

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("Ad");
      const Profile = params.get("Profile");
      const action = params.get("action");
      const privacypolicy = params.get("privacypolicy");
      const OrderTrackingId = params.get("OrderTrackingId");
      if (OrderTrackingId) {
        const tran = await updateTransaction(OrderTrackingId);
        setIsOpenOrderId(tran);
        setIsOpenOrderView(true);
      }

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
      if (privacypolicy) {
        setIsOpenPrivacy(true);
      } else {
        setIsOpenPrivacy(false);
      }
    };

    fetchData();
  }, []);
  const handleOpenPopup = () => {
    setShowPopup(true);
  };
  const handleOpenSearchTab = (value: string) => {
    handleClose();
    closepopup = true;
    setIsOpenCategory(false);
    setCategorySelect(value);
    setIsOpenSearchTab(true);
    history.pushState({ popup: true }, "");
  };
  const handleCloseSearchTab = () => {
    setIsOpenSearchTab(false);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleCloseSearchByTitle = () => {
    setSearchvalue('')
    setIsOpenSearchByTitle(false);

  };
  const handleOpenSearchByTitle = () => {
    setSearchvalue('')
    setIsOpenSearchByTitle(true);
  };

  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);
  const handleClosePerfomance = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenPerfomance(false);
  };
  const handleOpenPerfomance = () => {
    handleClose();
    closepopup = true;
    setIsOpenPerfomance(true);
  };

  const handleCloseSettings = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenSettings(false);
  };
  const handleOpenSettings = () => {
    handleClose();
    closepopup = true;
    setIsOpenSettings(true);
    history.pushState({ popup: true }, "");
  };

  const handleCloseChatId = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipientUid('')
    setIsOpenChatId(false);
  };
  const handleOpenChatId = (value: string) => {
    // handleClose();
    closepopup = true;
    history.pushState({ popup: true }, "");
    setrecipientUid(value)
    setIsOpenChatId(true);

  };

  const handleCloseShop = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setshopId([])
    setIsOpenShop(false);
  };

  const handleOpenShop = (shopId: any) => {
    handleClose();
    closepopup = true;
    setshopId(shopId)
    setIsOpenShop(true);
    history.pushState({ popup: true }, "");
  };
  const handleCloseReview = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipient([])
    setIsOpenReview(false);
  };
  const handleOpenReview = (value: any) => {
    handleClose();
    closepopup = true;
    setrecipient(value)
    setIsOpenReview(true);
    history.pushState({ popup: true }, "");
  };

  const handleCloseChat = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setIsOpenChat(false);
  };
  const handleOpenChat = () => {
    handleClose();
    closepopup = true;
    setIsOpenChat(true);
    history.pushState({ popup: true }, "");
  };

  const handleClosePlan = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([]);
    }

    setIsOpenPlan(false);
  };
  const handleOpenPlan = () => {
    handleClose();
    closepopup = true;
    setIsOpenPlan(true);
    history.pushState({ popup: true }, "");
  };
  const handleCloseBook = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenBook(false);
  };
  const handleOpenBook = () => {
    handleClose();
    closepopup = true;
    setIsOpenBook(true);
    history.pushState({ popup: true }, "");
  };

  const handleCloseTerms = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setIsOpenTerms(false);
  };
  const handleOpenTerms = () => {
    handleClose();
    closepopup = true;
    setIsOpenTerms(true);
    history.pushState({ popup: true }, "");
  };
  const handleClosePrivacy = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setIsOpenPrivacy(false);
  };
  const handleOpenPrivacy = () => {
    handleClose();
    closepopup = true;
    setIsOpenPrivacy(true);
    history.pushState({ popup: true }, "");
  };
  const handleOpenFaq = () => {
    handleClose();
    closepopup = true;
    setIsOpenFaq(true);
    history.pushState({ popup: true }, "");
  };

  const handleCloseFaq = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
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
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenSafety(false);
  };
  const handleOpenSafety = () => {
    handleClose();
    closepopup = true;
    setIsOpenSafety(true);
    history.pushState({ popup: true }, "");
  };
  const handleCloseAbout = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenAbout(false);
  };
  const handleOpenAbout = () => {
    handleClose();
    closepopup = true;
    setIsOpenAbout(true);
    history.pushState({ popup: true }, "");
  };

  const handlePay = (id: string) => {
    handleClose();
    closepopup = true;
    setTxtId(id);

    setTimeout(() => {
      setIsOpenPay(true);
    }, 500); // Delay in milliseconds (adjust as needed)
  };

  const handleClosePay = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenPay(false);
  };

  const handleCloseOrderView = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenOrderView(false);
  };
  const handleOpenProfile = () => {

    handleClose();
    closepopup = true;
    setIsOpenProfile(true);
    history.pushState({ popup: true }, "");

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
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setadId([]);
    setIsOpenAdEdit(false);
  };

  const handleAdEdit = (ad: any) => {
    handleClose();
    closepopup = true;
    setadId(ad);
    setIsOpenAdEdit(true);
  };

  const handleCloseAdView = () => {
    const params = new URLSearchParams(window.location.search);
    const ad = params.get("Ad");
    if (ad) {
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
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
    }
    setNewqueryObject([])
    setIsOpenCategory(false);
  };

  const handleDrawer = (category: string, subcategory: string) => {

    handleClose();
    closepopup = true;
    if (category && subcategory) {
      setWantedcategory(category);
      setWantedsubcategory(subcategory);
      setShowWantedPopup(true);
    }

    //setTimeout(() => {
    //  setIsOpenSell(true);
    // }, 500); // Delay in milliseconds (adjust as needed)
  };

  const handleOpenSell = (category?: string, subcategory?: string) => {
    handleClose();
    closepopup = true;
    if (category && subcategory) {
      setWantedcategory(category);
      setWantedsubcategory(subcategory);
    }

    setTimeout(() => {
      setIsOpenSell(true);
      history.pushState({ popup: true }, "");
    }, 500); // Delay in milliseconds (adjust as needed)
  };

  const handleCloseSell = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const privacypolicy = params.get("privacypolicy");
    const OrderTrackingId = params.get("OrderTrackingId");
    if (Profile || Ad || action || privacypolicy || OrderTrackingId) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenSell(false);
  };
  const handleAdView = (ad: any) => {
    handleClose();
    closepopup = true;
    setadId(ad);
    setIsOpenAdView(true);
  };

  const handleFilter = (value: any) => {

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
      closepopup = true;
      //setIsOpenAdView(false);
      //setIsOpenSell(false);

    };
  };
  const handleSubCategory = (category: string, subcategory: string) => {

    if (category && subcategory) {

      if (category === 'bids' && subcategory === 'bids') {
        handleClose();

        setTimeout(() => {
          setSearchvalue("bids");
          setIsOpenSearchByTitle(true);
        }, 1000);


      } else {

        handleClose();
        setNewqueryObject({
          ...queryObject, // Preserve existing properties
          category: category.toString(),
          subcategory: subcategory.toString(),
        });
        setHoveredCategory(null);
        setIsOpenCategory(true);
        closepopup = true;
        setIsOpenAdView(false);
        setIsOpenSell(false);
      }
    } else {
      if (category) {

        setNewqueryObject({
          ...queryObject, // Preserve existing properties
          category: category.toString(),
        });
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



  const [isnav, setisNav] = useState(false);
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
      <div className="bg-gray-100 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] min-h-screen">
        <Head>
          <title>Tadao | Buy and Sell Online in Kenya</title>
          <meta
            name="description"
            content="tadaoservices.com is Kenya's leading online marketplace. Buy or sell cars, motorbikes, buses, pickups, heavy-duty machinery, and more with ease."
          />
          <meta
            property="og:title"
            content="Tadao | Buy and Sell Online in Kenya"
          />
          <meta
            property="og:description"
            content="Welcome to Tadao, the trusted platform for buying and selling Online across Kenya. Find your perfect ride or sell your vehicle today!"
          />
          <meta property="og:image" content="/assets/images/logo.png" />
          <meta property="og:url" content="https://tadaoservices.com" />
          <meta property="og:type" content="website" />
          <meta
            name="keywords"
            content="Tadao, buy and sell Online Kenya"
          />
          <meta name="author" content="Tadao" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href="https://tadaoservices.com" />
        </Head>

        <div className="w-full h-full">
          <div onMouseEnter={() => handleHoverCategory('')} className="sm:hidden fixed top-0 z-10 w-full">
            {user && uid ? (
              <Navbarhome
                user={user?.user ?? []}
                userstatus={user?.user?.status ?? "User"}
                userId={userId}
                AdsCountPerRegion={AdsCountPerRegion}
                onClose={handleClose}
                isnav={isnav}
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
            ) : (<>
              {uid && !user ? (<><NavbarhomeSkeleton user={undefined}
                userstatus="User"
                userId=""
                isnav={isnav}
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
                handleFilter={handleFilter} /></>) : (<>
                  <Navbarhome
                    userstatus="User"
                    userId=""
                    isnav={isnav}
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
                    handleFilter={handleFilter} user={undefined} /></>)}

            </>)}
          </div>
          <div className="hidden sm:inline">
            <div onMouseEnter={() => handleHoverCategory('')} className="w-full">
              {user && uid ? (
                <Navbarhome
                  user={user?.user ?? []}
                  userstatus={user?.user?.status ?? "User"}
                  userId={userId}
                  AdsCountPerRegion={AdsCountPerRegion}
                  onClose={handleClose}
                  isnav={isnav}
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
              ) : (<>
                {uid && !user ? (<><NavbarhomeSkeleton user={undefined}
                  userstatus="User"
                  userId=""
                  isnav={isnav}
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
                  handleFilter={handleFilter} /></>) : (<>
                    <Navbarhome
                      user={undefined}
                      userstatus="User"
                      userId=""
                      isnav={isnav}
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
                      handleFilter={handleFilter} />
                  </>)}
              </>
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
                setisNav={setisNav}
                handleDrawer={handleDrawer}
                loans={loans}
              />
            </div>

            {/* Right Content (Scrolls Normally) */}
            <ScrollArea.Root className="flex-1 overflow-hidden">
              <ScrollArea.Viewport onMouseEnter={() => handleHoverCategory('')} ref={scrollRefB} className="h-full overflow-y-auto">

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
                    handlePayNow={handlePay}
                    handleDrawer={handleDrawer}
                    userId={userId}
                    user={user?.user ?? []}
                    loans={loans}
                    packagesList={packagesList} />
                </div>
                <div>
                  <div className="grid bg-white p-2 rounded-2xl grid-cols-4 md:grid-cols-4 gap-4 m-2">

                    {/* Post Ad */}

                    <div
                      onClick={() => {
                        if (user?.user?._id && currentUser) {
                          // Logged in, ready
                          handleOpenSell();
                        } else if (!user?.user?._id && currentUser) {
                          // Logged in but user data still loading
                          toast({
                            title: "Please wait",
                            description: (
                              <div className="flex items-center gap-2">
                                <CircularProgress sx={{ color: "#000000" }} size={20} />
                                <span>Loading...</span>
                              </div>
                            ),
                          });
                        } else {
                          // Not logged in
                          router.push("/auth");
                        }
                      }}

                      className="h-[100px] bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
                    >
                      <div className="p-3 rounded-full bg-orange-200 mb-2">
                        <SellOutlinedIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <h2 className="text-base font-semibold text-orange-700">Post Ad</h2>
                    </div>

                    {/* Donated */}
                    <div
                      onClick={() => {
                        if (user?.user?._id && currentUser) {
                          // Logged in, ready
                          handleDrawer('Donations', 'Donated Items');
                        } else if (!user?.user?._id && currentUser) {
                          // Logged in but user data still loading
                          toast({
                            title: "Please wait",
                            description: (
                              <div className="flex items-center gap-2">
                                <CircularProgress sx={{ color: "#000000" }} size={20} />
                                <span>Loading...</span>
                              </div>
                            ),
                          });
                        } else {
                          // Not logged in
                          router.push("/auth");
                        }
                      }}
                      className="h-[100px] bg-gradient-to-br from-green-50 to-green-100 border border-green-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
                    >
                      <div className="p-3 rounded-full bg-green-200 mb-2">
                        <VolunteerActivismIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <h2 className="text-base font-semibold text-green-700">Donated Items</h2>
                    </div>

                    {/* Auction */}
                    <div
                      onClick={() => {

                        if (user?.user?._id && currentUser) {
                          // Logged in, ready
                          handleDrawer('bids', 'bids');
                        } else if (!user?.user?._id && currentUser) {
                          // Logged in but user data still loading
                          toast({
                            title: "Please wait",
                            description: (
                              <div className="flex items-center gap-2">
                                <CircularProgress sx={{ color: "#000000" }} size={20} />
                                <span>Loading...</span>
                              </div>
                            ),
                          });
                        } else {
                          // Not logged in

                          router.push("/auth");
                        }
                      }}
                      className="h-[100px] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
                    >
                      <div className="p-3 rounded-full bg-blue-200 mb-2">
                        <GavelIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h2 className="text-base font-semibold text-blue-700">Auction</h2>
                    </div>

                    {/* Lost & Found */}
                    <div
                      onClick={() => {
                        if (user?.user?._id && currentUser) {
                          // Logged in, ready
                          handleDrawer('Lost and Found', 'Lost and Found Items');
                        } else if (!user?.user?._id && currentUser) {
                          // Logged in but user data still loading
                          toast({
                            title: "Please wait",
                            description: (
                              <div className="flex items-center gap-2">
                                <CircularProgress sx={{ color: "#000000" }} size={20} />
                                <span>Loading...</span>
                              </div>
                            ),
                          });
                        } else {
                          // Not logged in
                          router.push("/auth");
                        }
                      }}
                      className="h-[100px] bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 
               flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 
               hover:shadow-lg hover:scale-[1.03] transition-all"
                    >
                      <div className="p-3 rounded-full bg-purple-200 mb-2">
                        <SearchIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <h2 className="text-base font-semibold text-purple-700">Lost & Found</h2>
                    </div>


                  </div>
                  <h2 className="font-bold p-2 text-[30px]">Trending Ads</h2>
                  <div className="bg-gradient-to-r from-[#8C4B2C] from-10% via-[#BD7A4F] via-40% to-[#F5CBA7] to-90%"></div>


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
                                handleOpenChatId={handleOpenChatId}
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
                  </>)}
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
                        <Image
                          src="/assets/icons/loading.gif"
                          alt="edit"
                          width={60}
                          height={60}
                        />
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
                  user={user?.user ?? []}
                  handleOpenChatId={handleOpenChatId}
                />

                <PopupShop isOpen={isOpenShop} handleOpenReview={handleOpenReview} onClose={handleCloseShop} userId={userId} shopAcc={shopId} userName={userName} userImage={userImage} queryObject={newqueryObject} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings}
                  handleOpenShop={handleOpenShop}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handlePay={handlePay}
                  user={user}
                  loans={myloans} />

                <PopupSell isOpen={isOpenSell} packagesList={packagesList} category={wantedcategory} subcategory={wantedsubcategory} onClose={handleCloseSell} type={"Create"} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handlePay={handlePay} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleCategory={handleCategory}
                  handleOpenShop={handleOpenShop}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenSearchTab={handleOpenSearchTab}
                  subcategoryList={subcategoryList}
                  handleAdView={handleAdView}
                  user={user}
                  userImage={userImage} />

                <PopupAdEdit isOpen={isOpenAdEdit} onClose={handleCloseAdEdit} type={"Update"} userId={userId} userName={userName} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenShop={handleOpenShop}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleCategory={handleCategory}
                  handlePay={handlePay}
                  subcategoryList={subcategoryList}
                  user={user}
                  packagesList={packagesList}
                  category={wantedcategory}
                  subcategory={wantedsubcategory}
                  userImage={userImage} />

                <PopupAdView isOpen={isOpenAdView} onClose={handleCloseAdView} userId={userId} userName={userName} userImage={userImage} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleSubCategory={handleSubCategory} type={"Create"} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenReview={handleOpenReview} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleCategory={handleCategory}
                  handlePay={handlePay}
                  user={user?.user ?? []} />

                <PopupBookmark isOpen={isOpenBook} onClose={handleCloseBook} userId={userId} handleOpenSell={handleOpenSell} handleAdEdit={handleAdEdit} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleCategory={handleCategory}
                  handleOpenShop={handleOpenShop}
                  handleOpenChatId={handleOpenChatId}
                  handleOpenSettings={handleOpenSettings}
                  user={user?.user ?? []} />

                <PopupPerfomance isOpen={isOpenPerfomance} onClose={handleClosePerfomance} userId={userId} handleOpenSell={handleOpenSell} handleAdEdit={handleAdEdit} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} userName={userName} userImage={userImage}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleCategory={handleCategory}
                  handleOpenShop={handleOpenShop}
                  handleOpenChatId={handleOpenChatId}
                  handleOpenSettings={handleOpenSettings}
                  handlePay={handlePay}
                  handleOpenReview={handleOpenReview}
                  user={user ?? []} />

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
                  user={user ?? []}
                  packagesList={packagesList} />

                <PopupChat isOpen={isOpenChat} onClose={handleCloseChat} handleOpenChatId={handleOpenChatId} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenSettings={handleOpenSettings} handleCategory={handleCategory} handleOpenReview={handleOpenReview}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenShop={handleOpenShop}
                  handlePay={handlePay}
                  handleOpenSearchTab={handleOpenSearchTab}
                  user={user?.user ?? []} />

                <PopupChatId isOpen={isOpenChatId} onClose={handleCloseChatId} recipientUid={recipientUid} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleCategory={handleCategory}
                  handleAdEdit={handleAdEdit}
                  handleAdView={handleAdView}
                  handleOpenSearchTab={handleOpenSearchTab}
                  user={user?.user ?? []} />

                <PopupReviews isOpen={isOpenReview} onClose={handleCloseReview} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} recipient={recipient} handleOpenSettings={handleOpenSettings} handleOpenChatId={handleOpenChatId} handleOpenReview={handleOpenReview}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenShop={handleOpenShop}
                  handleCategory={handleCategory}
                  handlePay={handlePay}
                  user={user?.user ?? []} />


                <PopupSettings isOpen={isOpenProfile} onClose={handleCloseProfile} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleCategory={handleCategory}
                  handlePay={handlePay}
                  handleOpenShop={handleOpenShop}
                  user={user?.user ?? []}
                  handleOpenSearchTab={handleOpenSearchTab} />

                <PopupAccount isOpen={isOpenSettings} onClose={handleCloseSettings} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleCategory={handleCategory}
                  handlePay={handlePay}
                  handleOpenShop={handleOpenShop}
                  user={user?.user ?? []}
                  handleOpenSearchTab={handleOpenSearchTab}
                  handleOpenProfile={handleOpenProfile}
                  handleOpenFaq={handleOpenFaq}
                  userImage={userImage}
                  userName={userName}
                  handleAdEdit={handleAdEdit}
                  handleAdView={handleAdView}
                  handleOpenReview={handleOpenReview}
                />

                <PopupPay txtId={txtId} isOpen={isOpenPay} onClose={handleClosePay} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleCategory={handleCategory}
                  handleOpenShop={handleOpenShop}
                  handleOpenChatId={handleOpenChatId}
                  user={user?.user ?? []} />

                <PopupOrder trans={isOpenOrderId} isOpen={isOpenOrderView} onClose={handleCloseOrderView} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleCategory={handleCategory}
                  handleOpenShop={handleOpenShop}
                  handleOpenChatId={handleOpenChatId}
                  user={user?.user ?? []} />

                <PopupAbout isOpen={isOpenAbout} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseAbout} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenShop={handleOpenShop}
                  user={user?.user ?? []} />

                <PopupTerms isOpen={isOpenTerms} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseTerms} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenShop={handleOpenShop}
                  user={user?.user ?? []}
                />

                <PopupPrivacy isOpen={isOpenPrivacy} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleClosePrivacy} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenShop={handleOpenShop}
                  user={user?.user ?? []}
                />

                <PopupSafety isOpen={isOpenSafety} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseSafety} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenShop={handleOpenShop}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  user={user?.user ?? []}
                />

                <PopupFaq isOpen={isOpenFaq} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseFaq} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenShop={handleOpenShop}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  user={user?.user ?? []}
                />
                <SearchTabWindow
                  isOpen={isOpenSearchTab}
                  handleSubCategory={handleSubCategory}
                  onClose={handleCloseSearchTab}
                  categoryList={categoryList}
                  subcategoryList={subcategoryList}
                  hoveredCategory={hoveredCategory}
                  handleCategory={handleCategory}
                  handleHoverCategory={handleHoverCategory} />
                <SearchByTitle
                  isOpen={isOpenSearchByTitle}
                  userId={userId}
                  handleOpenSearchByTitle={handleOpenSearchByTitle}
                  onClose={handleCloseSearchByTitle}
                  handleAdEdit={handleAdEdit}
                  handleAdView={handleAdView}
                  handleOpenPlan={handleOpenPlan}
                  queryObject={queryObject}
                  categoryList={categoryList}
                  value={searchvalue}
                  handleOpenChatId={handleOpenChatId} />
                <DrawerDemo
                  handleOpenSell={handleOpenSell}
                  handlePayNow={handlePay}
                  userId={userId}
                  category={wantedcategory}
                  subcategory={wantedsubcategory}
                  user={user}
                  isOpen={showWantedPopup}
                  packagesList={packagesList}
                  onClose={handleClose}
                  handleSubCategory={handleSubCategory} />

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
            className={`lg:hidden fixed bottom-0 left-0 right-0 transition-transform duration-300 ${showBottomNav ? "translate-y-0" : "translate-y-full"
              }`}
          >
            {user && uid ? (<BottomNavigation userId={userId}
              popup={"home"}
              onClose={handleClose}
              handleOpenSell={handleOpenSell}
              handleOpenChat={handleOpenChat}
              handleOpenSettings={handleOpenSettings}
              handleOpenSearchTab={handleOpenSearchTab}
              handleOpenP={handleOpenP}
            />) : (<><BottomNavigationSkeleton userId={userId}
              popup={"home"}
              onClose={handleClose}
              handleOpenSell={handleOpenSell}
              handleOpenChat={handleOpenChat}
              handleOpenSettings={handleOpenSettings}
              handleOpenSearchTab={handleOpenSearchTab}
              handleOpenP={handleOpenP} /></>)}
          </div>
        </footer>
        {showExitModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="mb-4 text-lg font-medium">
                Do you want to exit the app?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded-xl bg-gray-200"
                  onClick={() => setShowExitModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-red-500 text-white"
                  onClick={() => CapacitorApp.exitApp()}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CollectionInfinite;
