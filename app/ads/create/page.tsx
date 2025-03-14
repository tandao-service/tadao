import Image from "next/image";
import Dashboard from "@/components/shared/dashboard";
import { getData } from "@/lib/actions/transactions.actions";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/shared/navbar";
import { getAllPackages } from "@/lib/actions/packages.actions";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footer from "@/components/shared/Footer";
import Footersub from "@/components/shared/Footersub";
import { Toaster } from "@/components/ui/toaster";
import { FreePackId } from "@/constants";
const create = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  let subscription: any = [];
  let daysRemaining = 0;
  let remainingads = 0;
  let listed = 0;
  let planpackage = "Free";
  let planId = FreePackId;
  let priority = 0;
  let adstatus = "Pending";
  let color = "#000000";
  const currDate = new Date();
  // Add one month to the current date
  let expirationDate = new Date(currDate);
  expirationDate.setMonth(currDate.getMonth() + 1);

  const packagesList = await getAllPackages();
  // console.log(packagesList);
  try {
    subscription = await getData(userId);
    // console.log(subscription);
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

  return (
    <>
      
                <Dashboard
                  userId={userId}
                  type="Create"
                  daysRemaining={daysRemaining}
                  packname={planpackage}
                  planId={planId}
                  userName={userName}
                  packagesList={packagesList}
                  listed={remainingads}
                  expirationDate={expirationDate}
                  priority={priority}
                  adstatus={adstatus}
                />
                <Toaster />
              
    </>
  );
};

export default create;
