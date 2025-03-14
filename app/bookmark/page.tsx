import NavItems from "@/components/shared/NavItems";
import EventForm from "@/components/shared/EventForm";
import Dashboard from "@/components/shared/dashboard";
import { getAdByUser } from "@/lib/actions/ad.actions";
import { SearchParamProps } from "@/types";
//import DashboardMyads from "@/components/shared/dashboardMyads";
import { getData } from "@/lib/actions/transactions.actions";
import Navbar from "@/components/shared/navbar";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { getallBookmarkByuserId } from "@/lib/actions/bookmark.actions";
import DashboardBookmark from "@/components/shared/dashboardBookmark";
import { Toaster } from "@/components/ui/toaster";
import Footersub from "@/components/shared/Footersub";

const myads = async ({ params: { id }, searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const adsPage = Number(searchParams?.adsPage) || 1;
  const user = await getUserById(userId);
  // console.log(bookmark?.data[0].adId);
 

  //console.log("sortby:" + sortby);
  return (
   
        <DashboardBookmark
          userId={userId}
          // data={bookmark?.data}
          user={user}
          emptyTitle="No ads have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Ads_Organized"
          limit={20}
          // page={adsPage}
          urlParamName="adsPage"
          //  totalPages={bookmark?.totalPages}
        />
      
  );
};

export default myads;
