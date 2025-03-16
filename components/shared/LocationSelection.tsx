import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import React from "react";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { REGIONS_WITH_AREA } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, formUrlQuerymultiple, removeKeysFromQuery } from "@/lib/utils";

interface Props {
  onClose: () => void;
  onSelected: (value: string) => void;
  handleFilter: (value:any) => void;
  AdsCountPerRegion:any;
}

const LocationSelection = ({onClose, onSelected, handleFilter, AdsCountPerRegion}:Props) => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchArea, setSearchArea] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const sortedLocations = REGIONS_WITH_AREA
  .filter((loc) => loc.region.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => a.region.localeCompare(b.region));

  const filteredLocations = sortedLocations
  .find((loc: any) => loc.region === selectedLocation)
  ?.area.filter((location: any) =>
    location.toLowerCase().includes(searchArea.toLowerCase())
  )
  .sort((a: string, b: string) => a.localeCompare(b)) || [];

  const totalAdCount = AdsCountPerRegion.reduce((sum: any, item: any) => {
    return sum + item.adCount;
  }, 0);


// Group locations by their first letter
let lastLetter = "";

 const handleRegionClick = (region: any) => {
    // Update the selected region state
 
   // let newUrl = "";
    if (region) {
      handleFilter({
        region: region.toString(),
        area: '',
      })
     // newUrl = formUrlQuerymultiple({
      //  params: searchParams.toString(),
      //  updates: {
       //   region: region.toString(),
        //  area: "",
       // },
      //});
    } 
    //else {
    //  newUrl = removeKeysFromQuery({
     //   params: searchParams.toString(),
      //  keysToRemove: ["region"],
      //});
    //}
    //router.push(newUrl, { scroll: false });
    // Perform any other actions you need
  };

  const handleAreaClick = (region: any,area: any) => {
    // Update the selected region state
    if (region && area) {
    handleFilter({
      region: region.toString(),
      area: area.toString(),
    });
  }
 
  };

  const handleClear = () => {
    // Update the selected region state
    handleFilter({
      region: '',
      area: '',
    });
 
  };


  return (
    <div className="relatives w-full">
      <div className="absolute h-full bg-gray-200 dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full max-w-full p-5">
        {/* Search Bar */}
        <div className="flex justify-end items-center mb-1">
                            <button
                              onClick={onClose}
                              className="flex justify-center items-center h-12 w-12 text-black dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-black hover:text-white rounded-full"
                            >
                              <CloseOutlinedIcon />
                            </button>
                          </div>


                          <div className="flex justify-between items-center mb-1">
                            <div onClick={()=> {onSelected("All Kenya");  handleClear(); onClose();}} className="flex hover:text-green-600 cursor-pointer gap-1 items-center">
                            <span className="font-bold">All Kenya</span>
              <span>.</span>
              <span className="text-gray-500">{totalAdCount} ads</span>
                            </div>
        <div className="flex items-center border-b pb-2">
          <input
            type="text"
            placeholder="Find state, city or district..."
            className="dark:bg-[#222528] dark:text-gray-300 w-full px-3 py-2 border dark:border-gray-600 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        </div>
        {/* Scrollable Location List */}
        <div className="mt-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    <ul className="cursor-pointer p-2">
      {sortedLocations.map((location:any,index:number) => {
        const firstLetter = location.region.charAt(0).toUpperCase();
        const showLetterHeader = firstLetter !== lastLetter;
        lastLetter = firstLetter;

        return (
          <React.Fragment key={index} >
            {showLetterHeader && (
              <li className="font-bold text-lg text-gray-700 dark:text-gray-300 border-b p-2 rounded-0">
                {firstLetter}
              </li>
            )}
            <li
              className={`flex items-center dark:bg-[#222528] bg-white gap-2 p-2 text-sm cursor-pointer rounded-0 ${
                selectedLocation === location.region
                  ? "bg-green-100 text-green-600"
                  : "hover:text-green-600"
              }`}
              onClick={() => setSelectedLocation(location.region)}
            >
              <span>{location.region}</span>
              <span>.</span>
              <span className="text-gray-500">{(AdsCountPerRegion &&
  AdsCountPerRegion.filter(
    (item: { region: string; adCount: number }) => item.region === location.region
  ).reduce((sum:any, item:any) => sum + item.adCount, 0)) ?? 0} ads</span>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  </div>
      </div>
      {selectedLocation && (
         <div className="absolute h-full bg-gray-200 dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full max-w-full p-5">
         {/* Search Bar */}
         <div className="flex justify-start items-center mb-1">
                             <button
                               onClick={() => {setSearchArea(""); setSelectedLocation("");}}
                               className="flex justify-center items-center bg-white text-black dark:bg-black text-sm px-2 py-1 dark:text-gray-200 dark:hover:text-green-600 hover:text-green-600  rounded-full"
                             >
                               <ArrowBackIosNewOutlinedIcon sx={{ fontSize: 16 }}/> Back
                             </button>
                           </div>
 
 
                           <div className="flex justify-between items-center mb-1">
                             <div onClick={()=> {onSelected(selectedLocation);handleRegionClick(selectedLocation); onClose();}} className="flex hover:text-green-600 cursor-pointer gap-1 items-center">
                             <span className="font-bold">All {selectedLocation}</span>
               <span>.</span>
               <span className="text-gray-500">{(AdsCountPerRegion &&
  AdsCountPerRegion.filter(
    (item: { region: string; adCount: number }) => item.region === selectedLocation
  ).reduce((sum:any, item:any) => sum + item.adCount, 0)) ?? 0} ads</span>
                             </div>
         <div className="flex items-center border-b pb-2">
           <input
             type="text"
             placeholder="Find state, city or district..."
             className="dark:bg-[#222528] dark:text-gray-300 w-full px-3 py-2 border dark:border-gray-600 rounded-md"
             value={searchArea}
             onChange={(e) => setSearchArea(e.target.value)}
           />
         </div>
         </div>
         {/* Scrollable Location List */}
         <div className="mt-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
     <ul className="cursor-pointer p-2">
     
       {filteredLocations.map((location: string, index:number) => {
         
         const firstLetter = location.charAt(0).toUpperCase();
         const showLetterHeader = firstLetter !== lastLetter;
         lastLetter = firstLetter;
 
         return (
           <React.Fragment key={index} >
             {showLetterHeader && (
               <li className="font-bold text-lg text-gray-700 dark:text-gray-300 border-b p-2 rounded-0">
                 {firstLetter}
               </li>
             )}
             <li
               className={`flex items-center dark:bg-[#222528] bg-white mb-0 gap-2 p-2 text-sm cursor-pointer rounded-0 ${
                 selectedArea === location
                   ? "bg-green-100 text-green-600"
                   : "hover:text-green-600"
               }`}
               onClick={() => {setSelectedArea(location);
                onSelected(location);
                handleAreaClick(selectedLocation,location);
                onClose();}}
             >
               <span>{location}</span>
               <span>.</span>
               <span className="text-gray-500">{(AdsCountPerRegion &&
   AdsCountPerRegion.filter(
     (item: { area: string; adCount: number }) => item.area === location
   ).reduce((sum:any, item:any) => sum + item.adCount, 0)) ?? 0} ads</span>
             </li>
           </React.Fragment>
         );
       })}
     </ul>
   </div>
       </div>
      )}
      </div>
  );
};

export default LocationSelection;
