import { ICategory } from "@/lib/database/models/category.model";
import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  formUrlQuerymultiple,
  formUrlQuery,
  removeKeysFromQuery,
} from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SignalWifiStatusbarNullOutlinedIcon from "@mui/icons-material/SignalWifiStatusbarNullOutlined";
import { Label } from "@/components/ui/label";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import CategoryFilterSearch from "./CategoryFilterSearch";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import InvertColorsOutlinedIcon from "@mui/icons-material/InvertColorsOutlined";
import FormatPaintOutlinedIcon from "@mui/icons-material/FormatPaintOutlined";
import FormatStrikethroughOutlinedIcon from "@mui/icons-material/FormatStrikethroughOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import AirlineSeatReclineExtraOutlinedIcon from "@mui/icons-material/AirlineSeatReclineExtraOutlined";
import SignalWifiStatusbarConnectedNoInternet4OutlinedIcon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4Outlined";
import Image from "next/image";
import FilterComponent from "./FilterComponent";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
type sidebarProps = {
  category: string;
  categoryList?: any;
  subcategory?: string;
  AdsCountPerRegion?: any;
  AdsCountPerVerifiedTrue?: any;
  AdsCountPerVerifiedFalse?: any;
  adsCount?: any;
  onLoading: () => void;
  handleFilter:(value:any) => void;
};
const SidebarSearchMain = ({
  category,
  categoryList,
  subcategory,
  AdsCountPerRegion,
  AdsCountPerVerifiedTrue,
  AdsCountPerVerifiedFalse,
  adsCount,
  onLoading,
  handleFilter,
}: sidebarProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalVerifiedAll, settotalVerifiedAll] = useState(0);
  const [totalRegion, settotalRegion] = useState(0);
  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Kenya");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");

  useEffect(() => {
    try {
      setQuery(subcategory || "");
      const totalAdCountRegion = AdsCountPerRegion.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const adCount = parseInt(current.adCount);
          return !isNaN(adCount) ? total + adCount : total;
        },
        0
      );

      settotalRegion(totalAdCountRegion); // Output: 0

      const totalAdCountVerified = AdsCountPerVerifiedTrue.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const totalAds = parseInt(current.totalAds);
          return !isNaN(totalAds) ? total + totalAds : total;
        },
        0
      );

      const totalAdCountVerifiedFalse = AdsCountPerVerifiedFalse.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const totalAds = parseInt(current.totalAds);
          return !isNaN(totalAds) ? total + totalAds : total;
        },
        0
      );

      settotalVerifiedAll(totalAdCountVerifiedFalse + totalAdCountVerified); // Output: 0
    } catch (error) {
      console.error("Error fetching data:", error);
      // setHasError(true);
    } finally {
      // setIsLoading(false);
    }
  }, [AdsCountPerRegion, AdsCountPerVerifiedTrue, AdsCountPerVerifiedFalse]);

  // Usage
  const handleQuery = (index: number, query: string) => {

    handleFilter({
          category: category.toString(),
           subcategory: query.toString(),
        });
        setQuery(query);
  };

  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };
  const groupedData = AdsCountPerRegion.reduce((acc: any, curr: any) => {
    const existingRegion = acc.find((item: any) => item.region === curr.region);

    if (existingRegion) {
      existingRegion.adCount += curr.adCount;
      existingRegion.areas.push({ area: curr.area, adCount: curr.adCount });
    } else {
      acc.push({
        region: curr.region,
        adCount: curr.adCount,
        areas: [{ area: curr.area, adCount: curr.adCount }],
      });
    }

    return acc;
  }, []);

 

  const formatToCurrency = (value: string | number) => {
    if (!value) return "0";
    const numberValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };
  const selectedCategory = categoryList.find(
    (cat: any) => cat.category.name === category
  );
  const totalAdCount = categoryList.reduce((sum: any, item: any) => {
    if (item.category.name === category) {
      return sum + item.adCount;
    }
    return sum;
  }, 0);

  //const totalAdCount = selectedCategory ? selectedCategory.adCount : 0;
  const categoryImageUrl = selectedCategory
    ? selectedCategory.category.imageUrl[0]
    : "";
 
  const filteredList =
    categoryList?.filter((cat: any) => cat.category.name === category) || [];

 // const visibleItems = showAll ? filteredList : filteredList.slice(0, 6);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        
        <div className="w-full p-0 dark:bg-[#2D3236] bg-white rounded-lg">
         {/* <div className="flex flex-col bg-[#064E3B] font-bold text-white items-center rounded-t-lg w-full p-1">
            CATEGORY
          </div> */}
          <div className="flex flex-col p-1 text-sm font-bold rounded-t-lg w-full">
            <div className="flex w-full justify-between p-1 text-lg gap-1 items-center mt-1 mb-1 border-b border-gray-300 dark:border-gray-600">
              {selectedCategory && (
                <>
                  {" "}
                  <div className="flex gap-1 items-center">
                    <div className="rounded-full dark:bg-[#131B1E] bg-white p-1">
                      <Image
                        className="h-7 w-8 object-cover"
                        src={categoryImageUrl}
                        alt={
                          selectedCategory ? selectedCategory.category.name : ""
                        }
                        width={60}
                        height={60}
                      />
                    </div>
                    {selectedCategory ? selectedCategory.category.name : ""}
                  </div>
                </>
              )}

              <div className="flex gap-1 items-center">
                <div className="text-sm dark:text-gray-500 text-gray-700">
                  {totalAdCount} ads
                </div>
              </div>
            </div>
          </div>
          <div className="ml-3">
            
            {filteredList.map((sub: any, index: number) => (
              <div
                key={index}
                onClick={() => handleQuery(index, sub.subcategory)}
                className={`border-b rounded-sm dark:border-gray-600 flex items-center w-full justify-between p-0 mb-0 text-sm cursor-pointer dark:hover:bg-[#131B1E] dark:hover:text-white hover:bg-emerald-100 hover:text-emerald-600 ${
                  query === sub.subcategory
                    ? "bg-green-600 text-white hover:bg-green-600 hover:text-white "
                    : "dark:bg-[#2D3236] bg-white"
                }`}
              >
                <div className="flex w-full gap-1 items-center p-1">
                  <Image
                    className="h-6 w-7 object-cover"
                    src={sub.imageUrl[0] || ""}
                    alt={sub.subcategory}
                    width={60}
                    height={60}
                  />
                  <div className="flex text-sm flex-col">
                    {sub.subcategory}
                    <div
                      className={`flex text-xs gap-1 ${
                        query === sub.subcategory
                          ? "dark:text-gray-300 text-white"
                          : "dark:text-gray-500 text-gray-500"
                      }`}
                    >
                      {sub.adCount}
                      <div>ads</div>
                    </div>
                  </div>
                </div>
              {/* <ArrowForwardIosIcon sx={{ fontSize: 14 }} /> */} 
              </div>
            ))}

         
          </div>
        </div>
      
  {/*
        <div className="border dark:bg-[#2D3236] dark:text-gray-300 text-sm mt-2 rounded-lg w-full bg-white p-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger>
                <div className="flex gap-1 items-center font-bold">
                  <CreditScoreOutlinedIcon sx={{ fontSize: 16 }} />
                  Price
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="flex grid grid-cols-2  gap-1 justify-between">
                    <div className="w-full text-sm px-0 py-2">
                      <TextField
                        value={formatToCurrency(minPrice ?? 0)}
                        label="Min Price*"
                        className="w-full text-sm"
                        onChange={(e) => setminPrice(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          classes: {
                            root: "dark:bg-[#131B1E] dark:text-gray-100",
                            notchedOutline:
                              "border-gray-300 dark:border-gray-600",
                            focused: "",
                          },
                        }}
                        InputLabelProps={{
                          classes: {
                            root: "text-gray-500 dark:text-gray-400",
                            focused: "text-green-500 dark:text-green-400",
                          },
                        }}
                      />
                    </div>

                    <div className="w-full px-0 py-2">
                      <TextField
                        value={formatToCurrency(maxPrice ?? 0)}
                        label="Max Price*"
                        className="w-full text-sm"
                        onChange={(e) => setmaxPrice(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          classes: {
                            root: "dark:bg-[#131B1E] dark:text-gray-100",
                            notchedOutline:
                              "border-gray-300 dark:border-gray-600",
                            focused: "",
                          },
                        }}
                        InputLabelProps={{
                          classes: {
                            root: "text-gray-500 dark:text-gray-400",
                            focused: "text-green-500 dark:text-green-400",
                          },
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <button
                        type="submit"
                        onClick={() => onSelectPriceClear()}
                        className="bg-gray-600 w-full p-1 text-xs rounded-sm text-white h-full"
                      >
                        <CloseIcon
                          className="text-white"
                          sx={{ fontSize: 24 }}
                        />
                        Clear Price
                      </button>
                    </div>
                    <div className="w-full">
                      <button
                        type="submit"
                        onClick={() => handlebutton()}
                        className="bg-emerald-700 w-full p-1 text-xs rounded-sm text-white h-full"
                      >
                        <SearchIcon /> Search Price
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="border dark:bg-[#2D3236] dark:text-gray-300 text-sm mt-2 rounded-lg w-full bg-white p-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger>
                <div className="flex gap-1 items-center font-bold no-underline">
                  <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                  Verified sellers
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="w-full text-xs">
                    <div className="flex w-full gap-2 p-1">
                      <input
                        className="cursor-pointer"
                        type="radio"
                        value="all"
                        checked={selectedOption === "all"}
                        onChange={handleChange}
                      />
                      <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                        Show All
                        <div className="dark:text-gray-400 text-emerald-600 flex gap-1">
                          {totalVerifiedAll}
                          <div>ads</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full gap-2 p-1">
                      <input
                        className="cursor-pointer"
                        type="radio"
                        value="verified"
                        checked={selectedOption === "verified"}
                        onChange={handleChange}
                      />
                      <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                        Verified sellers
                        <div className="dark:text-gray-400 flex text-xs gap-1 text-emerald-600">
                          {AdsCountPerVerifiedTrue.length > 0
                            ? AdsCountPerVerifiedTrue[0].totalAds
                            : 0}
                          <div>ads</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full gap-2 p-1">
                      <input
                        className="cursor-pointer"
                        type="radio"
                        value="unverified"
                        checked={selectedOption === "unverified"}
                        onChange={handleChange}
                      />
                      <div className="flex w-full justify-between gap-1 items-center mt-1 mb-1">
                        Unverified sellers
                        <div className="dark:text-gray-400 flex text-xs gap-1 text-emerald-600">
                          {AdsCountPerVerifiedFalse.length > 0
                            ? AdsCountPerVerifiedFalse[0].totalAds
                            : 0}
                          <div>ads</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {subcategory && (
          <>
            <div className="border dark:bg-[#2D3236] dark:text-gray-300 text-sm mt-2 bg-white rounded-lg w-full p-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger>
                    <div className="flex gap-1 items-center font-bold">
                      <TuneOutlinedIcon sx={{ fontSize: 16 }} />
                      Advanced Filter
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FilterComponent
                      category={category}
                      subcategory={subcategory || ""}
                      allsubcategory={categoryList}
                      adsCount={adsCount}
                      onLoading={onLoading}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}*/} 
      </div>
    </>
  );
};

export default SidebarSearchMain;
