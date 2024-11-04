import { IAd } from "@/lib/database/models/ad.model";
import React, { useEffect, useRef, useState } from "react";
import Pagination from "./Pagination";
import VerticalCard from "./VerticalCard";
import HorizontalCard from "./HorizontalCard";
import Skeleton from "@mui/material/Skeleton";
import StreetmapAll from "./StreetmapAll";
import Image from "next/image";
import { getAllAd, getListingsNearLocation } from "@/lib/actions/ad.actions";
type CollectionProps = {
  userId: string;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  Type: string;
  urlParamName?: string;
  activeButton: number;
  searchText: string;
  sortby: string;
  category: string;
  subcategory: string;
  make: string;
  makeselected: string;
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

const CollectionSearch = ({
  userId,
  emptyTitle,
  emptyStateSubtext,
  Type,
  limit,
  urlParamName,
  activeButton,
  searchText,
  sortby,
  category,
  subcategory,
  make,
  makeselected,
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
}: CollectionProps) => {
  const [data, setAds] = useState<IAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newpage, setnewpage] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  let Ads: any = [];
  const fetchAds = async () => {
    setLoading(true);
    try {
      if (sortby === "nearby" && longitude && latitude) {
        // console.log("nearby");

        Ads = await getListingsNearLocation({
          query: searchText,
          sortby: sortby,
          category,
          subcategory,
          make: makeselected,
          vehiclemodel: vehiclemodel,
          yearfrom: yearfrom,
          yearto: yearto,
          vehiclecolor: vehiclecolor,
          vehiclecondition: vehiclecondition,
          longitude: longitude,
          latitude: latitude,
          address: region,
          membership: membership,
          vehicleTransmissions: vehicleTransmissions,
          vehicleFuelTypes: vehicleFuelTypes,
          vehicleEngineSizesCC: vehicleEngineSizesCC,
          vehicleexchangeposible: vehicleexchangeposible,
          vehicleBodyTypes: vehicleBodyTypes,
          vehicleregistered: vehicleregistered,
          vehicleSeats: vehicleSeats,
          vehiclesecordCondition: vehiclesecordCondition,
          vehicleyear: vehicleyear,
          Types: Type,
          Price: Price,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          furnishing: furnishing,
          amenities: amenities,
          toilets: toilets,
          parking: parking,
          status: status,
          area: area,
          landuse: landuse,
          propertysecurity: propertysecurity,
          floors: floors,
          estatename: estatename,
          houseclass: houseclass,
          page,
          limit,
        });
        // console.log(Ads);
      } else {
        //  console.log(sortby);

        Ads = await getAllAd({
          query: searchText,
          sortby: sortby,
          category,
          subcategory,
          make: makeselected,
          vehiclemodel: vehiclemodel,
          yearfrom: yearfrom,
          yearto: yearto,
          vehiclecolor: vehiclecolor,
          vehiclecondition: vehiclecondition,
          longitude: longitude,
          latitude: latitude,
          address: region,
          membership: membership,
          vehicleTransmissions: vehicleTransmissions,
          vehicleFuelTypes: vehicleFuelTypes,
          vehicleEngineSizesCC: vehicleEngineSizesCC,
          vehicleexchangeposible: vehicleexchangeposible,
          vehicleBodyTypes: vehicleBodyTypes,
          vehicleregistered: vehicleregistered,
          vehicleSeats: vehicleSeats,
          vehiclesecordCondition: vehiclesecordCondition,
          vehicleyear: vehicleyear,
          Types: Type,
          Price: Price,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          furnishing: furnishing,
          amenities: amenities,
          toilets: toilets,
          parking: parking,
          status: status,
          area: area,
          landuse: landuse,
          propertysecurity: propertysecurity,
          floors: floors,
          estatename: estatename,
          houseclass: houseclass,
          page,
          limit,
        });
        // console.log(Ads);
      }

      // Update ads state using the latest prevAds for filtering

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
    }
  };

  useEffect(() => {
    if (!newpage) {
      setPage(1);
    }
    fetchAds();
  }, [
    page,
    searchText,
    sortby,
    category,
    subcategory,
    make,
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
  ]);

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

  return (
    <>
      {data.length > 0 ? (
        <>
          {activeButton === 0 && (
            <>
              <div className="flex flex-col items-center gap-10 p-1 bg-[#ebf2f7] rounded-lg p-1">
                <ul className="grid w-full grid-cols-2 gap-1 lg:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:gap-3">
                  {data.map((ad: any, index: number) => {
                    const isAdCreator = userId === ad.organizer._id.toString();
                    if (data.length === index + 1) {
                      return (
                        <div
                          ref={lastAdRef}
                          key={ad._id}
                          className="flex justify-center"
                        >
                          {/* Render Ad */}
                          <VerticalCard
                            ad={ad}
                            userId={userId}
                            isAdCreator={isAdCreator}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={ad._id} className="flex justify-center">
                          {/* Render Ad */}
                          <VerticalCard
                            ad={ad}
                            userId={userId}
                            isAdCreator={isAdCreator}
                          />
                        </div>
                      );
                    }
                  })}
                </ul>
              </div>
            </>
          )}
          {activeButton === 1 && (
            <>
              <div className="flex p-1 bg-[#ebf2f7] rounded-lg">
                <ul className="w-full">
                  {data.map((ad: any, index: number) => {
                    const isAdCreator = userId === ad.organizer._id.toString();
                    if (data.length === index + 1) {
                      return (
                        <div
                          ref={lastAdRef}
                          key={ad._id}
                          className="flex justify-center"
                        >
                          {/* Render Ad */}
                          <HorizontalCard
                            ad={ad}
                            userId={userId}
                            isAdCreator={isAdCreator}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={ad._id} className="flex justify-center">
                          {/* Render Ad */}
                          <HorizontalCard
                            ad={ad}
                            userId={userId}
                            isAdCreator={isAdCreator}
                          />
                        </div>
                      );
                    }
                  })}
                </ul>
              </div>
            </>
          )}
          {activeButton === 2 && (
            <>
              <StreetmapAll data={data} />
            </>
          )}
        </>
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
      {loading && (
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
      )}
    </>
  );
};

export default CollectionSearch;
