// components/Chat.js

import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import {
  getallTransaction,
  getpayTransaction,
} from "@/lib/actions/transactions.actions";

import DashboardPay from "@/components/shared/dashboardPay";
type payProps = {
  params: {
    id: string;
  };
};
const Pay = async ({ params: { id } }: payProps) => {
  const trans = await getpayTransaction(id);
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  //const alltrans = await getallTransaction(userId);
  const userName = sessionClaims?.userName as string;
  //  const userEmail = sessionClaims?.userEmail as string;
  const userImage = sessionClaims?.userImage as string;
  const recipientUid = id;

  // console.log(alltrans);
  
  return (
   
        <DashboardPay userId={userId} trans={trans} recipientUid={recipientUid}/>
       
  );
};

export default Pay;
