import NavItems from "@/components/shared/NavItems";
import EventForm from "@/components/shared/EventForm";
import Dashboard from "@/components/shared/dashboard";
import { getAdByUser } from "@/lib/actions/ad.actions";
import { SearchParamProps } from "@/types";
//import DashboardMyads from "@/components/shared/dashboardMyads";
import { getData } from "@/lib/actions/transactionstatus";
import Navbar from "@/components/shared/navbar";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import DashboardMyads from "@/components/shared/dashboardMyads";
import Footersub from "@/components/shared/Footersub";
import { Toaster } from "@/components/ui/toaster";

const myads = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const myId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;
  let userId = id;
  const adsPage = Number(searchParams?.adsPage) || 1;
  const sortby = (searchParams?.query as string) || "recommeded";
  const isAdCreator = myId === userId;

  const user = await getUserById(userId);

  let subscription: any = [];
  let daysRemaining = 0;
  let remainingads = 0;
  let listed = 0;
  let planpackage = "Free";
  let planId = "65fa7d3fb20de072ea107223";
  let priority = 0;
  let adstatus = "Pending";
  let color = "#000000";
  const currDate = new Date();
  // Add one month to the current date
  let expirationDate = new Date(currDate);
  expirationDate.setMonth(currDate.getMonth() + 1);

  // const packagesList = await getAllPackages();
  // console.log(packagesList);
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
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#ebf2f7] bg-dotted-pattern bg-cover bg-fixed bg-center">
        <div className="flex gap-1 items-center justify-center">
          <img
            src="/assets/icons/loading.gif"
            alt="edit"
            width={60}
            height={60}
          />
          Loading...
        </div>
      </div>
    );
  }

  //console.log("sortby:" + sortby);
  return (
    <>
      <div className="z-10 top-0 fixed w-full">
        <Navbar userstatus="User" userId={myId} />
      </div>
      <div className="mt-[70px]">
        <DashboardMyads
          userId={userId}
          loggedId={myId}
          isAdCreator={isAdCreator}
          user={user}
          daysRemaining={daysRemaining}
          packname={planpackage}
          color={color}
          userImage={userImage}
          userName={userName}
          // data={organizedAds?.data}
          emptyTitle="No ads have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Ads_Organized"
          limit={3}
          sortby={sortby}
          urlParamName="adsPage"
          //  totalPages={organizedAds?.totalPages}
        />
        <Toaster />
      </div>
      <footer>
        <Footersub />
      </footer>
    </>
  );
};

export default myads;
