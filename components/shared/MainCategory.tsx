"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ICategory } from "@/lib/database/models/category.model";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Image from "next/image";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DiamondIcon from "@mui/icons-material/Diamond";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import ShareLocationOutlinedIcon from "@mui/icons-material/ShareLocationOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Menumake from "./menumake";
import MenumakeBus from "./MenumakeBus";
import MenumakeMotobikes from "./MenumakeMotobikes";
import MenuequipType from "./MenuequipType";
import MenuBoats from "./MenuBoats";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import Searchmain from "./Searchmain";
import MakeFilter from "./MakeFilter";
import SearchIcon from "@mui/icons-material/Search";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import SubCategoryFilterSearch from "./SubCategoryFilterSearch";
import SidebarSearchmobile from "./SidebarSearchmobile";
import CloseIcon from "@mui/icons-material/Close";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import MenuType from "./MenuType";
import SearchNow from "./SearchNow";
import { AdminId, mode } from "@/constants";
import BottomNavigation from "./BottomNavigation";
import Footersub from "./Footersub";
import { Toaster } from "../ui/toaster";
import Navbar from "./navbar";
import LocationSelection from "./LocationSelection";
import SidebarSearchMain from "./SidebarSearchMain";
import CategoryFilterSearch from "./CategoryFilterSearch";
import HeaderMain from "./HeaderMain";
import Unreadmessages from "./Unreadmessages";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MobileNav from "./MobileNav";
import CollectionSearch from "./CollectionSearch";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import PropertyMapSearch from "./PropertyMapSearch";
import { getAdsCount, getAdsCountPerRegion, getAdsCountPerVerifiedFalse, getAdsCountPerVerifiedTrue } from "@/lib/actions/dynamicAd.actions";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import FilterSkeleton from "./FilterSkeleton";
import LocationListSkeleton from "./LocationListSkeleton";
import ProgressPopup from "./ProgressPopup";
type CollectionProps = {
  loading: boolean;
  userId: string;
  userName: string;
  userImage: string;
  categoryList?: any;
  subcategoryList?: any;
  limit: number;
  emptyTitle: string;
  emptyStateSubtext: string;
  user: any;
  //AdsCountPerRegion: any;
  // AdsCountPerVerifiedTrue: any;
  // AdsCountPerVerifiedFalse: any;
  queryObject: any;
  // adsCount: any;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleAdView: (id: string) => void;
  handleAdEdit: (id: string) => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchByTitle: () => void;
  handleOpenShop: (shopId: string) => void;
  handleCategory: (value: string) => void;
  handleOpenSearchTab: (value: string) => void;
  handleOpenChatId: (value: any) => void;
}
const MainCategory = ({
  userId,
  userName,
  userImage,
  categoryList,
  subcategoryList,
  emptyTitle,
  emptyStateSubtext,
  user,
  //AdsCountPerRegion,
  //AdsCountPerVerifiedTrue,
  //AdsCountPerVerifiedFalse,
  queryObject,
  handleOpenChatId,
  onClose,
  handleOpenSell,
  handleOpenBook,
  handleAdView,
  handleAdEdit,
  handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety,
  handleOpenPlan,
  handleOpenChat,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  handleCategory,
  handleOpenSearchTab,
  handleOpenSearchByTitle,

}: // user,

  // Accept the onSortChange prop
  CollectionProps) => {
  const [showSidebar, setShowSidebar] = useState(true);

  const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
  const [adsCount, setAdsCount] = useState<any>([]);
  const [AdsCountPerRegion, setAdsCountPerRegion] = useState<any>([]);
  const [AdsCountPerVerifiedTrue, setAdsCountPerVerifiedTrue] = useState<any>([]);
  const [AdsCountPerVerifiedFalse, setAdsCountPerVerifiedFalse] = useState<any>([]);
  const [loadingCount, setLoadingCount] = useState<boolean>(true);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCount(true);

        const { category, subcategory } = queryObject;

        if (subcategory) {
          const getFieldsByCategoryAndSubcategory = (
            categoryName: string,
            subcategory: string,
            data: any
          ) => {
            return data
              .filter(
                (item: any) =>
                  item.category.name === categoryName &&
                  item.subcategory === subcategory
              )
              .map((item: any) => item.fields);
          };

          let adsCount: any = [];
          const dataString = getFieldsByCategoryAndSubcategory(
            category,
            subcategory,
            subcategoryList
          );
          const newfields = dataString[0]
            .filter((item: any) =>
              [
                "autocomplete",
                "radio",
                "multi-select",
                "select",
                "related-autocompletes",
                "year",
                "checkbox",
              ].includes(item.type)
            )
            .map((item: any) => item.name);

          let fields = newfields.flatMap((field: any) =>
            field === "make-model" ? ["make", "model"] : field
          );

          adsCount = await getAdsCount(category, subcategory, fields);

          setAdsCount(adsCount);
        }

        const [region, verifiedTrue, verifiedFalse] = await Promise.all([
          getAdsCountPerRegion(category, subcategory),
          getAdsCountPerVerifiedTrue(category, subcategory),
          getAdsCountPerVerifiedFalse(category, subcategory),
        ]);

        setAdsCountPerRegion(region);
        setAdsCountPerVerifiedTrue(verifiedTrue);
        setAdsCountPerVerifiedFalse(verifiedFalse);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoadingCount(false); // Mark loading as complete
      }
    };


    fetchData();

  }, [newqueryObject.category, newqueryObject.subcategory]);


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
  const [activeButton, setActiveButton] = useState(0);
  const [activerange, setactiverange] = useState(20);
  const handleButtonClick = (index: number) => {
    setActiveButton(index);
  };
  const [region, setRegion] = useState("All Kenya");
  const [clearQuery, setclearQuery] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>([]);
  const [selectedVerified, setSelectedVerified] = useState("all");
  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");
  const applyFilters = () => {
    // Filter out empty values from formData
    const filteredData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );
    handleFilter(filteredData);
    setShowPopup(false);

  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleCheckboxChange = (field: string, value: any) => {
    const currentSelection = formData[field] || []; // Get current selections for the field
    const isSelected = currentSelection.includes(value);

    const updatedSelection = isSelected
      ? currentSelection.filter((selected: any) => selected !== value) // Remove if already selected
      : [...currentSelection, value]; // Add new selection

    setFormData({ ...formData, [field]: updatedSelection }); // Update formData for the specific field
  };
  const handleInputAutoCompleteChange = (field: string, value: any) => {
    if (field === "make") {
      setFormData({ ...formData, [field]: value, model: "" });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };
  const handleInputYearChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleClearForm = () => {
    setminPrice('');
    setmaxPrice('')
    setSelectedVerified("all");
    setFormData([]);
    setNewqueryObject({
      ...queryObject, // Preserve existing properties
      category: newqueryObject.category.toString(),
      subcategory: newqueryObject.subcategory.toString(),
    });
    setShowPopup(false);
  };

  const handleminPriceChange = (value: string) => {
    setminPrice(value);
    if (value && maxPrice) {
      setFormData({ ...formData, price: value + "-" + maxPrice });
    }
  }
  const handlemaxPriceChange = (value: string) => {
    setmaxPrice(value);
    if (minPrice && value) {
      setFormData({ ...formData, price: minPrice + "-" + value });
    }
  }
  const handleVerifiedChange = (selectedOption: string) => {
    setSelectedVerified(selectedOption);
    setFormData({ ...formData, membership: selectedOption });
  }
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };
  const handleSortChange = (selectedOption: string) => {
    //let newUrl = "";
    if (selectedOption) {

      setNewqueryObject({
        ...queryObject, // Preserve existing properties
        sortby: selectedOption,
      });

      setActiveButton(1);

    }

  };

  const handlePrice = (index: number, min: string, max: string) => {
    setactiverange(index);

    if (min && max) {
      setNewqueryObject({
        ...queryObject, // Preserve existing properties
        category: newqueryObject.category.toString(),
        subcategory: newqueryObject.subcategory.toString(),
        price: min + "-" + max,
      });
    };
  };

  const handleClear = () => {
    setclearQuery(!clearQuery);
    setNewqueryObject({
      category: newqueryObject.category.toString(),
      subcategory: newqueryObject.subcategory.toString(),
    });

    setShowPopup(false);
    setactiverange(20);

  };
  const [showPopupMapSearch, setShowPopupMapSearch] = useState(false);

  const handleOpenPopupMapSearch = () => {
    setShowPopupMapSearch(true);
  };

  const handleClosePopupMapSearch = () => {
    setShowPopupMapSearch(false);
  };
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };
  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = () => {
    setIsOpenP(true);
  };


  const handleCloseP = () => {
    setIsOpenP(false);
  };
  const [showPopup, setShowPopup] = useState(false);
  // Handler to toggle the popup
  const togglePopup = () => {

    setShowPopup(!showPopup);

  };

  const onLoading = () => {
    setLoading(true);
    setShowPopup(false);
  };
  const closeLoading = () => {
    setLoading(false);
  };
  const openLoading = () => {
    setLoading(true);
  };
  const handleRegion = (value: string) => {
    setRegion(value);
  };
  const [showPopupLocation, setShowPopupLocation] = useState(false);

  const handleOpenPopupLocation = () => {
    setShowPopupLocation(true);
  };
  const handleClosePopupLocation = () => {
    setShowPopupLocation(false);
  };

  const handleFilter = (value: any) => {
    setNewqueryObject({
      ...queryObject,
      category: newqueryObject.category.toString(),
      subcategory: newqueryObject.subcategory.toString(),
      ...value,
    });
  };
  const handleResetFilter = (value: any) => {
    setclearQuery(!clearQuery);
    setNewqueryObject({
      ...value,
    });
  };
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
    <div className="relative flex w-full h-screen">
      <div className="top-0 z-10 fixed w-full">
        <Navbar user={user} userstatus={user} userId={userId} onClose={onClose} popup={"sell"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
          handleOpenPerfomance={handleOpenPerfomance}
          handleOpenSettings={handleOpenSettings}
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
          handleOpenShop={handleOpenShop} />
      </div>
      <div className="relative mt-[60px] dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] flex w-full">
        {/* Sidebar */}
        <div
          onClick={(e) => e.stopPropagation()} // Prevent sidebar from closing on itself click
          className={`dark:bg-[#131B1E] bg-white shadow-lg transition-transform rounded-0 duration-300 ease-in-out fixed md:relative z-10 ${showSidebar
            ? "w-full md:w-1/4 p-1 transform translate-x-0"
            : "-translate-x-full md:w-0 md:translate-x-0"
            }`}
        >
          <Button onClick={handleSidebarToggle} className="mb-4 md:hidden">
            {showSidebar ? "Hide" : "Show"} Sidebar
          </Button>

          {showSidebar && (
            <div className="flex flex-col space-y-4 h-full">
              <div className="w-full p-0 mt-4">
                <CategoryFilterSearch categoryList={categoryList} handleFilter={handleResetFilter} />
              </div>

              {/* Categories Section 
           <ScrollArea className="h-[100vh] text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white rounded-0 border p-3">*/}
              <ScrollArea.Root className="flex-1 overflow-hidden">
                <ScrollArea.Viewport className="h-full overflow-y-auto text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white rounded-0 border p-3">

                  <SidebarSearchMain
                    categoryList={subcategoryList}
                    category={newqueryObject.category}
                    subcategory={newqueryObject.subcategory}
                    handleFilter={handleResetFilter}

                  />
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" />
                <ScrollArea.Corner />
              </ScrollArea.Root>
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
          className={`flex-1 flex-col dark:bg-[#131B1E] bg-gray-100 transition-all duration-300 h-screen ${showSidebar ? "hidden md:block" : "block"
            }`}
        >


          <div className="relative h-full flex flex-col">
            <Button
              onClick={handleSidebarToggle}
              className="hidden lg:inline absolute bottom-5 left-4 z-10 md:block bg-orange-500 text-white shadow-lg hover:bg-orange-700"
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
            {/* Header Section */}
            <div className="mb-1 dark:bg-[#131B1E] flex flex-col gap-2 w-full">
              <div className="p-2 w-full flex flex-col items-center">
                <div className="w-full justify-between flex items-center">

                  <div className="hidden lg:inline dark:text-gray-400 font-bold text-black text-center sm:text-left p-0">
                    {newqueryObject.subcategory ? (
                      <div className="mt-0"> {newqueryObject.subcategory} in Kenya</div>
                    ) : (
                      <div className="mt-0">
                        All {newqueryObject.category} in Kenya
                      </div>
                    )}
                  </div>


                </div>

                <div className="w-full flex lg:hidden">
                  <div className="flex grid grid-cols-2 gap-5 w-full items-center">
                    <button
                      onClick={handleOpenPopupLocation}
                      className="flex w-full justify-center text-xs lg:text-base gap-1 items-center py-4 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-sm hover:bg-gray-100"
                    >
                      <div className="hidden lg:inline">
                        <LocationOnIcon />
                      </div>
                      <div className="lg:hidden">
                        <LocationOnIcon sx={{ fontSize: 24 }} />
                      </div> {region}
                    </button>

                    <div className="flex gap-1 w-full items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={togglePopup}
                              className="flex w-full text-xs bg-orange-500 py-4 px-3 cursor-pointer dark:bg-[#2D3236] rounded-sm border border-gray-300 dark:border-gray-600 text-gray-100 text-sm hover:bg-gray-700 p-1 justify-center items-center"
                            >

                              <div className="hidden lg:inline">
                                <SortOutlinedIcon />
                              </div>
                              <div className="lg:hidden">
                                <SortOutlinedIcon sx={{ fontSize: 20 }} />
                              </div>
                              <div className="flex gap-1 items-center">Filter</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Advanced Filter</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="flex w-full gap-1 mt-2 justify-center items-center mb-1">
                  <button
                    onClick={handleOpenPopupLocation}
                    className=" hidden lg:inline flex text-xs lg:text-base gap-1 items-center justify-center py-4 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-sm hover:bg-gray-100"
                  >
                    <div className="hidden lg:inline">
                      <LocationOnIcon />
                    </div>
                    <div className="lg:hidden">
                      <LocationOnIcon sx={{ fontSize: 24 }} />
                    </div> {region}
                  </button>

                  <div className="flex-1">
                    <SearchNow handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle} />
                  </div>



                  <div className="flex gap-1 items-center hidden lg:inline">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={togglePopup}
                            className="flex py-4 px-2 cursor-pointer dark:bg-[#2D3236] dark:border-gray-600 border rounded-sm bg-white shadow text-black text-sm hover:bg-gray-100 p-1 justify-between items-center"
                          >
                            <SortOutlinedIcon />
                            <div className="flex gap-1 items-center">Filter</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Advanced Filter</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>



                  {showPopupLocation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                      <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-0 w-full lg:max-w-3xl rounded-md shadow-md relative">

                        {loadingCount ? (<>{isMobile ? (<>
                          <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-[#222528] dark:text-gray-100 p-1 flex flex-col">
                            <div className="flex justify-between items-center border-b pb-2">
                              <div className="font-bold text-lg  dark:text-gray-300 text-orange-950 text-center sm:text-left p-2">
                                Location Filter
                              </div>
                              <Button variant="outline" onClick={handleClosePopupLocation}>
                                <CloseOutlinedIcon />
                              </Button>
                            </div>
                            <LocationListSkeleton />
                          </div></>) : (<>

                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                              <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-0 w-full  lg:max-w-3xl rounded-md shadow-md relative">
                                <div className="flex justify-between items-center border-b pb-2">
                                  <div className="font-bold text-lg  dark:text-gray-300 text-orange-950 text-center sm:text-left p-2">
                                    Location Filter
                                  </div>
                                  <Button variant="outline" onClick={handleClosePopupLocation}>
                                    <CloseOutlinedIcon />
                                  </Button>
                                </div>
                                <LocationListSkeleton />
                              </div></div>

                          </>)}

                        </>) : (<>
                          <LocationSelection
                            onSelected={handleRegion}
                            AdsCountPerRegion={AdsCountPerRegion}
                            onClose={handleClosePopupLocation}
                            handleFilter={handleFilter}
                          />
                        </>)}
                      </div>
                    </div>
                  )}
                  {showPopup && (<>


                    <SidebarSearchmobile
                      categoryList={subcategoryList}
                      category={newqueryObject.category}
                      subcategory={newqueryObject.subcategory}
                      AdsCountPerRegion={AdsCountPerRegion}
                      AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                      AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                      adsCount={adsCount}
                      onLoading={onLoading}
                      handleFilter={handleFilter}
                      selectedVerified={selectedVerified}
                      handleVerifiedChange={handleVerifiedChange}
                      handleminPriceChange={handleminPriceChange}
                      handlemaxPriceChange={handlemaxPriceChange}
                      maxPrice={maxPrice}
                      minPrice={minPrice}
                      formData={formData}
                      applyFilters={applyFilters}
                      handleInputChange={handleInputChange}
                      handleCheckboxChange={handleCheckboxChange}
                      handleInputAutoCompleteChange={handleInputAutoCompleteChange}
                      handleInputYearChange={handleInputYearChange}
                      handleClearForm={handleClearForm}
                      HandletogglePopup={togglePopup}
                    />

                  </>)}
                </div>
              </div>
            </div>

            {/* List Ads Section */}

            <div ref={scrollRefB} className="h-full overflow-y-auto rounded-t-md dark:bg-[#131B1E] bg-gray-100 border">

              {/* <ScrollArea className="h-[100vh] w-full dark:bg-[#131B1E] bg-gray-100 rounded-t-md lg:mb-0 lg:mt-0">*/}
              <section className="p-1 mb-[150px]">
                <div className="flex items-center p-1 w-full justify-between">
                  <div className="flex items-center gap-1 flex-wrap justify-start items-center mb-0">
                    <div
                      className={`flex gap-1 items-center shadow text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${activeButton === 0 ? "text-orange-500" : "text-gray-500"
                        }`}
                      onClick={() => handleButtonClick(0)}
                    >
                      <ViewModuleIcon />
                      <div className="hidden lg:inline">
                        <p>Grid layout</p>
                      </div>
                    </div>
                    <div
                      className={`flex gap-1 items-center text-xs shadow dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${activeButton === 1 ? "text-orange-500" : "text-gray-500"
                        }`}
                      onClick={() => handleButtonClick(1)}
                    >
                      <ViewListIcon />
                      <div className="hidden lg:inline">
                        <p>List layout</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="rounded-sm dark:bg-[#2D3236] shadow bg-white border py-1 px-2 z-5 flex items-center">
                      <div className="text-orange-500">
                        <SwapVertIcon />
                      </div>
                      <Select onValueChange={handleSortChange}>
                        <SelectTrigger className="lg:w-[200px] dark:text-gray-300 text-gray-700 dark:bg-[#2D3236] border-0 rounded-full">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#222528]">
                          <SelectGroup>
                            <SelectItem value="recommeded">Recommended first</SelectItem>
                            <SelectItem value="new">Newest first</SelectItem>
                            <SelectItem value="lowest">Lowest price first</SelectItem>
                            <SelectItem value="highest">Highest price first</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <button
                      onClick={handleClear}
                      className="py-4 px-2 text-xs dark:bg-[#2D3236] bg-white text-black shadow text-sm hover:bg-gray-100 rounded-sm flex items-center gap-1 hover:cursor-pointer"
                    >
                      <SearchOffOutlinedIcon sx={{ fontSize: 16 }} />Clear
                    </button>
                  </div>
                </div>

                <div className="mt-2 mb-2 dark:bg-[#2D3236] dark:text-gray-300 rounded-lg p-2">
                  {newqueryObject.subcategory === "Cars, Vans & Pickups" && (
                    <div className="w-full dark:bg-[#2D3236] dark:text-gray-300 flex flex-col">
                      <div className="grid grid-cols-4 lg:grid-cols-7 justify-between gap-1 m-0">
                        <div
                          onClick={() => handlePrice(1, "0", "500000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${activerange === 1
                            ? "bg-orange-500 text-white"
                            : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
                            }`}
                        >
                          0-500K
                        </div>

                        <div
                          onClick={() => handlePrice(2, "500000", "1000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${activerange === 2
                            ? "bg-orange-500 text-white"
                            : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
                            }`}
                        >
                          {"500K-1M"}
                        </div>

                        <div
                          onClick={() => handlePrice(3, "1000000", "2000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${activerange === 3
                            ? "bg-orange-500 text-white"
                            : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
                            }`}
                        >
                          {"1M-2M"}
                        </div>
                        <div
                          onClick={() => handlePrice(4, "2000000", "3000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${activerange === 4
                            ? "bg-orange-500 text-white"
                            : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
                            }`}
                        >
                          {"2M-3M"}
                        </div>
                        <div
                          onClick={() => handlePrice(5, "3000000", "5000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${activerange === 5
                            ? "bg-orange-500 text-white"
                            : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
                            }`}
                        >
                          {"3M-5M"}
                        </div>
                        <div
                          onClick={() => handlePrice(6, "5000000", "10000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${activerange === 6
                            ? "bg-orange-500 text-white"
                            : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
                            }`}
                        >
                          {"5M-10M"}
                        </div>
                        <div
                          onClick={() => handlePrice(7, "10000000", "9999999999")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${activerange === 7
                            ? "bg-orange-500 text-white"
                            : "dark:bg-[#131B1E] bg-white hover:bg-orange-100"
                            }`}
                        >
                          {"Above 10M"}
                        </div>
                      </div>
                    </div>
                  )}

                  {newqueryObject.subcategory && (
                    <div className="w-full dark:bg-[#2D3236] dark:text-gray-300 flex flex-col rounded-lg">
                      <MenuType
                        categoryList={subcategoryList}
                        category={newqueryObject.category}
                        subcategory={newqueryObject.subcategory}
                        clearQuery={clearQuery}
                        handleFilter={handleFilter}
                      />
                    </div>
                  )}
                </div>

                <CollectionSearch
                  emptyTitle="No ads have been created yet"
                  emptyStateSubtext="Go create some now"
                  limit={20}
                  userId={userId}
                  activeButton={activeButton}
                  queryObject={newqueryObject}
                  loadPopup={loading}
                  handleAdEdit={handleAdEdit}
                  handleOpenSell={handleOpenSell}
                  handleAdView={handleAdView}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChatId={handleOpenChatId}
                />
                <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
              </section>

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
                </>
              )}

              {/* Footer Section */}

              <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>
            </div>

            <footer>
              <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 transition-transform duration-300 ${showBottomNav ? "translate-y-0" : "translate-y-full"
                  }`}
              >
                <BottomNavigation
                  userId={userId}
                  popup={"category"}
                  onClose={onClose}
                  handleOpenSell={handleOpenSell}
                  handleOpenChat={handleOpenChat}
                  handleOpenSearchTab={handleOpenSearchTab}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenP={handleOpenP} />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCategory;