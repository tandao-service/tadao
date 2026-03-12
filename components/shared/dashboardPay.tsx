"use client";

import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatKsh } from "@/lib/help";
import { Toaster } from "../ui/toaster";
import Navbar from "./navbar";
import { mode } from "@/constants";
import { Button } from "../ui/button";
import { checkPaymentStatus } from "@/lib/actions/payment.actions";

// ✅ NEW: subscription activation
import { activateSubscription } from "@/lib/actions/subscription.actions";

// ✅ NEW: mark transaction paid (recommended)
import { completeSubscriptionAfterPayment, markTransactionPaid } from "@/lib/actions/transactions.actions";

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

const DashboardPay = ({
  userId,
  trans,
  user,
  recipientUid,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  onClose,
  handleOpenSell,
  handleOpenChat,
  handleOpenBook,
  handleOpenPlan,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
}: payProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [deposit, setdeposit] = useState(trans.length > 0 ? trans[0].amount : 0);
  const [stkresponse, setstkresponse] = useState("");
  const [errorstkresponse, errorsetstkresponse] = useState("");
  const [payphone, setpayphone] = useState("");
  const [errormpesaphone, seterrormpesaphone] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>({});

  const [pay, setpay] = useState(trans.length > 0 ? trans[0].status : "Pending");
  const [countryCode, setCountryCode] = useState("254");

  // ✅ prevents re-activating if component re-renders / polling hits twice
  const didActivateRef = useRef(false);

  const formatPhoneNumber = (input: any) => {
    const cleaned = String(input || "").replace(/\D/g, "");
    if (cleaned.length < 4) return cleaned;
    if (cleaned.length < 7) return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    if (cleaned.length < 11)
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6, 10)}`;
  };

  function removeLeadingZero(numberString: string) {
    return numberString?.charAt(0) === "0" ? numberString.substring(1) : numberString;
  }

  function removeLeadingPlus(numberString: string) {
    return numberString?.charAt(0) === "+" ? numberString.substring(1) : numberString;
  }

  const handleTopup = async (e: any) => {
    e.preventDefault();

    if (payphone.trim() === "") {
      seterrormpesaphone("Enter M-Pesa Phone Number");
      return;
    }

    try {
      setisSubmitting(true);
      setstkresponse("");
      errorsetstkresponse("");

      const res = await fetch("/api/safaricom/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountReference: trans[0].orderTrackingId,
          Amount: Number(deposit),
          Account: removeLeadingPlus(countryCode) + removeLeadingZero(payphone),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setstkresponse(
          "STK PUSH sent to your phone. Check MPesa prompt and enter your PIN to complete the payment."
        );

        let attempts = 0;
        const maxAttempts = 10;

        const intervalId = setInterval(async () => {
          const paymentStatus: any = await checkPaymentStatus(trans[0].orderTrackingId);

          if (paymentStatus?.success === true) {
            clearInterval(intervalId);

            // ✅ 1) Complete server-side flow (tx paid + subscription activation)
            const done = await completeSubscriptionAfterPayment({
              orderTrackingId: trans[0].orderTrackingId,
            });

            // ✅ 2) UI updates
            setstkresponse("Payment successfully completed!");
            setdeposit("");
            setpayphone("");
            setpay("Active");
            setisSubmitting(false);

            const receipt = {
              orderId: trans[0].orderTrackingId,
              transactionId: paymentStatus.payment.transactionId,
              amount: deposit,
              date: new Date().toLocaleString(),
              phone: payphone,
            };
            setReceiptData(receipt);

            toast({
              title: "Payment successful!",
              description: done?.subscriptionActivated
                ? "Subscription activated. You can now post ads."
                : "Payment completed.",
              duration: 5000,
              className: "bg-[#30AF5B] text-white",
            });

            return;
          }


          if (++attempts >= maxAttempts) {
            clearInterval(intervalId);
            errorsetstkresponse("Payment confirmation timed out. Please try again.");
            setstkresponse("");
            setisSubmitting(false);
            return;
          }
        }, 5000);
      } else {
        errorsetstkresponse(`Error initiating payment: ${data.errorMessage || "Unknown error"}`);
        setisSubmitting(false);
      }

      setdeposit("");
      setpayphone("");
    } catch (err: any) {
      setstkresponse("");
      errorsetstkresponse(`Error: ${err.message}`);
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.phone) {
      const cleanNumber = user.phone.startsWith("+") ? user.phone.slice(1) : user.phone;
      const c = cleanNumber.slice(0, 3);
      const localNumber = cleanNumber.slice(3);
      setCountryCode(c);
      setpayphone(formatPhoneNumber(localNumber));
    }
  }, []);

  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode;
    const isDark = savedTheme === mode;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;
    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null;

  if (trans.length === 0) {
    return (
      <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-lg border py-28 text-center">
        <h3 className="p-bold-20 md:h5-bold">No order found!</h3>
        <p className="p-regular-14">No data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#131B1E] h-screen text-black dark:text-[#F1F3F3] bg-gray-200">
      <div className="top-0 z-10 fixed w-full">
        <Navbar
          user={user}
          userstatus={user.status}
          userId={userId}
          onClose={onClose}
          popup={"pay"}
          handleOpenSell={handleOpenSell}
          handleOpenBook={handleOpenBook}
          handleOpenPlan={handleOpenPlan}
          handleOpenChat={handleOpenChat}
          handleOpenPerfomance={handleOpenPerfomance}
          handleOpenSettings={handleOpenSettings}
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
          handleOpenShop={handleOpenShop}
        />
      </div>

      <div className="max-w-6xl mx-auto flex mt-[60px] mb-0 p-1">
        <div className="fixed w-full h-screen">
          <div className="p-1">
            <div className="p-1 max-w-3xl dark:bg-[#2D3236] bg-white mx-auto mb-2 border rounded-lg">
              <div className="p-0 w-full items-center">
                <div className="flex flex-col items-center rounded-t-lg w-full p-1">
                  <div className="gap-1 h-[450px] mt-2 items-center w-full rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="flex flex-col rounded-lg dark:bg-[#2D3236] bg-white p-2 mb-2 w-full">
                        <div className="flex justify-between w-full items-center">
                          <div className="flex gap-1 items-center">
                            <div className="font-bold p-2">Plan</div>
                          </div>
                          <div className="flex items-center">
                            <div className="font-bold p-2">{trans[0].plan}</div>
                          </div>
                        </div>

                        <div className="p-1">
                          <div className="flex justify-between w-full items-center">
                            <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                              Order Tracking Id:
                            </div>
                            <div className="flex text-[12px] lg:text-xs font-bold items-center">
                              {trans[0].orderTrackingId}
                            </div>
                          </div>

                          {trans[0].plan !== "Verification" && (
                            <>
                              <div className="flex justify-between w-full items-center">
                                <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                                  Period:
                                </div>
                                <div className="flex text-[12px] lg:text-xs font-bold items-center">
                                  {trans[0].period}
                                </div>
                              </div>
                              <div className="flex justify-between w-full items-center">
                                <div className="flex text-[12px] lg:text-xs gap-1 items-center">
                                  Allowable Ads:
                                </div>
                                <div className="flex text-[12px] lg:text-xs font-bold items-center">
                                  {trans[0]?.planId?.list ?? "-"}
                                </div>
                              </div>
                            </>
                          )}

                          <div className="flex justify-between w-full items-center">
                            <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                              Status:
                            </div>
                            <div className="flex items-center">
                              <div
                                className={`flex flex-col mt-1 text-[12px] lg:text-xs p-1 text-white justify-center items-center w-[70px] rounded-full ${pay === "Pending"
                                  ? "bg-yellow-600"
                                  : pay === "Failed"
                                    ? "bg-red-600"
                                    : "bg-green-600"
                                  }`}
                              >
                                {pay}
                              </div>
                            </div>
                          </div>
                        </div>

                        {pay === "Pending" ? (
                          <>
                            <div className="flex justify-between w-full items-center">
                              <div className="flex gap-1 items-center">
                                <div className="font-bold p-2">Amount</div>
                              </div>
                              <div className="flex items-center">
                                <div className="font-bold p-2">{formatKsh(trans[0].amount)}</div>
                              </div>
                            </div>

                            <div className="text-lg p-1">Pay via MPESA EXPRESS</div>

                            <div className="flex flex-col gap-1 mb-4 w-full">
                              <TextField
                                label="M-Pesa Phone Number"
                                type="text"
                                value={payphone}
                                onChange={(e) => setpayphone(formatPhoneNumber(e.target.value))}
                                variant="outlined"
                                placeholder="M-Pesa Phone Numbers"
                                className="w-full"
                              />
                              <div className="text-red-400">{errormpesaphone}</div>
                            </div>

                            <Button
                              onClick={handleTopup}
                              variant="default"
                              disabled={isSubmitting}
                              className="w-full bg-green-600 text-white hover:bg-green-700 mt-2 shadow"
                            >
                              {isSubmitting ? "Sending request..." : "Pay Now"}
                            </Button>

                            {stkresponse && (
                              <div className="mt-2 text-green-700 text-sm bg-green-100 rounded-lg w-full p-2 items-center">
                                {stkresponse}
                              </div>
                            )}
                            {errorstkresponse && (
                              <div className="mt-1 text-red-800 text-sm bg-red-100 rounded-lg w-full p-2 items-center">
                                {errorstkresponse}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="mt-10 p-4 border rounded-lg shadow-sm bg-white text-gray-800">
                            <div className="text-2xl font-bold mb-2">Payment Receipt</div>

                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="font-semibold">Receipt ID:</span> #{receiptData.orderId}
                              </div>
                              <div>
                                <span className="font-semibold">Amount Paid:</span> KES{" "}
                                {formatKsh(receiptData.amount)}
                              </div>
                              <div>
                                <span className="font-semibold">TransactionId:</span>{" "}
                                {receiptData.transactionId}
                              </div>
                              <div>
                                <span className="font-semibold">Phone:</span> {receiptData.phone}
                              </div>
                              <div>
                                <span className="font-semibold">Date:</span> {receiptData.date}
                              </div>
                              <div>
                                <span className="font-semibold">Payment Method:</span> M-Pesa
                              </div>
                              <div>
                                <span className="font-semibold">Transaction Status:</span>{" "}
                                <span className="text-green-600 font-medium">Successful</span>
                              </div>
                            </div>

                            <div className="flex gap-1 mt-6 items-center">
                              <div className="flex gap-2 w-full">
                                <Button variant="outline" onClick={onClose}>
                                  Home
                                </Button>
                                <Button variant="outline" onClick={() => handleOpenShop(user)}>
                                  My Shop
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default DashboardPay;