"use client";

import { useEffect, useState } from "react";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { getByUserIdLaons } from "@/lib/actions/loan.actions";
import CollectionInfinite from "@/components/shared/CollectionInfinite";
import PresenceProvider from "@/components/shared/PresenceProvider";
import FCMTokenProvider from "@/components/shared/FCMTokenProvider";
import HomeSkeleton from "@/components/shared/HomeSkeleton";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/app/hooks/useAuth";
import { useGlobalData } from "@/public/context/GlobalDataContext";
import MobileSkeleton from "./MobileSkeleton";
import { Capacitor } from "@capacitor/core";

export default function MainClient({ queryObject }: { queryObject: any }) {
  const { categories, subcategories, packages, adsCount } = useGlobalData();

  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [myloans, setMyLoans] = useState<any>([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(false);
        const fetchedUser: any = await getUserByClerkId(user.uid);
        const fetchedMyLoans = await getByUserIdLaons(fetchedUser._id);

        setUserData(fetchedUser);
        setMyLoans(fetchedMyLoans);
        setUserId(fetchedUser._id);
        setUserName(fetchedUser.firstName + " " + fetchedUser.lastName);
        setUserImage(fetchedUser.photo || "");
      } catch (err) {
        console.error("User fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (authLoading || loading) {
    return (<>{Capacitor.isNativePlatform() ? (<MobileSkeleton />) : (<HomeSkeleton />)}</>);
  }

  return (
    <main>
      {userId && (
        <>
          <PresenceProvider userId={userId} />
          <FCMTokenProvider userId={userId} />
        </>
      )}
      <CollectionInfinite
        emptyTitle="No Ads Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Ads"
        limit={20}
        user={userData}
        userId={userId}
        uid={user?.uid || ""}
        userName={userName}
        userImage={userImage}
        queryObject={queryObject}
        categoryList={categories}
        subcategoryList={subcategories}
        AdsCountPerRegion={adsCount}
        packagesList={packages}
        loans={[]} // if you still need "loans", fetch them server-side like others
        myloans={myloans}
      />
      <Toaster />
    </main>
  );
}
