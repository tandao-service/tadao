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
import SafetyComponent from "@/components/shared/SafetyComponent";
const Safety = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
    <SafetyComponent userId={userId}/>
    </>
  );
};
export default Safety;
