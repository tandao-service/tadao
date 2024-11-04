import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { getAllCategories } from "@/lib/actions/category.actions";
import Link from "next/link";
import dynamic from "next/dynamic";

import {
  getAdByUser,
  getAdsCountPerRegion,
  getAdsCountPerSubcategory,
  getAllAd,
  getListingsNearLocation,
  getAdsCountPerVerifiedTrue,
  getAdsCountPerVerifiedFalse,
  getAdsCountPerMake,
  getAdsCountPerColor,
  getAdsCountPerFuel,
  getAdsCountPerCondition,
  getAdsCountPerTransmission,
  getAdsCountPerCC,
  getAdsCountPerExchange,
  getAdsCountPerBodyType,
  getAdsCountPerRegistered,
  getAdsCountPerSeats,
  getAdsCountPersecondCondition,
  getAdsCountPerYear,
  getAdsCountPerTypes,
  getAdsCountPerpropertysecurity,
  getAdsCountPerlanduse,
  getAdsCountPerfloors,
  getAdsCountPerhouseclass,
  getAdsCountPerbedrooms,
  getAdsCountPerbathrooms,
  getAdsCountPerfurnishing,
  getAdsCountPeramenities,
  getAdsCountPertoilets,
  getAdsCountPerparking,
  getAdsCountPerstatus,
  getAdsCountPerarea,
} from "@/lib/actions/ad.actions";
import Navbar from "@/components/shared/navbar";
import Footersub from "@/components/shared/Footersub";
import BottomNavigation from "@/components/shared/BottomNavigation";
import { Toaster } from "@/components/ui/toaster";
// Dynamic imports for components that are not critical for the initial render
//const Navbar = dynamic(() => import("@/components/shared/navbar"), {
// ssr: false,
//});

const DashboardCategory = dynamic(
  () => import("@/components/shared/dashboardCategory"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen w-full bg-[#ebf2f7] bg-dotted-pattern bg-cover bg-fixed bg-center">
        <div className="flex gap-1 items-center justify-center mb-40">
          <img
            src="/assets/icons/loading.gif"
            alt="edit"
            width={60}
            height={60}
          />
          Loading...
        </div>
      </div>
    ),
  }
);
const Storeads = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const sortby = (searchParams?.sortby as string) || "";
  const category = (searchParams?.category as string) || "";
  const subcategory = (searchParams?.subcategory as string) || "";
  const makeselected = (searchParams?.make as string) || "";
  const vehiclemodel = (searchParams?.vehiclemodel as string) || "";
  const yearfrom = (searchParams?.yearfrom as string) || "";
  const yearto = (searchParams?.yearto as string) || "";
  const Price = (searchParams?.Price as string) || "";
  const vehiclecolor = (searchParams?.vehiclecolor as string) || "";
  const vehiclecondition = (searchParams?.vehiclecondition as string) || "";
  const region = (searchParams?.region as string) || "";
  const longitude = (searchParams?.longitude as string) || "";
  const latitude = (searchParams?.latitude as string) || "";
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
  const Type = (searchParams?.Types as string) || "";
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

  let AdsCountPerMake: any = [];
  //  let AdsCountPerSubcategory: any = [];
  let AdsCountPerColor: any = [];
  let AdsCountPerTransmission: any = [];
  let AdsCountPerFuel: any = [];
  let AdsCountPerCondition: any = [];
  let AdsCountPerCC: any = [];
  let AdsCountPerExchange: any = [];
  let AdsCountPerBodyType: any = [];
  let AdsCountPerRegistered: any = [];
  let AdsCountPerSeats: any = [];
  let AdsCountPersecondCondition: any = [];
  let AdsCountPerYear: any = [];
  let AdsCountPerTypes: any = [];
  let AdsCountPerpropertysecurity: any = [];
  let AdsCountPerlanduse: any = [];
  let AdsCountPerfloors: any = [];
  let AdsCountPerhouseclass: any = [];
  let AdsCountPerbedrooms: any = [];
  let AdsCountPerbathrooms: any = [];
  let AdsCountPerfurnishing: any = [];
  let AdsCountPeramenities: any = [];
  let AdsCountPertoilets: any = [];
  let AdsCountPerparking: any = [];
  let AdsCountPerstatus: any = [];
  let AdsCountPerarea: any = [];

  const categoryList = await getAllCategories();
  const [
    AdsCountPerSubcategory,
    AdsCountPerRegion,
    AdsCountPerVerifiedTrue,
    AdsCountPerVerifiedFalse,
  ] = await Promise.all([
    getAdsCountPerSubcategory(category),
    getAdsCountPerRegion(category, subcategory),
    getAdsCountPerVerifiedTrue(category, subcategory),
    getAdsCountPerVerifiedFalse(category, subcategory),
  ]);

  if (category === "Property") {
    const [
      AdsCountPerpropertysecurity_,
      AdsCountPerlanduse_,
      AdsCountPerfloors_,
      AdsCountPerhouseclass_,
      AdsCountPerbedrooms_,
      AdsCountPerbathrooms_,
      AdsCountPerfurnishing_,
      AdsCountPeramenities_,
      AdsCountPertoilets_,
      AdsCountPerparking_,
      AdsCountPerstatus_,
      AdsCountPerarea_,
    ] = await Promise.all([
      getAdsCountPerpropertysecurity(category, subcategory),
      getAdsCountPerlanduse(category, subcategory),
      getAdsCountPerfloors(category, subcategory),
      getAdsCountPerhouseclass(category, subcategory),
      getAdsCountPerbedrooms(category, subcategory),
      getAdsCountPerbathrooms(category, subcategory),
      getAdsCountPerfurnishing(category, subcategory),
      getAdsCountPeramenities(category, subcategory),
      getAdsCountPertoilets(category, subcategory),
      getAdsCountPerparking(category, subcategory),
      getAdsCountPerstatus(category, subcategory),
      getAdsCountPerarea(category, subcategory),
    ]);
    AdsCountPerpropertysecurity = AdsCountPerpropertysecurity_;
    AdsCountPerlanduse = AdsCountPerlanduse_;
    AdsCountPerfloors = AdsCountPerfloors_;
    AdsCountPerhouseclass = AdsCountPerhouseclass_;
    AdsCountPerbedrooms = AdsCountPerbedrooms_;
    AdsCountPerbathrooms = AdsCountPerbathrooms_;
    AdsCountPerfurnishing = AdsCountPerfurnishing_;
    AdsCountPeramenities = AdsCountPeramenities_;
    AdsCountPertoilets = AdsCountPertoilets_;
    AdsCountPerparking = AdsCountPerparking_;
    AdsCountPerstatus = AdsCountPerstatus_;
    AdsCountPerarea = AdsCountPerarea_;
  }
  if (subcategory === "Watercraft & Boats") {
    const [
      AdsCountPerYear_,
      AdsCountPerExchange_,
      AdsCountPerCondition_,
      AdsCountPerTypes_,
    ] = await Promise.all([
      getAdsCountPerYear(category, subcategory),
      getAdsCountPerExchange(category, subcategory),
      getAdsCountPerCondition(category, subcategory),
      getAdsCountPerTypes(category, subcategory),
    ]);
    AdsCountPerYear = AdsCountPerYear_;
    AdsCountPerExchange = AdsCountPerExchange_;
    AdsCountPerCondition = AdsCountPerCondition_;
    AdsCountPerTypes = AdsCountPerTypes_;
  }

  if (subcategory === "Vehicle Parts & Accessories") {
    const [AdsCountPerMake_, AdsCountPerCondition_, AdsCountPerTypes_] =
      await Promise.all([
        getAdsCountPerMake(category, subcategory),
        getAdsCountPerCondition(category, subcategory),
        getAdsCountPerTypes(category, subcategory),
      ]);
    AdsCountPerMake = AdsCountPerMake_;
    AdsCountPerCondition = AdsCountPerCondition_;
    AdsCountPerTypes = AdsCountPerTypes_;
  }
  if (subcategory === "Trucks & Trailers") {
    const [
      AdsCountPerMake_,
      AdsCountPerYear_,
      AdsCountPerCondition_,
      AdsCountPerTransmission_,
      AdsCountPerTypes_,
      AdsCountPerExchange_,
    ] = await Promise.all([
      getAdsCountPerMake(category, subcategory),
      getAdsCountPerYear(category, subcategory),
      getAdsCountPerCondition(category, subcategory),
      getAdsCountPerTransmission(category, subcategory),
      getAdsCountPerTypes(category, subcategory),
      getAdsCountPerExchange(category, subcategory),
    ]);
    AdsCountPerMake = AdsCountPerMake_;
    AdsCountPerYear = AdsCountPerYear_;
    AdsCountPerCondition = AdsCountPerCondition_;
    AdsCountPerTransmission = AdsCountPerTransmission_;
    AdsCountPerTypes = AdsCountPerTypes_;
    AdsCountPerExchange = AdsCountPerExchange_;
  }

  if (subcategory === "Heavy Equipment") {
    const [
      AdsCountPerMake_,
      AdsCountPerYear_,
      AdsCountPerColor_,
      AdsCountPerCondition_,
      AdsCountPerTransmission_,
      AdsCountPerTypes_,
      AdsCountPerExchange_,
    ] = await Promise.all([
      getAdsCountPerMake(category, subcategory),
      getAdsCountPerYear(category, subcategory),
      getAdsCountPerColor(category, subcategory),
      getAdsCountPerCondition(category, subcategory),
      getAdsCountPerTransmission(category, subcategory),
      getAdsCountPerTypes(category, subcategory),
      getAdsCountPerExchange(category, subcategory),
    ]);
    AdsCountPerMake = AdsCountPerMake_;
    AdsCountPerYear = AdsCountPerYear_;
    AdsCountPerColor = AdsCountPerColor_;
    AdsCountPerCondition = AdsCountPerCondition_;
    AdsCountPerTransmission = AdsCountPerTransmission_;
    AdsCountPerTypes = AdsCountPerTypes_;
    AdsCountPerExchange = AdsCountPerExchange_;
  }

  if (subcategory === "Motorbikes,Tuktuks & Scooters") {
    const [
      AdsCountPerMake_,
      AdsCountPerYear_,
      AdsCountPerColor_,
      AdsCountPerCondition_,
      AdsCountPerTransmission_,
      AdsCountPerExchange_,
    ] = await Promise.all([
      getAdsCountPerMake(category, subcategory),
      getAdsCountPerYear(category, subcategory),
      getAdsCountPerColor(category, subcategory),
      getAdsCountPerCondition(category, subcategory),
      getAdsCountPerTransmission(category, subcategory),
      getAdsCountPerExchange(category, subcategory),
    ]);
    AdsCountPerMake = AdsCountPerMake_;
    AdsCountPerYear = AdsCountPerYear_;
    AdsCountPerColor = AdsCountPerColor_;
    AdsCountPerCondition = AdsCountPerCondition_;
    AdsCountPerTransmission = AdsCountPerTransmission_;
    AdsCountPerExchange = AdsCountPerExchange_;
  }

  if (subcategory === "Buses & Microbuses") {
    const [
      AdsCountPerMake_,
      AdsCountPerYear_,
      AdsCountPerColor_,
      AdsCountPerCondition_,
      AdsCountPerTransmission_,
      AdsCountPerFuel_,
      AdsCountPerExchange_,
      AdsCountPerRegistered_,
      AdsCountPersecondCondition_,
    ] = await Promise.all([
      getAdsCountPerMake(category, subcategory),
      getAdsCountPerYear(category, subcategory),
      getAdsCountPerColor(category, subcategory),
      getAdsCountPerCondition(category, subcategory),
      getAdsCountPerTransmission(category, subcategory),
      getAdsCountPerFuel(category, subcategory),
      getAdsCountPerExchange(category, subcategory),
      getAdsCountPerRegistered(category, subcategory),
      // getAdsCountPerSeats(category, subcategory), // This line is commented out
      getAdsCountPersecondCondition(category, subcategory),
    ]);
    AdsCountPerMake = AdsCountPerMake_;
    AdsCountPerYear = AdsCountPerYear_;
    AdsCountPerColor = AdsCountPerColor_;
    AdsCountPerCondition = AdsCountPerCondition_;
    AdsCountPerTransmission = AdsCountPerTransmission_;
    AdsCountPerFuel = AdsCountPerFuel_;
    AdsCountPerExchange = AdsCountPerExchange_;
    AdsCountPerRegistered = AdsCountPerRegistered_;
    AdsCountPersecondCondition = AdsCountPersecondCondition_;
  }
  if (subcategory === "Cars, Vans & Pickups") {
    const [
      AdsCountPerMake_,
      AdsCountPerYear_,
      AdsCountPerColor_,
      AdsCountPerTransmission_,
      AdsCountPerFuel_,
      AdsCountPerCondition_,
      AdsCountPerCC_,
      AdsCountPerExchange_,
      AdsCountPerBodyType_,
      AdsCountPerRegistered_,
      AdsCountPerSeats_,
      AdsCountPersecondCondition_,
    ] = await Promise.all([
      getAdsCountPerMake(category, subcategory),
      getAdsCountPerYear(category, subcategory),
      getAdsCountPerColor(category, subcategory),
      getAdsCountPerTransmission(category, subcategory),
      getAdsCountPerFuel(category, subcategory),
      getAdsCountPerCondition(category, subcategory),
      getAdsCountPerCC(category, subcategory),
      getAdsCountPerExchange(category, subcategory),
      getAdsCountPerBodyType(category, subcategory),
      getAdsCountPerRegistered(category, subcategory),
      getAdsCountPerSeats(category, subcategory),
      getAdsCountPersecondCondition(category, subcategory),
    ]);
    AdsCountPerMake = AdsCountPerMake_;
    AdsCountPerYear = AdsCountPerYear_;
    AdsCountPerColor = AdsCountPerColor_;
    AdsCountPerTransmission = AdsCountPerTransmission_;
    AdsCountPerFuel = AdsCountPerFuel_;
    AdsCountPerCondition = AdsCountPerCondition_;
    AdsCountPerCC = AdsCountPerCC_;
    AdsCountPerExchange = AdsCountPerExchange_;
    AdsCountPerBodyType = AdsCountPerBodyType_;
    AdsCountPerRegistered = AdsCountPerRegistered_;
    AdsCountPerSeats = AdsCountPerSeats_;
    AdsCountPersecondCondition = AdsCountPersecondCondition_;
  }

  // console.log("--------------------------------------" + Ads?.data);
  return (
    <>
      <div className="z-10 top-0 fixed w-full">
        <Navbar userstatus="User" userId={userId ?? ""} />
      </div>
      <div className="max-w-6xl mx-auto mt-[50px] lg:mt-[70px]">
        <div className="text-sm breadcrumbs p-0 hidden lg:inline">
          <div className="flex">
            <div className="bg-white p-2 rounded-full mr-2">
              <a href="/" className="hover:text-green-700 no-underline">
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
            <div className="bg-white p-2 rounded-full mr-2">
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
                {/*  <Link
                  className="hover:text-green-700 no-underline"
                  href={`/category?category=${category}`}
                >
                  <p className="p-medium-1 p-medium-14"> {category}</p>
                </Link> */}
                <p className="p-medium-1 p-medium-14"> {category}</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-full">
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
                  {subcategory ? subcategory : "All"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 mb-20 lg:mb-0">
        <DashboardCategory
          //loading={false} // Initially false because this is SSR
          userId={userId}
          category={category}
          //data={Ads?.data}
          //totalPages={Ads?.totalPages}
          emptyTitle="No ads have been created yet"
          emptyStateSubtext="Go create some now"
          limit={20}
          // page={page}
          categoryList={categoryList}
          subcategory={subcategory}
          make={AdsCountPerMake}
          makeselected={makeselected}
          AdsCountPerSubcategory={AdsCountPerSubcategory}
          AdsCountPerRegion={AdsCountPerRegion}
          AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
          AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
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
          AdsCountPerYear={AdsCountPerYear}
          Types={AdsCountPerTypes}
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
          searchText={searchText}
          sortby={sortby}
          Type={Type}
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
          loading={false}
        />
        <Toaster />
      </div>
      <footer>
        <div className="hidden lg:inline">
          <Footersub />
        </div>
        <div className="lg:hidden">
          <BottomNavigation userId={userId} />
        </div>
      </footer>
    </>
  );
};

export default Storeads;
