import Footer from "@/components/shared/Footer";
//import Header from "@/components/shared/Header";
import { getUserById } from "@/lib/actions/user.actions";
//import { auth } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
//import { UpdateUserParams } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Navbarhome from "@/components/shared/navbarhome";
import ClientFCMHandler from "@/components/shared/ClientFCMHandler";
import Head from "next/head";
import ReceiveChat from "@/components/shared/ReceiveChat";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  return <main className="flex-1">
      {/* Only load WebSocket listener if user is signed in */}
      <SignedIn>
        <ReceiveChat userId={userId} />
      </SignedIn>
    {children}</main>;
}
