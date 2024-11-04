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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
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
      {/* <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-wrap mt-10 gap-1 justify-center">
        <Skeleton
          variant="rectangular"
          animation="wave"
          //height={250}
          className="rounded-sm w-[200px] md:w-[200px] lg:w-[250px]"
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          //  height={250}
          className="rounded-sm w-[200px] md:w-[200px] lg:w-[250px]"
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          // height={250}
          className="rounded-sm w-[200px] md:w-[200px] lg:w-[250px]"
        />
      </div>
        
    </div>
    */}
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
      {/*  <div className="m-1 space-y-0 lg:flex lg:space-x-5">
      <div className="flex flex-wrap mt-10 gap-1 justify-center">
        <Skeleton
          variant="rectangular"
          animation="wave"
          //height={400}
          className="rounded-sm w-full md:w-[300px] lg:w-[300px]"
        />
      </div>*/}
    </div>
  ),
});
type CollectionProps = {
  loading: boolean;
  userId: string;
  category: string;
  categoryList?: ICategory;
  subcategory: string;
  //data: IAd[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  Type: string;
  makeselected: string;
  // page: number | string;
  // totalPages?: number;
  urlParamName?: string;
  //vehiclemake: string;
  AdsCountPerSubcategory: any;
  AdsCountPerRegion: any;
  AdsCountPerVerifiedTrue: any;
  AdsCountPerVerifiedFalse: any;
  make: any;
  AdsCountPerColor: any;
  AdsCountPerTransmission: any;
  AdsCountPerFuel: any;
  AdsCountPerCondition: any;
  AdsCountPerCC: any;
  AdsCountPerExchange: any;
  AdsCountPerBodyType: any;
  AdsCountPerRegistered: any;
  AdsCountPerSeats: any;
  AdsCountPersecondCondition: any;
  AdsCountPerYear: any;
  Types: any;
  AdsCountPerlanduse: any;
  AdsCountPerfloors: any;
  AdsCountPerhouseclass: any;
  AdsCountPerbedrooms: any;
  AdsCountPerbathrooms: any;
  AdsCountPerfurnishing: any;
  AdsCountPeramenities: any;
  AdsCountPertoilets: any;
  AdsCountPerparking: any;
  AdsCountPerstatus: any;
  AdsCountPerarea: any;
  AdsCountPerpropertysecurity: any;
  searchText: string;
  sortby: string;

  vehiclemodel: string;
  yearfrom: string;
  yearto: string;
  vehiclecolor: string;
  vehiclecondition: string;
  vehicleTransmissions: string;
  longitude: string;
  latitude: string;
  region: string;
  membership: string;
  vehicleFuelTypes: string;
  vehicleEngineSizesCC: string;
  vehicleexchangeposible: string;
  vehicleBodyTypes: string;
  vehicleregistered: string;
  vehicleSeats: string;
  vehiclesecordCondition: string;
  vehicleyear: string;
  Price: string;
  bedrooms: string;
  bathrooms: string;
  furnishing: string;
  amenities: any;
  toilets: string;
  parking: string;
  status: string;
  area: string;
  landuse: string;
  propertysecurity: string;
  floors: string;
  estatename: string;
  houseclass: string;
};

const DashboardCategory = ({
  Type,
  userId,
  // data,
  //page,
  //totalPages = 0,
  category,
  categoryList,
  subcategory,
  AdsCountPerSubcategory,
  AdsCountPerRegion,
  AdsCountPerVerifiedTrue,
  AdsCountPerVerifiedFalse,
  make,
  makeselected,
  AdsCountPerColor,
  AdsCountPerTransmission,
  AdsCountPerFuel,
  AdsCountPerCondition,
  AdsCountPerCC,
  AdsCountPerExchange,
  AdsCountPerBodyType,
  AdsCountPerRegistered,
  AdsCountPerSeats,
  AdsCountPersecondCondition,
  Types,
  AdsCountPerYear,
  AdsCountPerlanduse,
  AdsCountPerfloors,
  AdsCountPerhouseclass,
  AdsCountPerbedrooms,
  AdsCountPerbathrooms,
  AdsCountPerfurnishing,
  AdsCountPeramenities,
  AdsCountPertoilets,
  AdsCountPerparking,
  AdsCountPerstatus,
  AdsCountPerarea,
  AdsCountPerpropertysecurity,
  searchText,
  sortby,
  vehiclemodel,
  yearfrom,
  yearto,
  vehiclecolor,
  vehiclecondition,
  vehicleTransmissions,
  longitude,
  latitude,
  region,
  membership,
  vehicleFuelTypes,
  vehicleEngineSizesCC,
  vehicleexchangeposible,
  vehicleBodyTypes,
  vehicleregistered,
  vehicleSeats,
  vehiclesecordCondition,
  vehicleyear,
  Price,
  bedrooms,
  bathrooms,
  furnishing,
  amenities,
  toilets,
  parking,
  status,
  area,
  landuse,
  propertysecurity,
  floors,
  estatename,
  houseclass,
}: // user,

// Accept the onSortChange prop
CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [activerange, setactiverange] = useState(20);
  const handleButtonClick = (index: number) => {
    setActiveButton(index);
  };

  const [querysort, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

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

    router.push(newUrl, { scroll: false });
  };
  // Function to get current location
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

  // const [loadin, setLoading] = useState(loading);
  // const [adsData, setAdsData] = useState(data);

  //useEffect(() => {
  // Simulate loading state
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //    setAdsData(data);
  //  }, 1000);

  // Simulated delay
  // }, [data]);
  const handleClear = () => {
    let newUrl = "";
    setShowPopup(false);
    setactiverange(20);
    newUrl = formUrlQuerymultiple({
      params: "",
      updates: {
        category: category.toString(),
        subcategory: subcategory.toString(),
      },
    });
    router.push(newUrl, { scroll: false });
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
    if (!showPopup) {
      let newUrl = "";
      setactiverange(20);
      newUrl = formUrlQuerymultiple({
        params: "",
        updates: {
          category: category.toString(),
          subcategory: subcategory.toString(),
        },
      });
      router.push(newUrl, { scroll: false });
    }
    setShowPopup(!showPopup);
  };
  return (
    <>
      <div className="max-w-6xl mx-auto flex mt-3 p-1">
        <div className="hidden lg:inline mr-5">
          <div className="w-full rounded-lg p-0">
            <div className="flex justify-center items-center w-full h-full">
              <SidebarSearch
                categoryList={categoryList}
                category={category}
                AdsCountPerSubcategory={AdsCountPerSubcategory}
                AdsCountPerRegion={AdsCountPerRegion}
                subcategory={subcategory}
                AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                make={make}
                AdsCountPerColor={AdsCountPerColor}
                AdsCountPerTransmission={AdsCountPerTransmission}
                AdsCountPerFuel={AdsCountPerFuel}
                AdsCountPerCondition={AdsCountPerCondition}
                AdsCountPerCC={AdsCountPerCC}
                AdsCountPerExchange={AdsCountPerExchange}
                AdsCountPerBodyType={AdsCountPerBodyType}
                AdsCountPerRegistered={AdsCountPerRegistered}
                AdsCountPerSeats={AdsCountPerSeats}
                AdsCountPersecondCondition={AdsCountPersecondCondition}
                Types={Types}
                AdsCountPerYear={AdsCountPerYear}
                AdsCountPerlanduse={AdsCountPerlanduse}
                AdsCountPerfloors={AdsCountPerfloors}
                AdsCountPerhouseclass={AdsCountPerhouseclass}
                AdsCountPerbedrooms={AdsCountPerbedrooms}
                AdsCountPerbathrooms={AdsCountPerbathrooms}
                AdsCountPerfurnishing={AdsCountPerfurnishing}
                AdsCountPeramenities={AdsCountPeramenities}
                AdsCountPertoilets={AdsCountPertoilets}
                AdsCountPerparking={AdsCountPerparking}
                AdsCountPerstatus={AdsCountPerstatus}
                AdsCountPerarea={AdsCountPerarea}
                AdsCountPerpropertysecurity={AdsCountPerpropertysecurity}
              />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-lg hidden">
            <SidebarSearch
              categoryList={categoryList}
              category={category}
              AdsCountPerSubcategory={AdsCountPerSubcategory}
              AdsCountPerRegion={AdsCountPerRegion}
              subcategory={subcategory}
              AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
              AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
              make={make}
              AdsCountPerColor={AdsCountPerColor}
              AdsCountPerTransmission={AdsCountPerTransmission}
              AdsCountPerFuel={AdsCountPerFuel}
              AdsCountPerCondition={AdsCountPerCondition}
              AdsCountPerCC={AdsCountPerCC}
              AdsCountPerExchange={AdsCountPerExchange}
              AdsCountPerBodyType={AdsCountPerBodyType}
              AdsCountPerRegistered={AdsCountPerRegistered}
              AdsCountPerSeats={AdsCountPerSeats}
              AdsCountPersecondCondition={AdsCountPersecondCondition}
              Types={Types}
              AdsCountPerYear={AdsCountPerYear}
              AdsCountPerlanduse={AdsCountPerlanduse}
              AdsCountPerfloors={AdsCountPerfloors}
              AdsCountPerhouseclass={AdsCountPerhouseclass}
              AdsCountPerbedrooms={AdsCountPerbedrooms}
              AdsCountPerbathrooms={AdsCountPerbathrooms}
              AdsCountPerfurnishing={AdsCountPerfurnishing}
              AdsCountPeramenities={AdsCountPeramenities}
              AdsCountPertoilets={AdsCountPertoilets}
              AdsCountPerparking={AdsCountPerparking}
              AdsCountPerstatus={AdsCountPerstatus}
              AdsCountPerarea={AdsCountPerarea}
              AdsCountPerpropertysecurity={AdsCountPerpropertysecurity}
            />
          </div>
          <div className="rounded-lg max-w-8xl mx-auto justify-center">
            <div className="rounded-lg w-full">
              <div className="font-bold hidden lg:inline text-lg text-emerald-950 text-center sm:text-left p-2">
                {subcategory ? <> {subcategory}</> : "All"}
              </div>
              <div className="lg:hidden">
                <section className="flex justify-between items-center gap-1 bg-white p-1 bg-white bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
                  <div className="flex w-full p-1">
                    <SubCategoryFilterSearch
                      category={category}
                      AdsCountPerSubcategory={AdsCountPerSubcategory}
                    />
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={togglePopup}
                          className="flex cursor-pointer text-sm bg-[#000000] hover:bg-emerald-600 text-white rounded-sm p-1 justify-between items-center"
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
                </section>
                {showPopup && (
                  <div className="bg-black bg-opacity-70 fixed top-0 left-0 w-full h-screen flex justify-center items-center z-50">
                    <div className="w-full flex flex-col h-[500px] m-1 rounded-lg w-full bg-white">
                      <div className="flex w-full items-center justify-between">
                        <div className="font-bold text-lg text-emerald-950 text-center sm:text-left p-2">
                          {subcategory ? <> {subcategory}</> : "All"}{" "}
                        </div>

                        <div onClick={togglePopup}>
                          <button className="bg-white mr-2">
                            <CloseIcon
                              className="bg-white"
                              sx={{ fontSize: 24 }}
                            />
                          </button>
                        </div>
                      </div>

                      <SidebarSearchmobile
                        categoryList={categoryList}
                        category={category}
                        AdsCountPerSubcategory={AdsCountPerSubcategory}
                        AdsCountPerRegion={AdsCountPerRegion}
                        subcategory={subcategory}
                        AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                        AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                        make={make}
                        AdsCountPerColor={AdsCountPerColor}
                        AdsCountPerTransmission={AdsCountPerTransmission}
                        AdsCountPerFuel={AdsCountPerFuel}
                        AdsCountPerCondition={AdsCountPerCondition}
                        AdsCountPerCC={AdsCountPerCC}
                        AdsCountPerExchange={AdsCountPerExchange}
                        AdsCountPerBodyType={AdsCountPerBodyType}
                        AdsCountPerRegistered={AdsCountPerRegistered}
                        AdsCountPerSeats={AdsCountPerSeats}
                        AdsCountPersecondCondition={AdsCountPersecondCondition}
                        Types={Types}
                        AdsCountPerYear={AdsCountPerYear}
                        AdsCountPerlanduse={AdsCountPerlanduse}
                        AdsCountPerfloors={AdsCountPerfloors}
                        AdsCountPerhouseclass={AdsCountPerhouseclass}
                        AdsCountPerbedrooms={AdsCountPerbedrooms}
                        AdsCountPerbathrooms={AdsCountPerbathrooms}
                        AdsCountPerfurnishing={AdsCountPerfurnishing}
                        AdsCountPeramenities={AdsCountPeramenities}
                        AdsCountPertoilets={AdsCountPertoilets}
                        AdsCountPerparking={AdsCountPerparking}
                        AdsCountPerstatus={AdsCountPerstatus}
                        AdsCountPerarea={AdsCountPerarea}
                        AdsCountPerpropertysecurity={
                          AdsCountPerpropertysecurity
                        }
                      />
                      <div className="text-sm mt-1 p-2">
                        <div className="w-full">
                          <div className="grid grid-cols-2 gap-1 mb-1">
                            <button
                              type="submit"
                              onClick={handleClear}
                              className="bg-[#000000] hover:bg-[#333333] flex gap-1 p-2 items-center text-sm rounded-sm text-white h-full"
                            >
                              <CloseIcon
                                className="text-white"
                                sx={{ fontSize: 24 }}
                              />
                              Reset Filter
                            </button>
                            <button
                              type="submit"
                              onClick={togglePopup}
                              className="bg-[#30AF5B] hover:bg-emerald-600 flex gap-1 p-2 items-center text-sm rounded-sm text-white h-full"
                            >
                              <SearchIcon /> Search
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/*  <Dialog open={isOpen}>
                <DialogTrigger asChild>
                  <div
                    onClick={() => openDialog()}
                    className="flex cursor-pointer text-sm bg-gray-100 rounded-sm p-1 justify-between items-center"
                  >
                    <SortOutlinedIcon />
                    Filter
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="font-bold text-lg text-emerald-950 text-center sm:text-left p-2">
                        {category}{" "}
                        {subcategory ? <> | {subcategory}</> : "| All"}{" "}
                      </div>
                    </DialogTitle>
                    <div className="w-full bg-white">
                      <div
                        onClick={closeDialog}
                        className="absolute top-2 right-2 z-30 bg-white"
                      >
                        <button className="bg-white">
                          <CloseIcon
                            className="bg-white"
                            sx={{ fontSize: 24 }}
                          />
                        </button>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="w-full flex flex-col">
                    <SidebarSearchmobile
                      categoryList={categoryList}
                      category={category}
                      AdsCountPerSubcategory={AdsCountPerSubcategory}
                      AdsCountPerRegion={AdsCountPerRegion}
                      subcategory={subcategory}
                      AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                      AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                      make={make}
                      AdsCountPerColor={AdsCountPerColor}
                      AdsCountPerTransmission={AdsCountPerTransmission}
                      AdsCountPerFuel={AdsCountPerFuel}
                      AdsCountPerCondition={AdsCountPerCondition}
                      AdsCountPerCC={AdsCountPerCC}
                      AdsCountPerExchange={AdsCountPerExchange}
                      AdsCountPerBodyType={AdsCountPerBodyType}
                      AdsCountPerRegistered={AdsCountPerRegistered}
                      AdsCountPerSeats={AdsCountPerSeats}
                      AdsCountPersecondCondition={AdsCountPersecondCondition}
                      Types={Types}
                      AdsCountPerYear={AdsCountPerYear}
                      AdsCountPerlanduse={AdsCountPerlanduse}
                      AdsCountPerfloors={AdsCountPerfloors}
                      AdsCountPerhouseclass={AdsCountPerhouseclass}
                      AdsCountPerbedrooms={AdsCountPerbedrooms}
                      AdsCountPerbathrooms={AdsCountPerbathrooms}
                      AdsCountPerfurnishing={AdsCountPerfurnishing}
                      AdsCountPeramenities={AdsCountPeramenities}
                      AdsCountPertoilets={AdsCountPertoilets}
                      AdsCountPerparking={AdsCountPerparking}
                      AdsCountPerstatus={AdsCountPerstatus}
                      AdsCountPerarea={AdsCountPerarea}
                      AdsCountPerpropertysecurity={AdsCountPerpropertysecurity}
                    />
                    <div className="text-sm mt-1 rounded-lg w-full bg-white p-2">
                      <div className="w-full p-2">
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            type="submit"
                            onClick={closeDialog}
                            className="bg-[#30AF5B] flex gap-1 items-center text-sm rounded-sm text-white h-full"
                          >
                            <SearchIcon /> Search
                          </button>

                          <button
                            type="submit"
                            onClick={handleClear}
                            className="bg-gray-400 flex gap-1 items-center text-sm rounded-sm text-white h-full"
                          >
                            <CloseIcon
                              className="text-white"
                              sx={{ fontSize: 24 }}
                            />{" "}
                            Reset Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>*/}
              </div>
            </div>
            <div className="flex items-center m-2 gap-1 justify-between">
              <Searchmain />
            </div>
            <section className="my-0">
              {/* This is a comment inside a JSX expression   

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <p className="">
                      <SortOutlinedIcon />
                      Filter
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full p-1">
                      <SidebarSearchmobile
                        categoryList={categoryList}
                        category={category}
                        AdsCountPerSubcategory={AdsCountPerSubcategory}
                        AdsCountPerRegion={AdsCountPerRegion}
                        subcategory={subcategory}
                        AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                        AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                        make={make}
                        AdsCountPerColor={AdsCountPerColor}
                        AdsCountPerTransmission={AdsCountPerTransmission}
                        AdsCountPerFuel={AdsCountPerFuel}
                        AdsCountPerCondition={AdsCountPerCondition}
                        AdsCountPerCC={AdsCountPerCC}
                        AdsCountPerExchange={AdsCountPerExchange}
                        AdsCountPerBodyType={AdsCountPerBodyType}
                        AdsCountPerRegistered={AdsCountPerRegistered}
                        AdsCountPerSeats={AdsCountPerSeats}
                        AdsCountPersecondCondition={AdsCountPersecondCondition}
                        Types={Types}
                        AdsCountPerYear={AdsCountPerYear}
                        AdsCountPerlanduse={AdsCountPerlanduse}
                        AdsCountPerfloors={AdsCountPerfloors}
                        AdsCountPerhouseclass={AdsCountPerhouseclass}
                        AdsCountPerbedrooms={AdsCountPerbedrooms}
                        AdsCountPerbathrooms={AdsCountPerbathrooms}
                        AdsCountPerfurnishing={AdsCountPerfurnishing}
                        AdsCountPeramenities={AdsCountPeramenities}
                        AdsCountPertoilets={AdsCountPertoilets}
                        AdsCountPerparking={AdsCountPerparking}
                        AdsCountPerstatus={AdsCountPerstatus}
                        AdsCountPerarea={AdsCountPerarea}
                        AdsCountPerpropertysecurity={
                          AdsCountPerpropertysecurity
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>*/}

              <div className="hidden lg:inline">
                <div className="w-full bg-white flex flex-col rounded-lg p-2">
                  <div className="flex items-center gap-1 m-1 justify-end">
                    <button
                      onClick={handleClear}
                      className="p-1 text-xs text-white bg-emerald-700 rounded-sm flex hover:bg-[#30AF5B] items-center gap-1 hover:cursor-pointer"
                    >
                      <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                      Reset Filter
                    </button>
                  </div>
                  {subcategory === "Cars, Vans & Pickups" && (
                    <>
                      <div className="grid grid-cols-4 lg:grid-cols-7 justify-between gap-1 m-0">
                        <div
                          onClick={() => handlePrice(1, "0", "500000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                            activerange === 1
                              ? "bg-[#30AF5B] text-white"
                              : "bg-[#ebf2f7] hover:bg-emerald-100"
                          }`}
                        >
                          0-500K
                        </div>

                        <div
                          onClick={() => handlePrice(2, "500000", "1000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                            activerange === 2
                              ? "bg-[#30AF5B] text-white"
                              : "bg-[#ebf2f7] hover:bg-emerald-100"
                          }`}
                        >
                          {"500K-1M"}
                        </div>

                        <div
                          onClick={() => handlePrice(3, "1000000", "2000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                            activerange === 3
                              ? "bg-[#30AF5B] text-white"
                              : "bg-[#ebf2f7] hover:bg-emerald-100"
                          }`}
                        >
                          {"1M-2M"}
                        </div>
                        <div
                          onClick={() => handlePrice(4, "2000000", "3000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                            activerange === 4
                              ? "bg-[#30AF5B] text-white"
                              : "bg-[#ebf2f7] hover:bg-emerald-100"
                          }`}
                        >
                          {"2M-3M"}
                        </div>
                        <div
                          onClick={() => handlePrice(5, "3000000", "5000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                            activerange === 5
                              ? "bg-[#30AF5B] text-white"
                              : "bg-[#ebf2f7] hover:bg-emerald-100"
                          }`}
                        >
                          {"3M-5M"}
                        </div>
                        <div
                          onClick={() => handlePrice(6, "5000000", "10000000")}
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                            activerange === 6
                              ? "bg-[#30AF5B] text-white"
                              : "bg-[#ebf2f7] hover:bg-emerald-100"
                          }`}
                        >
                          {"5M-10M"}
                        </div>
                        <div
                          onClick={() =>
                            handlePrice(7, "10000000", "9999999999")
                          }
                          className={`text-sm rounded-sm p-2 justify-center cursor-pointer ${
                            activerange === 7
                              ? "bg-[#30AF5B] text-white"
                              : "bg-[#ebf2f7] hover:bg-emerald-100"
                          }`}
                        >
                          {"Above 10M"}
                        </div>
                      </div>
                      <Menumake category={category} subcategory={subcategory} />
                    </>
                  )}
                  {subcategory === "Buses & Microbuses" && (
                    <>
                      <Menumake category={category} subcategory={subcategory} />
                    </>
                  )}
                  {subcategory === "Trucks & Trailers" && (
                    <>
                      <MenumakeBus
                        category={category}
                        subcategory={subcategory}
                      />
                    </>
                  )}
                  {subcategory === "Motorbikes,Tuktuks & Scooters" && (
                    <>
                      <MenumakeMotobikes
                        category={category}
                        subcategory={subcategory}
                      />
                    </>
                  )}
                  {subcategory === "Heavy Equipment" && (
                    <>
                      <MenuequipType
                        category={category}
                        subcategory={subcategory}
                      />
                    </>
                  )}
                  {subcategory === "Watercraft & Boats" && (
                    <>
                      <MenuBoats
                        category={category}
                        subcategory={subcategory}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex w-full justify-between">
                <div className="flex gap-1 flex-wrap justify-start items-center mb-4 ">
                  <div
                    className={`cursor-pointer ${
                      activeButton === 0 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(0)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ViewModuleIcon />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Grid layout</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div
                    className={`cursor-pointer ${
                      activeButton === 1 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(1)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ViewListIcon />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>List layout</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div
                    className={`cursor-pointer ${
                      activeButton === 2 ? "text-[#30AF5B]" : "text-gray-400"
                    }`}
                    onClick={() => handleButtonClick(2)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ShareLocationOutlinedIcon />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on Map</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="rounded-lg p-1 z-5 flex items-center">
                  <div className="text-[#30AF5B]">
                    <SwapVertIcon />
                  </div>
                  <Select onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="z-20">
                      <SelectGroup>
                        <SelectItem value="recommeded">
                          Recommended first
                        </SelectItem>
                        <SelectItem value="nearby">NearBy first</SelectItem>
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
              <CollectionSearch
                //  data={adsData}
                emptyTitle="No ads have been created yet"
                emptyStateSubtext="Go create some now"
                // collectionType="Ads_Organized"
                limit={20}
                Type={Type}
                urlParamName="adsPage"
                userId={userId}
                activeButton={activeButton}
                searchText={searchText}
                sortby={sortby}
                category={category}
                subcategory={subcategory}
                make={make}
                makeselected={makeselected}
                vehiclemodel={vehiclemodel}
                yearfrom={yearfrom}
                yearto={yearto}
                vehiclecolor={vehiclecolor}
                vehiclecondition={vehiclecondition}
                vehicleTransmissions={vehicleTransmissions}
                longitude={longitude}
                latitude={latitude}
                region={region}
                membership={membership}
                vehicleFuelTypes={vehicleFuelTypes}
                vehicleEngineSizesCC={vehicleEngineSizesCC}
                vehicleexchangeposible={vehicleexchangeposible}
                vehicleBodyTypes={vehicleBodyTypes}
                vehicleregistered={vehicleregistered}
                vehicleSeats={vehicleSeats}
                vehiclesecordCondition={vehiclesecordCondition}
                vehicleyear={vehicleyear}
                Price={Price}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                furnishing={furnishing}
                amenities={amenities}
                toilets={toilets}
                parking={parking}
                status={status}
                area={area}
                landuse={landuse}
                propertysecurity={propertysecurity}
                floors={floors}
                estatename={estatename}
                houseclass={houseclass}
              />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCategory;
