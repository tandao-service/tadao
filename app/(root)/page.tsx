"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserByClerkId, getUserById } from "@/lib/actions/user.actions";
import {
  getAllCategoriesCached,
  getAllSubCategoriesCached,
  getAllPackagesCached,
  getAdsCountAllRegionCached,
} from "@/lib/actions/cached.actions";
import CollectionInfinite from "@/components/shared/CollectionInfinite";
import { Toaster } from "@/components/ui/toaster";
import { SearchParamProps } from "@/types";
import { getByUserIdLaons } from "@/lib/actions/loan.actions";
import PresenceProvider from "@/components/shared/PresenceProvider";
import FCMTokenProvider from "@/components/shared/FCMTokenProvider";
import HomeSkeleton from "@/components/shared/HomeSkeleton";

export default function Home({ searchParams }: SearchParamProps) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true); // Loading for all data
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [subcategoryList, setSubcategoryList] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [AdsCountPerRegion, setAdsCountPerRegion] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [myloans, setMyLoans] = useState<any>([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [loans, setLoans] = useState<any[]>([]);

  const queryObject = searchParams
    ? Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined)
    )
    : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Global data
        const [categories, subcategories, packages, adsCount] = await Promise.all([
          getAllCategoriesCached(),
          getAllSubCategoriesCached(),
          getAllPackagesCached(),
          getAdsCountAllRegionCached(),
        ]);
        setCategoryList(categories);
        setSubcategoryList(subcategories);
        setPackagesList(packages);
        setAdsCountPerRegion(adsCount);

        // 2️⃣ User data
        if (user) {
          const fetchedUser: any = await getUserByClerkId(user.uid);
          const fetchedMyLoans = await getByUserIdLaons(fetchedUser._id);

          setUserData(fetchedUser);
          setMyLoans(fetchedMyLoans);
          setUserId(fetchedUser._id);
          setUserName(fetchedUser.firstName + " " + fetchedUser.lastName);
          setUserImage(fetchedUser.photo || "");
        }
      } catch (err) {
        console.error("Data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  if (authLoading || loading) {
    // Wait for both Firebase auth & all data fetch
    return (
      <HomeSkeleton />
    );
  }

  return (
    <main>

      {userId && (<><PresenceProvider userId={userId} />
        <FCMTokenProvider userId={userId} /></>)}
      <CollectionInfinite
        emptyTitle="No Ads Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Ads"
        limit={20}
        user={userData}
        userId={userId}
        userName={userName}
        userImage={userImage}
        queryObject={queryObject}
        categoryList={categoryList}
        subcategoryList={subcategoryList}
        AdsCountPerRegion={AdsCountPerRegion}
        packagesList={packagesList}
        loans={loans}
        myloans={myloans}
      />
      <Toaster />
    </main>
  );
}
