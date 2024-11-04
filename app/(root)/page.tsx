import dynamic from "next/dynamic";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { getAllCategories } from "@/lib/actions/category.actions";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Link from "next/link";
import { getAllAd } from "@/lib/actions/ad.actions";
import MenuSubmobile from "@/components/shared/MenuSubmobile";
//import Collection from "@/components/shared/Collection";
import { createUser } from "@/lib/actions/user.actions";
import { getfcmTokenFromCookie } from "@/lib/actions/cookies";
import CollectionInfinite from "@/components/shared/CollectionInfinite";
import AppPopup from "@/components/shared/AppPopup ";

export default async function Home({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const sortby = (searchParams?.sortby as string) || "recommeded";
  const category = (searchParams?.category as string) || "";
  const subcategory = (searchParams?.subcategory as string) || "";
  const make = (searchParams?.make as string) || "";
  const vehiclemodel = (searchParams?.vehiclemodel as string) || "";
  const yearfrom = (searchParams?.yearfrom as string) || "";
  const yearto = (searchParams?.yearto as string) || "";
  const Price = (searchParams?.Price as string) || "";
  const vehiclecolor = (searchParams?.vehiclecolor as string) || "";
  const vehiclecondition = (searchParams?.vehiclecondition as string) || "";
  const longitude = (searchParams?.longitude as string) || "";
  const latitude = (searchParams?.latitude as string) || "";
  const region = (searchParams?.region as string) || "";
  const membership = (searchParams?.membership as string) || "";
  const vehicleTransmissions =
    (searchParams?.vehicleTransmissions as string) || "";
  const vehicleFuelTypes = (searchParams?.vehicleFuelTypes as string) || "";
  const vehicleEngineSizesCC =
    (searchParams?.vehicleEngineSizesCC as string) || "";
  const vehicleexchangeposible =
    (searchParams?.vehicleexchangeposible as string) || "";
  const vehicleBodyTypes = (searchParams?.vehicleBodyTypes as string) || "";
  const vehicleregistered = (searchParams?.vehicleregistered as string) || "";
  const vehicleSeats = (searchParams?.vehicleSeats as string) || "";
  const vehiclesecordCondition =
    (searchParams?.vehiclesecordCondition as string) || "";

  const vehicleyear = (searchParams?.vehicleyear as string) || "";

  const bedrooms = (searchParams?.bedrooms as string) || "";

  const bathrooms = (searchParams?.bathrooms as string) || "";

  const furnishing = (searchParams?.furnishing as string) || "";

  const amenities = (searchParams?.amenities as string[]) || "";

  const toilets = (searchParams?.toilets as string) || "";

  const parking = (searchParams?.parking as string) || "";

  const status = (searchParams?.status as string) || "";

  const area = (searchParams?.area as string) || "";

  const landuse = (searchParams?.landuse as string) || "";

  const propertysecurity = (searchParams?.propertysecurity as string) || "";
  const floors = (searchParams?.floors as string) || "";
  const estatename = (searchParams?.estatename as string) || "";
  const houseclass = (searchParams?.houseclass as string) || "";
  const categoryList = await getAllCategories();
  // const Ads = await getAllAd({
  //   query: searchText,
  //   sortby: sortby,
  //  category,
  //   subcategory,
  //  make: make,
  //  vehiclemodel: vehiclemodel,
  //  yearfrom: yearfrom,
  //  yearto: yearto,
  //   vehiclecolor: vehiclecolor,
  //  vehiclecondition: vehiclecondition,
  //  vehicleTransmissions: vehicleTransmissions,
  //  longitude: longitude,
  //  latitude: latitude,
  //   address: region,
  //  membership: membership,
  //  vehicleFuelTypes: vehicleFuelTypes,
  //  vehicleEngineSizesCC: vehicleEngineSizesCC,
  //  vehicleexchangeposible: vehicleexchangeposible,
  //  vehicleBodyTypes: vehicleBodyTypes,
  //  vehicleregistered: vehicleregistered,
  //  vehicleSeats: vehicleSeats,
  //  vehiclesecordCondition: vehiclesecordCondition,
  //   vehicleyear: vehicleyear,
  //   Price: Price,
  //   bedrooms: bedrooms,
  // bathrooms: bathrooms,
  //  furnishing: furnishing,
  //  amenities: amenities,
  //  toilets: toilets,
  //  parking: parking,
  //   status: status,
  //   area: area,
  //  landuse: landuse,
  //  propertysecurity: propertysecurity,
  //  floors: floors,
  //  estatename: estatename,
  //   houseclass: houseclass,
  //   page,
  //   limit: 20,
  // });

  if (!categoryList) {
    return (
      <div>
        <div className="flex-center h-screen w-full bg-[#ebf2f7] bg-dotted-pattern bg-cover bg-fixed bg-center">
          <div className="flex gap-1 items-center">
            <Image
              src="/assets/icons/loading.gif"
              alt="edit"
              width={60}
              height={60}
            />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="max-w-6xl mx-auto flex mt-0">
        <div className="flex-1">
          <div className="mt-[190px] sm:mt-0">
            <MenuSubmobile categoryList={categoryList} />
          </div>
          <div className="p-2 mt-2 mb-20 lg:mb-0">
            <div className="flex w-full items-center justify-between gap-5 p-2 md:flex-row">
              <div className="items-center flex">
                <h2 className="font-bold p-2 text-[30px]">Trending Ads</h2>
              </div>
              {/*  <div>
                <SignedIn>
                  <Link href="/ads/create">
                    <button
                      className={`w-[150px] bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] hover:bg-[#30AF5B] text-white p-2 rounded-full`}
                    >
                      <AddCircleOutlineOutlinedIcon /> SELL
                    </button>
                  </Link>
                </SignedIn>
              </div>
              <div>
                <SignedOut>
                  <Link href="/sign-in">
                    <button
                      className={`w-[150px] bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] hover:bg-[#30AF5B] text-white p-2 rounded-lg`}
                    >
                      <AddCircleOutlineOutlinedIcon /> SELL
                    </button>
                  </Link>
                </SignedOut>
              </div> */}
            </div>
            <CollectionInfinite
              emptyTitle="No Ads Found"
              emptyStateSubtext="Come back later"
              collectionType="All_Ads"
              limit={20}
              userId={userId}
              userName={userName}
              userImage={userImage}
              searchText={searchText}
              sortby={sortby}
              category={category}
              subcategory={subcategory}
              make={make}
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
          </div>
        </div>
      </div>
    </main>
  );
}
