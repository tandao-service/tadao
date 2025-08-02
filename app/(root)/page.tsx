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
  let myloans: any = [];
  if (userId) {
    user = await getUserById(userId);
    myloans = await getByUserIdLaons(userId);
  }
  const categoryList = await getAllCategories();
  const subcategoryList = await getAllSubCategories();
  const AdsCountPerRegion = await getAdsCountAllRegion();
  const packagesList = await getAllPackages();
  const loans = await getallPendingLaons();
  //const categoryList:any = [];
  //const subcategoryList:any = [];
  //const AdsCountPerRegion:any = [];
  //console.log(user)
  return (
    <main>

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
