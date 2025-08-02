"use client";
import { requeststkpush } from "@/lib/actions/requeststkpush";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { Requestcheckpayment } from "@/lib/actions/checkpayment";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatKsh } from "@/lib/help";
import { Toaster } from "../ui/toaster";
import Navbar from "./navbar";
import { mode } from "@/constants";
import { Button } from "../ui/button";
import Footersub from "./Footersub";
import { checkPaymentStatus } from "@/lib/actions/payment.actions";
import Image from "next/image";
import { sendEmailTrans } from "@/lib/actions/sendEmailTrans";
type payProps = {
  userId: string;
  recipientUid: string;
  trans: any;
  user: any;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenChatId: (value: string) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;

};
const dashboardOrder = ({ userId, trans, user, recipientUid, handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, onClose, handleOpenSell, handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety }: payProps) => {


  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
    const isDark = savedTheme === mode;

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);
  const handlePrint = () => window.print();
  useEffect(() => {
    if (isDarkMode === null) return; // Prevent running on initial mount

    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null; // Avoid flickering before state is set

  //useEffect(() => {

  // const fetchData = async () => {
  // try {

  //   await sendEmailTrans(
  //   user.email,
  //   trans.firstName,
  // trans.orderTrackingId,
  // trans.merchantId,
  // trans.plan,
  // trans.period,
  // trans.amount,
  // trans.createdAt

  //)

  //} catch (error) {
  // console.error("Failed to fetch data", error);
  //} finally {

  //}
  // };

  //fetchData();

  //}, []);

  if (trans.length === 0) {
    return (
      <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-lg border py-28 text-center">
        <h3 className="p-bold-20 md:h5-bold">No order found!</h3>
        <p className="p-regular-14">No data</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen dark:bg-[#131B1E] h-screen text-black dark:text-[#F1F3F3] bg-[#FAE6DA]">
      <div className="top-0 z-10 fixed w-full">
        <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"pay"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
          handleOpenPerfomance={handleOpenPerfomance}
          handleOpenSettings={handleOpenSettings}
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
          handleOpenShop={handleOpenShop} />
      </div>
      <div className="max-w-xl mx-auto mt-[70px] border rounded-lg shadow-lg bg-white text-gray-800 overflow-hidden print:max-w-full print:shadow-none print:border-none">
        {/* Header */}
        <div className="bg-green-100 text-green-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Tadao Services"
              width={40}
              height={40}
              className="rounded"
            />
            <div>
              <div className="text-lg font-bold">Tadao Services</div>
              <div className="text-sm">Payment Receipt</div>
            </div>
          </div>
          <div className="text-sm">Ref: #{trans.orderTrackingId}</div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3 text-sm">

          <div>
            <span className="font-semibold text-sm">MerchantId:</span> {trans.merchantId}
          </div>
          <div>
            <span className="font-semibold text-sm">Date:</span> {trans.createdAt}
          </div>
          <div>
            <span className="font-semibold text-sm">Email:</span> {user.email}
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-left border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">Item</th>
                  <th className="py-2 px-4 border">Description</th>
                  {trans.period !== "0" && (<> <th className="py-2 px-4 border">Period</th></>)}
                  <th className="py-2 px-4 border">Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border">1</td>
                  <td className="py-2 px-4 border">{trans.plan} Subscription</td>
                  {trans.period !== "0" && (<> <td className="py-2 px-4 border">{trans.period}</td></>)}
                  <td className="py-2 px-4 border">{formatKsh(trans.amount)}</td>
                </tr>
                {/* Add more rows here if needed */}
              </tbody>
            </table>
          </div>


          <div>
            <span className="font-semibold">Transaction Status:</span>{" "}
            <span className="text-green-600 font-semibold">Successful</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 space-y-3">
          <div className="text-xs text-gray-600">
            <p><strong>Tadao Services</strong></p>
            <p>P.O. Box 12345, Nairobi, Kenya</p>
            <p>Email: support@tadaoservices.com | Phone: +254 712 345 678</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end mt-4 print:hidden">
            <Button variant="outline" onClick={onClose}>Home</Button>
            <Button variant="outline" onClick={() => handleOpenShop(user)}>My Shop</Button>
            <Button variant="outline" onClick={handlePrint}>Print Receipt</Button>
          </div>
        </div>
      </div>


    </div >
  );
};

export default dashboardOrder;
