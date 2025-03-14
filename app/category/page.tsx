import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { getAllCategories } from "@/lib/actions/category.actions";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/shared/navbar";
import Footersub from "@/components/shared/Footersub";
import BottomNavigation from "@/components/shared/BottomNavigation";
import { Toaster } from "@/components/ui/toaster";
import {
  getallcategories,
  getAllSubCategories,
} from "@/lib/actions/subcategory.actions";
import {
  getAdsCount,
  getAdsCountPerRegion,
  getAdsCountPerVerifiedFalse,
  getAdsCountPerVerifiedTrue,
} from "@/lib/actions/dynamicAd.actions";
import DashboardCategory from "@/components/shared/dashboardCategory";
import MainCategory from "@/components/shared/MainCategory";
// Dynamic imports for components that are not critical for the initial render
//const Navbar = dynamic(() => import("@/components/shared/navbar"), {
// ssr: false,
//});


const Storeads = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const queryObject = searchParams
    ? Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== undefined)
      )
    : {};

  // console.log(queryObject);
  const categoryList = await getAllSubCategories();
  // Function to get fields by category name and subcategory
  const getFieldsByCategoryAndSubcategory = (
    categoryName: string,
    subcategory: string,
    data: any
  ) => {
    return data
      .filter(
        (item: any) =>
          item.category.name === categoryName &&
          item.subcategory === subcategory
      )
      .map((item: any) => item.fields);
  };

  // Example usage

  const category = queryObject.category as string;
  const subcategory = queryObject.subcategory as string;
  let adsCount: any = [];
  if (subcategory) {
    const dataString = getFieldsByCategoryAndSubcategory(
      category,
      subcategory,
      categoryList
    );
    const newfields = dataString[0]
      .filter(
        (item: any) =>
          item.type === "autocomplete" ||
          item.type === "radio" ||
          item.type === "multi-select" ||
          item.type === "select" ||
          item.type === "related-autocompletes" ||
          item.type === "year" ||
          item.type === "checkbox"
      ) // Filter out items where type is 'text'
      .map((item: any) => item.name);
    let fields = newfields.flatMap((field: any) =>
      field === "make-model" ? ["make", "model"] : field
    );
    adsCount = await getAdsCount(category, subcategory, fields);
  }
  //console.log(adsCount);
  const [
    // AdsCountPerSubcategory,
    AdsCountPerRegion,
    AdsCountPerVerifiedTrue,
    AdsCountPerVerifiedFalse,
  ] = await Promise.all([
    //  getAdsCountPerSubcategory(category),
    getAdsCountPerRegion(
      queryObject.category as string,
      queryObject.subcategory as string
    ),
    getAdsCountPerVerifiedTrue(
      queryObject.category as string,
      queryObject.subcategory as string
    ),
    getAdsCountPerVerifiedFalse(
      queryObject.category as string,
      queryObject.subcategory as string
    ),
  ]);

  return (
    
        <MainCategory
          userId={userId}
          emptyTitle="No ads have been created yet"
          emptyStateSubtext="Go create some now"
          limit={20}
          categoryList={categoryList}
          queryObject={queryObject}
          AdsCountPerRegion={AdsCountPerRegion}
          AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
          AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
          adsCount={adsCount}
          loading={false}
        />
       
  );
};

export default Storeads;
