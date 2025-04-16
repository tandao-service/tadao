"use client";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Searchmain from "./Searchmain";
import SearchNow from "./SearchNow";
import LocationSelection from "./LocationSelection";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
export default function Header({ handleFilter,handleOpenSearchByTitle, AdsCountPerRegion }: {  handleOpenSearchByTitle: () => void, handleFilter: (value:any) => void, AdsCountPerRegion:any}) {
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const [region, setRegion] = useState("All Kenya");
  // Function to handle changes in the search input
  const handleSearchChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    setSearch(value);
  };
 const [showPopup, setShowPopup] = useState(false);

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
      className="relative flex max-w-6xl mx-auto"
    >
      <div className="lg:mb-10 mx-auto md:my-auto py-2 lg:py-10 md:py-0 w-[90%] md:w-[40%] text-center">
       <div className="mt-[60px] lg:mt-10">
          <div className="mb-5 text-white">
          What are you looking for?
          </div>
        </div>
        <div className="flex gap-1 items-center">
        <div className="flex">
        <button
        onClick={handleOpenPopup}
        className="flex gap-1 items-center justify-center w-full py-4 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-sm hover:bg-gray-200"
        >
        <LocationOnIcon /> {region}
        </button>
        </div>
        <div className="flex-1">
         <SearchNow handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle}/>
        </div>
        </div>
      </div>
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
  );
}
