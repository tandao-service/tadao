"use client";
import { requeststkpush } from "@/lib/actions/requeststkpush";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { Requestcheckpayment } from "@/lib/actions/checkpayment";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatKsh } from "@/lib/help";

type payProps = {
  userId: string;
  trans: any;
};
const DashboardPay = ({ userId, trans }: payProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);
  const [adsData, setAdsData] = useState(trans);

  const [deposit, setdeposit] = useState(
    trans.length > 0 ? trans[0].amount : 0
  );
  const [stkresponse, setstkresponse] = useState("");
  const [errorstkresponse, errorsetstkresponse] = useState("");
  const [payphone, setpayphone] = useState("");
  const [errordeposit, seterrordeposit] = useState("");
  const [errormpesaphone, seterrormpesaphone] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [pay, setpay] = useState(
    trans.length > 0 ? trans[0].status : "Pending"
  );
  const [countryCode, setCountryCode] = useState("254"); // Default country code

  const tabs = [
    { title: "Pay", content: "Pay" },
    { title: "History", content: "History" },
  ];

  const [activeTabW, setActiveTabW] = useState(0);
  const tabW = [
    { title: "Withdraw", content: "withdraw" },
    { title: "History", content: "history" },
  ];
  const formatPhoneNumber = (input: any) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, "");

    // Apply formatting based on length
    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 7) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    } else if (cleaned.length < 11) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(
        6,
        10
      )}`;
    }
  };
  function removeLeadingZero(numberString: string) {
    // Check if the first character is '0'
    if (numberString.charAt(0) === "0") {
      // If yes, return the string without the first character
      return numberString.substring(1);
    } else {
      // If no, return the original string
      return numberString;
    }
  }
  function removeLeadingPlus(numberString: string) {
    // Check if the first character is '0'
    if (numberString.charAt(0) === "+") {
      // If yes, return the string without the first character
      return numberString.substring(1);
    } else {
      // If no, return the original string
      return numberString;
    }
  }
  const handleTopup = async (e: any) => {
    e.preventDefault();

    if (payphone.trim() === "") {
      seterrormpesaphone("Enter M-Pesa Phone Number");
      return;
    }
    try {
      setisSubmitting(true);
      const response = await requeststkpush(
        trans[0].orderTrackingId,
        removeLeadingPlus(countryCode) + removeLeadingZero(payphone),
        Number(deposit)
      );

      if (response === "success") {
        // console.log("RESPONSE    " + response);
        setstkresponse(
          "STK PUSH sent to your phone, Check Mpesa prompt, Enter your pin to complete deposit"
        );
        setdeposit("");
        setpayphone("");
        setisSubmitting(false);
        //  window.location.reload();
      } else {
        setisSubmitting(false);
        errorsetstkresponse("Error sending mpesa stk push");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const orderTrackingId = trans[0].orderTrackingId; // Replace with your actual tracking ID

  const requestpaymentcheck = async (orderTrackingId: string) => {
    // Your function logic here
    const checkresponse = await Requestcheckpayment(orderTrackingId);
    // alert(checkresponse);
    if (checkresponse === "success") {
      setpay("Active");
      toast({
        title: "Order successful!",
        description: "Your subscription is successful",
        duration: 5000,
        className: "bg-[#30AF5B] text-white",
      });
      // router.push(`/shop/${userId}`);
    }
    //console.log(`Requesting stk push for ${orderTrackingId}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      requestpaymentcheck(orderTrackingId);
      //  setpay(trans[0].status);
      // alert("check");
    }, 5000); // 1000 ms = 1 second

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [orderTrackingId, adsData]); // Dependency array to watch the orderTrackingId

  if (trans.length === 0) {
    return (
      <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
        <h3 className="p-bold-20 md:h5-bold">No order found!</h3>
        <p className="p-regular-14">No data</p>
      </div>
    );
  }
  return (
    <div className="fixed w-full h-screen">
      <div className="p-1">
        <div className="p-1 max-w-3xl mx-auto mb-2">
          <div className="p-0 w-full items-center">
            <div className="flex flex-col items-center rounded-t-lg w-full p-1">
              <div className="gap-1 h-[450px] mt-2 items-center w-full rounded-lg">
                <div className="">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col rounded-lg bg-white p-2 mb-2 w-full">
                      <div className="flex justify-between w-full items-center">
                        <div className="flex gap-1 items-center">
                          <div className="font-bold text-grey-900 font-bold p-2">
                            Plan
                          </div>
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

                        {trans[0].plan === "Verification" ? (
                          <>
                            <div className="flex justify-between w-full items-center">
                              <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                                Description:
                              </div>
                              <div className="flex text-[12px] lg:text-xs font-bold items-center">
                                One-time Account verification fee
                              </div>
                            </div>
                          </>
                        ) : (
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
                                Allawable Ads:
                              </div>
                              <div className="flex text-[12px] lg:text-xs font-bold items-center">
                                {trans[0].planId.list}
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
                              className={`flex flex-col text-[12px] lg:text-xs p-1 text-white justify-center items-center w-[70px] rounded-full ${
                                pay === "Pending"
                                  ? "bg-yellow-600"
                                  : pay === "Failed"
                                  ? "bg-red-600 "
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
                              <div className="text-grey-900 font-bold p-2">
                                Amount
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-black font-bold p-2">
                                {formatKsh(trans[0].amount)}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg p-1 text-gray-900">
                            Pay via MPESA EXPRESS
                          </div>
                          <div className="flex flex-col gap-1 mb-4 w-full">
                            <TextField
                              id="outlined-password-input"
                              label="M-Pesa Phone Number"
                              type="text"
                              value={payphone}
                              onChange={(e) =>
                                setpayphone(formatPhoneNumber(e.target.value))
                              }
                            />
                            <div className="text-red-400">
                              {errormpesaphone}
                            </div>
                          </div>
                          <button
                            onClick={handleTopup}
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 text-white hover:emerald-900 mt-2 p-2 rounded-lg shadow"
                          >
                            {isSubmitting ? "Sending request..." : `Pay Now`}
                          </button>
                          {stkresponse && (
                            <div className="mt-2 text-green-800 text-sm bg-green-100 rounded-lg w-full p-2 items-center">
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
                        <>
                          <div className="flex gap-1 mt-10 items-center">
                            <div className="text-3xl text-grey-900 font-bold p-2">
                              PAID
                            </div>
                            <div className="flex gap-1 w-full">
                              <button
                                onClick={() => router.push(`/`)}
                                className={`w-[100px] bg-gradient-to-b from-[#000000] to-[#333333] hover:bg-[#30AF5B] text-white p-1 rounded-full`}
                              >
                                Home
                              </button>
                              <button
                                onClick={() => router.push(`/shop/${userId}`)}
                                className={`w-[100px] bg-gradient-to-b from-[#000000] to-[#333333] hover:bg-[#30AF5B] text-white p-1 rounded-full`}
                              >
                                My Shop
                              </button>
                              <button
                                onClick={() => router.push(`/ads/create/`)}
                                className={`w-[100px] bg-gradient-to-b from-[#000000] to-[#333333] hover:bg-[#30AF5B] text-white p-1 rounded-full`}
                              >
                                Create Ad
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/*<div className="flex flex-col rounded-lg bg-gray-100 w-full p-2 mb-2">
                          <div className="text-lg p-1 text-gray-900">
                            2. Deposit Via Paybill No
                          </div>
                          <div className="text-sm p-1 font-bold text-gray-900">
                            <ul className="w-full text-sm">
                              <li className="flex gap-2">
                                <div className="text-xl text-gray-600">
                                  Paybill:
                                </div>{" "}
                                <div className="font-bold text-xl text-green-600">
                                  {paybill}
                                </div>
                              </li>
                              <li className="flex gap-2">
                                <div className="text-xl text-gray-600">
                                  Account:
                                </div>{" "}
                                <div className="font-bold text-xl text-green-600">
                                  {userID}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPay;
