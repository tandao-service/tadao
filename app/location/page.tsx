import Navbar from "@/components/shared/navbar";
import SettingsEdit from "@/components/shared/SettingsEdit";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@clerk/nextjs/server";
import Verification from "@/components/shared/Verification";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import Head from "next/head";
import TermsComponent from "@/components/shared/TermsComponent";
import { SearchParamProps } from "@/types";
import DashboardLocation from "@/components/shared/DashboardLocation";
const Location = async ({ searchParams }: SearchParamProps) => {
  const lat = (searchParams?.lat as string) || "0";
  const lng = (searchParams?.lng as string) || "0";
  const title = (searchParams?.title as string) || "";
  const price = (searchParams?.price as string) || "0";
  return (
    <div>
    
    <DashboardLocation lat={Number(lat)} lng={Number(lng)} id={""} title={title} price={Number(price)} imageUrls={[]}/>
    </div>
  );
};
export default Location;
