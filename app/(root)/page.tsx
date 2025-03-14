import dynamic from "next/dynamic";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
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
import Footer from "@/components/shared/Footer";
//import Header from "@/components/shared/Header";
import { getUserById } from "@/lib/actions/user.actions";
//import { auth } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

//import { UpdateUserParams } from "@/types";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Navbarhome from "@/components/shared/navbarhome";
import ClientFCMHandler from "@/components/shared/ClientFCMHandler";
import Head from "next/head";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllSubCategories } from "@/lib/actions/subcategory.actions";
import { getAdsCountAllRegion } from "@/lib/actions/dynamicAd.actions";
import PropertyMap from "@/components/shared/PropertyMap";
import GoogleMapp from "@/components/shared/GoogleMapping";
import HomePage from "@/components/shared/HomePage";
import MainPage from "@/components/shared/MainPage";

export default async function Home({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;

  const queryObject = searchParams
    ? Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== undefined)
      )
    : {};

  let user: any = [];
  if (userId) {
    user = await getUserById(userId);
  }
  const categoryList = await getAllCategories();
  const subcategoryList = await getAllSubCategories();
  const AdsCountPerRegion = await getAdsCountAllRegion();
 //console.log(AdsCountPerRegion)
 
//const categoryList:any = [];
//const subcategoryList:any = [];
//const AdsCountPerRegion:any = [];
  return (
    <main>
<MainPage emptyTitle="No Ads Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Ads"
            limit={20}
            user={user}
            userId={userId}
            userName={userName}
            userImage={userImage}
            queryObject={queryObject}
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            AdsCountPerRegion={AdsCountPerRegion}/>
       {/* <CollectionInfinite
            emptyTitle="No Ads Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Ads"
            limit={20}
            user={user}
            userId={userId}
            userName={userName}
            userImage={userImage}
            queryObject={queryObject}
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            AdsCountPerRegion={AdsCountPerRegion}
          />
 <HomePage 
emptyTitle="No Ads Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Ads"
            limit={20}
            user={user}
            userId={userId}
            userName={userName}
            userImage={userImage}
            queryObject={queryObject}
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            AdsCountPerRegion={AdsCountPerRegion}/>*/} 
          <Toaster />
      
   
    </main>
  );
}
