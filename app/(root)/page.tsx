import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import { getAllCategories } from "@/lib/actions/category.actions";
import { duplicateSubcategories, getAllSubCategories } from "@/lib/actions/subcategory.actions";
import { getAdsCountAllRegion } from "@/lib/actions/dynamicAd.actions";
import CollectionInfinite from "@/components/shared/CollectionInfinite";
import { checkExpiredLatestSubscriptionsPerUser } from "@/lib/actions/transactions.actions";
import { getallPendingLaons, getByUserIdLaons } from "@/lib/actions/loan.actions";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { getAdsCountAllRegionCached, getAllCategoriesCached, getAllPackagesCached, getAllSubCategoriesCached } from "@/lib/actions/cached.actions";
import BackHandler from "@/components/shared/BackHandler";
export default async function Home({ searchParams }: SearchParamProps) {

  const queryObject = searchParams
    ? Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined)
    )
    : {};

  let user: any = [];
  let myloans: any = [];
  let userId = "";
  let userName = "";
  let userImage = "";

  try {
    const sessionClaims = auth().sessionClaims;
    userId = sessionClaims?.userId as string;
    userName = sessionClaims?.userName as string;
    userImage = sessionClaims?.userImage as string;

    [user, myloans] = await Promise.all([
      getUserById(userId),
      getByUserIdLaons(userId)
    ]);
  } catch (error) {
    console.error("Auth/user fetch failed:", error);
  }

  const [
    categoryList,
    subcategoryList,
    packagesList,
    AdsCountPerRegion,
    loans
  ] = await Promise.all([
    getAllCategoriesCached(),
    getAllSubCategoriesCached(),
    getAllPackagesCached(),
    getAdsCountAllRegionCached(),
    getallPendingLaons()
  ]);

  return (
    <main>
      {/* 👈 <BackHandler />   back press handler here */}
      <CollectionInfinite
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
        packagesList={packagesList}
        loans={loans}
        myloans={myloans}
      />

      <Toaster />


    </main>
  );
}
