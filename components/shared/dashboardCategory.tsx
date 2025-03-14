"use client";
import { IAd } from "@/lib/database/models/ad.model";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";

import Search from "./Search";
import { ICategory } from "@/lib/database/models/category.model";
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
import { ScrollArea } from "../ui/scroll-area";
import MenuType from "./MenuType";
import SearchNow from "./SearchNow";
import { mode } from "@/constants";
import BottomNavigation from "./BottomNavigation";
import Footersub from "./Footersub";
import { Toaster } from "../ui/toaster";
import Navbar from "./navbar";
import LocationSelection from "./LocationSelection";
const CollectionSearch = dynamic(() => import("./CollectionSearch"), {
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
const SidebarSearch = dynamic(() => import("./SidebarSearch"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-[280px] mt-10 h-full flex flex-col items-center justify-center">
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
  loading: boolean;
  userId: string;
  categoryList?: ICategory;
  limit: number;
  emptyTitle: string;
  emptyStateSubtext: string;
  AdsCountPerRegion: any;
  AdsCountPerVerifiedTrue: any;
  AdsCountPerVerifiedFalse: any;
  queryObject: any;
  adsCount: any;
};
const DashboardCategory = ({
  userId,
  categoryList,
  emptyTitle,
  emptyStateSubtext,
  AdsCountPerRegion,
  AdsCountPerVerifiedTrue,
  AdsCountPerVerifiedFalse,
  queryObject,
  adsCount,
}: // user,

// Accept the onSortChange prop
CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [activerange, setactiverange] = useState(20);
  const handleButtonClick = (index: number) => {
    setActiveButton(index);
  };
  const [region, setRegion] = useState("All Kenya");
  const [querysort, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (selectedOption: string) => {
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
    setLoading(true);
    setQuery(selectedOption);
    router.push(newUrl, { scroll: false });

    setActiveButton(1);
  };

  const handlePrice = (index: number, min: string, max: string) => {
    setactiverange(index);
    let newUrl = "";
    if (min) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "Price",
        value: min + "-" + max,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["Price"],
      });
    }
    setLoading(true);
    router.push(newUrl, { scroll: false });
  };
  // Function to get current location
  // Function to convert query parameters to an object
  const getQueryParamsObject = (url: string) => {
    const queryString = url.includes("?") ? url.split("?")[1] : url;
    return Object.fromEntries(new URLSearchParams(queryString));
  };

  // Compare function
  const areUrlsEquivalent = (url1: string, url2: string) => {
    const params1 = getQueryParamsObject(url1);
    const params2 = getQueryParamsObject(url2);

    return JSON.stringify(params1) === JSON.stringify(params2);
  };
  const handleClear = () => {
    let newUrl = "";
    setShowPopup(false);
    setactiverange(20);
    if(queryObject.subcategory){
      newUrl = formUrlQuerymultiple({
        params: "",
        updates: {
          category: queryObject.category.toString(),
          subcategory: queryObject.subcategory.toString(),
        },
      });
    }else{
      newUrl = formUrlQuerymultiple({
        params: "",
        updates: {
          category: queryObject.category.toString(),
        },
      });
    }
    
    if (!areUrlsEquivalent(newUrl, searchParams.toString())) {
      setLoading(true);
      router.push(newUrl, { scroll: false });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };
  const [showPopup, setShowPopup] = useState(false);
  // Handler to toggle the popup
  const togglePopup = () => {
    if (!showPopup && queryObject.subcategory) {
      let newUrl = "";
      setactiverange(20);
      newUrl = formUrlQuerymultiple({
        params: "",
        updates: {
          category: queryObject.category.toString(),
          subcategory: queryObject.subcategory.toString(),
        },
      });
      setLoading(true);
      router.push(newUrl, { scroll: false });
    }
    setShowPopup(!showPopup);
  };

  const onLoading = () => {
    setLoading(true);
  };
  const closeLoading = () => {
    setLoading(false);
  };
  const openLoading = () => {
    setLoading(true);
  };
  const handleRegion = (value:string) => {
    setRegion(value);
  };
  const [showPopupLocation, setShowPopupLocation] = useState(false);

  const handleOpenPopupLocation = () => {
    setShowPopupLocation(true);
  };
  const handleClosePopupLocation = () => {
    setShowPopupLocation(false);
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
    <>
    <div className="min-h-screen dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-gray-200">
      <div className="z-10 top-0 fixed w-full">
        <Navbar userstatus="User" userId={userId ?? ""} />
      </div>
   
      <div className="mt-1 mb-10 lg:mb-0 mt-[50px] lg:mt-[60px]">
      {/* <div className="text-sm breadcrumbs p-0 hidden lg:inline">
        <div className="flex">
          <div className="mt-3 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-500 bg-white p-2 rounded-full mr-2">
            <a href="/" className="no-underline">
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                <p className="p-medium-1 p-medium-14"> All Ads</p>
              </div>
            </a>
          </div>
          <div className="mt-3 text-gray-500 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-500 bg-white p-2 rounded-full mr-2">
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
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>

              <p className="p-medium-1 p-medium-14"> {queryObject.category}</p>
            </div>
          </div>
          <div className="mt-3 text-gray-500 dark:bg-[#2D3236] dark:text-gray-300 bg-white p-2 rounded-full">
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
              <p className="p-medium-1 p-medium-14">
                {queryObject.subcategory ? queryObject.subcategory : "All"}
              </p>
            </div>
          </div>
        </div>
      </div>*/}

      <div className="max-w-6xl mx-auto flex mt-3 p-1">
        <div className="hidden lg:inline mr-5">
          <div className="w-full rounded-lg p-0">
            <div className="flex justify-center items-center w-full h-full">
              <SidebarSearch
                categoryList={categoryList}
                category={queryObject.category}
                subcategory={queryObject.subcategory}
                AdsCountPerRegion={AdsCountPerRegion}
                AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                adsCount={adsCount}
                onLoading={onLoading}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-screen">
          <div className="rounded-lg hidden">
            <SidebarSearch
              categoryList={categoryList}
              category={queryObject.category}
              subcategory={queryObject.subcategory}
              AdsCountPerRegion={AdsCountPerRegion}
              AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
              AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
              adsCount={adsCount}
              onLoading={onLoading}
            />
          </div>
          <div className="rounded-lg max-w-8xl mx-auto justify-center">
            <div className="rounded-lg w-full">
              <div className="font-bold hidden lg:inline text-lg dark:text-gray-400 text-emerald-950 text-center sm:text-left p-2">
                {queryObject.subcategory ? (
                  <div className="mt-1"> {queryObject.subcategory} in Kenya</div>
                ) : (
                  <div className="mt-1">
                  All {queryObject.category} in Kenya
                  </div> 
                )}
              </div>
              <div className="lg:hidden">
                <section className="flex mt-2 mb-2 justify-between items-center gap-1 dark:bg-[#131B1E] bg-gray-100 bg-dotted-pattern bg-cover bg-center rounded-sm">
                  <div className="flex w-full p-0">
                    <SubCategoryFilterSearch
                      categoryList={categoryList}
                      category={queryObject.category}
                      onLoading={onLoading}
                    />
                  </div>

                 
                </section>
                {showPopup && (
                  <div className="bg-black bg-opacity-70 fixed top-0 left-0 w-full h-screen flex justify-center items-center z-50">
                    <div className="w-full flex flex-col h-[500px] m-1 p-2 rounded-lg w-full dark:bg-[#222528] text-black dark:text-gray-300 bg-white">
                      <div className="flex w-full items-center justify-between">
                        <div className="font-bold text-lg  dark:text-gray-300 text-emerald-950 text-center sm:text-left p-2">
                          {queryObject.subcategory ? (
                            <>{queryObject.subcategory} in Kenya</>
                          ) : (<>
                            All {queryObject.category} in Kenya
                            </> )}
                        </div>

                        <div onClick={togglePopup}>
                          <button className="dark:hover:bg-gray-700 p-1 rounded-xl mr-2">
                            <CloseIcon
                              className="text-white"
                              sx={{ fontSize: 24 }}
                            />
                          </button>
                        </div>
                      </div>

                      <SidebarSearchmobile
                        categoryList={categoryList}
                        category={queryObject.category}
                        subcategory={queryObject.subcategory}
                        AdsCountPerRegion={AdsCountPerRegion}
                        AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                        AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                        adsCount={adsCount}
                        onLoading={onLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1 justify-center items-center mb-2">
         
       
        <button
        onClick={handleOpenPopupLocation}
        className="flex gap-1 items-center justify-center py-4 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-sm hover:bg-gray-200"
        >
        <LocationOnIcon /> {region}
        </button>
       
        <div className="flex-1">
              <SearchNow onLoading={onLoading} />
        </div>
        {showPopupLocation && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                        <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-0 w-full  lg:max-w-3xl rounded-md shadow-md relative">
                          
                          <LocationSelection
                           onSelected={handleRegion}
                           AdsCountPerRegion={AdsCountPerRegion}
                           onClose={handleClosePopupLocation}
                          />
                        </div>
                      </div>
                    )}
        </div>
            <section className="my-0">
              <div>
                {queryObject.subcategory === "Cars, Vans & Pickups" && (
                  <div className="mb-1 w-full dark:bg-[#2D3236] dark:text-gray-300 bg-white flex flex-col rounded-lg p-2">
                    <div className="grid grid-cols-4 lg:grid-cols-7 justify-between gap-1 m-0">
                      <div
                        onClick={() => handlePrice(1, "0", "500000")}
                        className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                          activerange === 1
                            ? "bg-[#30AF5B] text-white"
                            : "dark:bg-[#131B1E] bg-[#ebf2f7] hover:bg-emerald-100"
                        }`}
                      >
                        0-500K
                      </div>

                      <div
                        onClick={() => handlePrice(2, "500000", "1000000")}
                        className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                          activerange === 2
                            ? "bg-[#30AF5B] text-white"
                            : "dark:bg-[#131B1E] bg-[#ebf2f7] hover:bg-emerald-100"
                        }`}
                      >
                        {"500K-1M"}
                      </div>

                      <div
                        onClick={() => handlePrice(3, "1000000", "2000000")}
                        className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                          activerange === 3
                            ? "bg-[#30AF5B] text-white"
                            : "dark:bg-[#131B1E] bg-[#ebf2f7] hover:bg-emerald-100"
                        }`}
                      >
                        {"1M-2M"}
                      </div>
                      <div
                        onClick={() => handlePrice(4, "2000000", "3000000")}
                        className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                          activerange === 4
                            ? "bg-[#30AF5B] text-white"
                            : "dark:bg-[#131B1E] bg-[#ebf2f7] hover:bg-emerald-100"
                        }`}
                      >
                        {"2M-3M"}
                      </div>
                      <div
                        onClick={() => handlePrice(5, "3000000", "5000000")}
                        className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                          activerange === 5
                            ? "bg-[#30AF5B] text-white"
                            : "dark:bg-[#131B1E] bg-[#ebf2f7] hover:bg-emerald-100"
                        }`}
                      >
                        {"3M-5M"}
                      </div>
                      <div
                        onClick={() => handlePrice(6, "5000000", "10000000")}
                        className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                          activerange === 6
                            ? "bg-[#30AF5B] text-white"
                            : "dark:bg-[#131B1E] bg-[#ebf2f7] hover:bg-emerald-100"
                        }`}
                      >
                        {"5M-10M"}
                      </div>
                      <div
                        onClick={() => handlePrice(7, "10000000", "9999999999")}
                        className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                          activerange === 7
                            ? "bg-[#30AF5B] text-white"
                            : "dark:bg-[#131B1E] bg-[#ebf2f7] hover:bg-emerald-100"
                        }`}
                      >
                        {"Above 10M"}
                      </div>
                    </div>
                    {/* <Menumake
                        category={queryObject.category}
                        subcategory={queryObject.subcategory}
                      />*/}
                  </div>
                )}
                {/*  {queryObject.subcategory === "Buses & Microbuses" && (
                    <>
                      <Menumake
                        category={queryObject.category}
                        subcategory={queryObject.subcategory}
                      />
                    </>
                  )}
                  {queryObject.subcategory === "Trucks & Trailers" && (
                    <>
                      <MenumakeBus
                        category={queryObject.category}
                        subcategory={queryObject.subcategory}
                      />
                    </>
                  )}
                  {queryObject.subcategory ===
                    "Motorbikes,Tuktuks & Scooters" && (
                    <>
                      <MenumakeMotobikes
                        category={queryObject.category}
                        subcategory={queryObject.subcategory}
                      />
                    </>
                  )}
                  {queryObject.subcategory === "Heavy Equipment" && (
                    <>
                      <MenuequipType
                        category={queryObject.category}
                        subcategory={queryObject.subcategory}
                      />
                    </>
                  )}
                  {queryObject.subcategory === "Watercraft & Boats" && (
                    <>
                      <MenuBoats
                        category={queryObject.category}
                        subcategory={queryObject.subcategory}
                      />
                    </>
                  )}*/}

                {queryObject.subcategory && (
                  <div className="w-full dark:bg-[#2D3236] dark:text-gray-300 bg-white flex flex-col rounded-lg p-2">
                    <MenuType
                      categoryList={categoryList}
                      category={queryObject.category}
                      subcategory={queryObject.subcategory}
                      onLoading={onLoading}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center mt-3 mb-2 w-full justify-between">
                <div className="flex items-center gap-1 flex-wrap justify-start items-center mb-4 ">
                  <div
                    className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
                      activeButton === 0 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(0)}
                  >
                    
                          <ViewModuleIcon /> <p>Grid layout</p>
                      
                  </div>
                  <div
                    className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
                      activeButton === 1 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(1)}
                  >
                    
                          <ViewListIcon /> <p>List layout</p>
                        
                  </div>
                  <div
                    className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
                      activeButton === 2 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(2)}
                  >
                   
                          <ShareLocationOutlinedIcon /> <p>View on Map</p>
                        
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="rounded-sm dark:bg-[#2D3236] bg-white border p-1 z-5 flex items-center">
                    <div className="text-[#30AF5B]">
                      <SwapVertIcon />
                    </div>
                    <Select onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px] dark:text-gray-300 text-gray-700 dark:bg-[#2D3236] border-0 rounded-full">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#222528]">
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={togglePopup}
                          className="lg:hidden flex py-3 px-1 cursor-pointer text-sm bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm p-1 justify-between items-center"
                        >
                          <SortOutlinedIcon />
                          Filter
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Advanced Filter</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <button
                    onClick={handleClear}
                    className="py-4 px-1 text-xs text-white bg-emerald-700  rounded-sm flex hover:bg-emerald-800  items-center gap-1 hover:cursor-pointer"
                  >
                    <SearchOffOutlinedIcon sx={{ fontSize: 16 }} />
                   Clear
                  </button>
                </div>
              </div>

              <CollectionSearch
                emptyTitle="No ads have been created yet"
                emptyStateSubtext="Go create some now"
                limit={20}
                userId={userId}
                activeButton={activeButton}
                queryObject={queryObject}
                loadPopup={loading}
                closeLoading={closeLoading}
                openLoading={openLoading}
              />
            </section>
          </div>
        </div>
      </div>
      <Toaster />
      </div>
      <footer>
        <div className="hidden lg:inline">
          <Footersub
                 handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety}/>
        </div>
        <div className="lg:hidden">
          <BottomNavigation userId={userId} />
        </div>
      </footer>
    </div>
    </>
  );
};

export default DashboardCategory;
