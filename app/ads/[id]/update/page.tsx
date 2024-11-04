import EventForm from "@/components/shared/EventForm";
import Dashboard from "@/components/shared/dashboard";
import Navbar from "@/components/shared/navbar";
import Image from "next/image";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { getData } from "@/lib/actions/transactionstatus";
import { auth } from "@clerk/nextjs/server";
import { getAdById } from "@/lib/actions/ad.actions";
import { Toaster } from "@/components/ui/toaster";
type UpdateAdProps = {
  params: {
    id: string;
  };
};
const UpdateAd = async ({ params: { id } }: UpdateAdProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;
  const Ad = await getAdById(id);
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
  if (!subscription && !packagesList && !Ad) {
    return (
      <div className="flex-center h-screen w-full bg-[#ebf2f7] bg-dotted-pattern bg-cover bg-fixed bg-center">
        <div className="top-0 z-10 fixed w-full">
          <Navbar userstatus="User" userId={userId || ""} />
        </div>
        <div className="max-w-6xl mx-auto mt-20">
          <div className="flex gap-1 items-center">
            <Image
              src="/assets/icons/loading.gif"
              alt="edit"
              width={60}
              height={60}
            />
            Loading...
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="z-10 top-0 fixed w-full">
        <Navbar userstatus="User" userId={userId} />
      </div>
      <div className="mt-2">
        <Dashboard
          userId={userId}
          type="Update"
          ad={Ad}
          adId={Ad._id}
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
      </div>
    </>
  );
};

export default UpdateAd;
