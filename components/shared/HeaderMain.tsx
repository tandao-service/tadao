"use client";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Searchmain from "./Searchmain";
import SearchNow from "./SearchNow";
import LocationSelection from "./LocationSelection";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PropertyMap from "./PropertyMap";
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import MapSearch from "./MapSearch";
import PropertyMapSearch from "./PropertyMapSearch";
export default function HeaderMain({ handleFilter ,handleCategory, handleOpenPlan, handleOpenSell, handleAdView, handleAdEdit, AdsCountPerRegion,queryObject }: { handleOpenPlan:() => void, handleOpenSell:() => void, handleFilter: (value:any) => void, AdsCountPerRegion:any,queryObject:any , handleAdEdit: (id:string) => void, handleCategory: (value:string) => void,
  handleAdView: (id:string) => void}) {
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const [region, setRegion] = useState("All Kenya");
  // Function to handle changes in the search input
  const handleSearchChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    setSearch(value);
  };
 const [showPopup, setShowPopup] = useState(false);
 const [showPopupMap, setShowPopupMap] = useState(false);
 

 const handleOpenPopupMap = () => {
   setShowPopupMap(true);
 };

 const handleClosePopupMap = () => {
   setShowPopupMap(false);
 };
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleRegion = (value:string) => {
    setRegion(value);
  };
  return (
    <div
      className="relative flex flex-col w-full"
     
    >
        <div className="flex gap-1 items-center w-full">
        <div className="flex gap-1 items-center w-full">
        <div className="flex">
        <button
        onClick={handleOpenPopup}
        className="flex gap-1 items-center justify-center w-full py-4 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-sm hover:bg-gray-200"
        >
        <LocationOnIcon /> {region}
        </button>
        </div>
        <div className="flex-1 hidden lg:inline">
        <SearchNow handleFilter={handleFilter} />
        </div>

 


                <div className="flex-1 lg:hidden">
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenPopupMap}
                    className="flex gap-2 text-gray-700 items-center justify-center w-full py-2 px-2 border-gray-300 border rounded-sm hover:bg-gray-200"
                  >
                   {/*  🗺️ */}
                   
                    <Image
                                   src={"/assets/icons/map-pointer.png"}
                                   alt="icon"
                                   className="rounded-full object-cover"
                                   width={40}
                                   height={40}
                                 />
                    <div className="flex gap-1 items-center">Virtual Tour of Property Location <ArrowForwardIosIcon sx={{ fontSize: 14 }}/></div>
                  </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explore the property&apos;s location through a virtual interactive tour.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
                  
                </div>


                <div className="flex hidden lg:inline">
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenPopupMap}
                    className="flex gap-2 text-gray-700 items-center justify-center w-full py-2 px-2 border-gray-300 border rounded-sm hover:bg-gray-200"
                  >
                   {/*  🗺️ */}
                   
                    <Image
                                   src={"/assets/icons/map-pointer.png"}
                                   alt="icon"
                                   className="rounded-full object-cover"
                                   width={40}
                                   height={40}
                                 />
                    <div className="flex gap-1 items-center">Virtual Tour of Property Location <ArrowForwardIosIcon sx={{ fontSize: 14 }}/></div>
                  </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explore the property&apos;s location through a virtual interactive tour.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
                  
                </div>


        </div>


      


        {showPopupMap && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 z-50">
                      <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-200 p-2 w-full items-center justify-center relative">
             
                        <div className="flex flex-col items-center justify-center dark:bg-[#2D3236] bg-gray-200">
                    
<PropertyMap queryObject={queryObject} handleOpenSell={handleOpenSell} handleOpenPlan={handleOpenPlan} onClose={handleClosePopupMap} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleCategory={handleCategory}/>
                        </div>
                        
                      </div>
                    </div>
                     
                  )}
      {/* Left Side */}
      {showPopup && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                        <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-0 w-full  lg:max-w-3xl rounded-md shadow-md relative">
                          
                          <LocationSelection
                           onSelected={handleRegion}
                           AdsCountPerRegion={AdsCountPerRegion}
                           onClose={handleClosePopup}
                           handleFilter={handleFilter}
                          />
                        </div>
                      </div>
                    )}
                    </div>
                     <div className="flex-1 mt-2 lg:hidden">
        <SearchNow handleFilter={handleFilter} />
        </div>

    </div>
  );
}
