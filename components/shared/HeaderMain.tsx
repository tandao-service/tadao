"use client";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Searchmain from "./Searchmain";
import SearchNow from "./SearchNow";
import LocationSelection from "./LocationSelection";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
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
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
export default function HeaderMain({ handleFilter, handleOpenSearchByTitle, AdsCountPerRegion }: { handleOpenSearchByTitle: () => void, handleFilter: (value: any) => void, AdsCountPerRegion: any }) {
  const [region, setRegion] = useState("All Kenya");
  // Function to handle changes in the search input

  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleRegion = (value: string) => {
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
              className="flex text-xs lg:text-base gap-1 items-center justify-center w-full py-4 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-sm hover:bg-gray-200"
            >
              <div className="hidden lg:inline">
                <LocationOnIcon />
              </div>
              <div className="lg:hidden">
                <LocationOnIcon sx={{ fontSize: 20 }} />
              </div>
              {region}
            </button>
          </div>
          <div className="flex-1 hidden lg:inline">
            <SearchNow handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle} />
          </div>


        </div>

        {/* Left Side */}
        {showPopup && (

          <LocationSelection
            onSelected={handleRegion}
            AdsCountPerRegion={AdsCountPerRegion}
            onClose={handleClosePopup}
            handleFilter={handleFilter}
          />

        )}
      </div>
      <div className="flex-1 mt-2 lg:hidden">
        <SearchNow handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle} />
      </div>

    </div>
  );
}
