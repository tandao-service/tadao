import { getAllPackages } from "@/lib/actions/packages.actions";
import Image from "next/image";
import { getData } from "@/lib/actions/transactions.actions";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@clerk/nextjs/server";
import Listpackages from "@/components/shared/listpackages";
import PackageComponent from "@/components/shared/PackageComponent";

const Packages = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user = await getUserById(userId);
  const packagesList = await getAllPackages();
  let daysRemaining = 5;
  let planpackage = "Free";
  let subscription: any = [];
  //console.log("-------" + user);
   try {
  
      // Step 1: Parse createdAt date string into a Date object
      const createdAtDate = new Date(subscription[0].createdAt);
      planpackage = subscription[0].plan;
      // Step 2: Extract the number of days from the period string
      const periodDays = parseInt(subscription[0].period);
  
      // Step 3: Calculate expiration date by adding period days to createdAt date
      const expirationDate = new Date(
        createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000
      );
      // Step 4: Calculate the number of days remaining until the expiration date
      const currentDate = new Date();
      daysRemaining = Math.ceil(
        (expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    } catch {}
 
  return (
    <>
     <PackageComponent
                packagesList={packagesList}
                userId={userId}
                user={user}
                planpackage={planpackage}
                daysRemaining={daysRemaining}
              />
              <Toaster />
              </>
  );
};

export default Packages;
