import Navbar from "@/components/shared/navbar";
import { auth } from "@clerk/nextjs/server";
import Footersub from "@/components/shared/Footersub";
import { getAdByUser } from "@/lib/actions/ad.actions";
import { SearchParamProps } from "@/types";
//import DashboardMyads from "@/components/shared/dashboardMyads";
import { getData } from "@/lib/actions/transactions.actions";
import { getUserById } from "@/lib/actions/user.actions";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import DashboardPerformance from "@/components/shared/dashboardPerfomance";
const Performance = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;
  const adsPage = Number(searchParams?.adsPage) || 1;
  const sortby = (searchParams?.query as string) || "recommeded";
  const isAdCreator = true;

  // console.log("organizedAds:" + organizedAds);
  const user = await getUserById(userId);

  let subscription: any = [];
  let daysRemaining = 0;
  let remainingads = 0;
  let listed = 0;
  let planpackage = "Free";
  let planId = "65fa7d3fb20de072ea107223";
  let priority = 0;
  let adstatus = "Pending";
  let color = "#7e71e5";
  const currDate = new Date();
  // Add one month to the current date
  let expirationDate = new Date(currDate);
  expirationDate.setMonth(currDate.getMonth() + 1);

  // const packagesList = await getAllPackages();

  try {
    subscription = await getData(userId);
    //console.log(subscription);
    // Step 1: Parse createdAt date string into a Date object
    listed = subscription.ads;

    remainingads = Number(subscription.currentpack.list) - listed;
    priority = Number(subscription.currentpack.priority);
    color = subscription.currentpack.color;
    planpackage = subscription.currentpack.name;
    try {
      const createdAtDate = new Date(subscription.transaction.createdAt);
      planId = subscription.transaction.planId;
      // Step 2: Extract the number of days from the period string
      const periodDays = parseInt(subscription.transaction.period);

      // Step 3: Calculate expiration date by adding period days to createdAt date
      expirationDate = new Date(
        createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000
      );
      // Step 4: Calculate the number of days remaining until the expiration date
      const currentDate = new Date();
      daysRemaining = Math.ceil(
        (expirationDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
    } catch {}

    if (
      (daysRemaining > 0 && remainingads > 0) ||
      (remainingads > 0 && planpackage === "Free")
    ) {
      adstatus = "Active";
    }
  } catch {}
  //console.log(planpackage + " " + daysRemaining);
 
  return (
    
        <DashboardPerformance
          userId={userId}
          loggedId={userId}
          isAdCreator={isAdCreator}
          user={user}
          userName={userName}
          userImage={userImage}
          daysRemaining={daysRemaining}
          packname={planpackage}
          color={color}
          sortby={sortby}
          emptyTitle="No ads have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Ads_Organized"
          limit={20}
          //  page={adsPage}
          urlParamName="adsPage"
          //  totalPages={organizedAds?.totalPages}
        />
    
  );
};
export default Performance;
