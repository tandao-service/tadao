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
import { requestOrder } from "@/lib/actions/requestOrder";
import { updateOrder } from "@/lib/actions/transactions.actions";

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
const DashboardPay = ({ userId, trans, user, recipientUid, handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, onClose, handleOpenSell, handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety }: payProps) => {
  const { toast } = useToast();
  const [phoneInput, setPhoneInput] = useState<string>(user?.phone ?? "");
  const [phoneError, setPhoneError] = useState<string>("");
  useEffect(() => {
    setPhoneInput(user?.phone ?? "");
  }, [user?.phone]);
  const [deposit, setdeposit] = useState(
    trans.length > 0 ? trans[0].amount : 0
  );
  const [stkresponse, setstkresponse] = useState("");
  const [errorstkresponse, errorsetstkresponse] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>([]);

  const [pay, setpay] = useState(
    trans.length > 0 ? trans[0].status : "Pending"
  );

  // Simple KE phone normalizer -> +2547XXXXXXXX
  function normalizeKenyanPhone(input: string | undefined | null): string | null {
    if (!input) return null;
    let s = (input + "").replace(/\D/g, ""); // strip non-digits

    // Accept 07XXXXXXXX, 7XXXXXXXX, 1XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX
    if (s.startsWith("0") && s.length >= 10) s = "254" + s.slice(1);
    else if (s.startsWith("254")) s = s;
    else if (s.startsWith("7") || s.startsWith("1")) s = "254" + s;
    // else: invalid prefix

    // KE MSISDN length = 12 digits when normalized (254 + 9)
    if (s.length !== 12) return null;
    return "+" + s; // E.164
  }


  const handlePay = async () => {
    // Require phone if not present on user
    const rawPhone = user?.phone ?? phoneInput;
    const normalizedPhone = normalizeKenyanPhone(rawPhone);

    if (!normalizedPhone) {
      setPhoneError("Enter a valid Kenyan number, e.g. 07xx..., 7xx..., or +2547xx...");
      // Optional toast
      // toast({ title: "Phone required", description: "Please enter a valid Kenyan phone number.", variant: "destructive" });
      return;
    } else {
      setPhoneError("");
    }
    const orderDetails = {
      id: trans[0].orderTrackingId,
      currency: "KES",
      amount: trans[0].amount,
      description: trans[0].plan || "Tadao Payment",
      callback_url: process.env.NEXT_PUBLIC_DOMAIN_URL + "successful",
      notification_id: "", // optional webhook setup
      billing_address: {
        email: user?.email,
        phone_number: normalizedPhone,
        first_name: user?.firstName,
        last_name: user?.lastName,

      },
    };
    try {
      setisSubmitting(true);

      // Send the order details to the API
      console.log(orderDetails)
      const response: any = await requestOrder(orderDetails);

      const orderId = response.data.order_tracking_id;

      const redirect_url = response.data.redirect_url;
      await updateOrder(trans[0].merchantId, orderId)
      // Check the redirect URL and redirect if valid
      if (redirect_url !== "error") {
        // Redirect the user to the payment page
        window.location.href = redirect_url;
      } else {
        console.error("Error in redirect URL");
      }
      setisSubmitting(false); // Disable the button and show progress
    } catch (error) {
      setisSubmitting(false); // Disable the button and show progress

      console.error("Error processing order:", error);
    }
  };




  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
    const isDark = savedTheme === mode;

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return; // Prevent running on initial mount

    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null; // Avoid flickering before state is set

  if (trans.length === 0) {
    return (
      <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-lg border py-28 text-center">
        <h3 className="p-bold-20 md:h5-bold">No order found!</h3>
        <p className="p-regular-14">No data</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen dark:bg-[#131B1E] h-screen text-black dark:text-[#F1F3F3] bg-gray-100">
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
      <div className="max-w-6xl mx-auto flex mt-[60px] mb-0 p-1">
        <div className="fixed w-full h-screen">
          <div className="p-1">
            <div className="p-1 max-w-3xl dark:bg-[#2D3236] bg-white mx-auto mb-2 border rounded-lg">
              <div className="p-0 w-full items-center">
                <div className="flex flex-col items-center rounded-t-lg w-full p-1">
                  <div className="gap-1 h-[450px] mt-2 items-center w-full rounded-lg">
                    <div className="">
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col rounded-lg dark:bg-[#2D3236] bg-white p-2 mb-2 w-full">
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
                                    Allaowable Ads:
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
                                  className={`flex flex-col mt-1 text-[12px] lg:text-xs p-1 text-white justify-center items-center w-[70px] rounded-full ${pay === "Pending"
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
                                  <div className="dark:text-gray-300 text-grey-900 font-bold p-2">
                                    Amount
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="dark:text-gray-300 text-black font-bold p-2">
                                    {formatKsh(trans[0].amount)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-lg p-1 dark:text-gray-300 text-gray-900">
                                {/* M-Pesa */}
                                <span className="flex items-center gap-1">
                                  <img src="/assets/images/mpesa.png" alt="M-Pesa" className="w-10 h-5" />

                                </span>



                                {/* Airtel */}
                                <span className="flex items-center gap-1">
                                  <img src="/assets/images/airtel.png" alt="Airtel" className="w-10 h-5" />

                                </span>



                                {/* Visa */}
                                <span className="flex items-center gap-1">
                                  <img src="/assets/images/visa.png" alt="Visa" className="w-10 h-5" />

                                </span>


                              </div>

                              {!user?.phone && (
                                <div className="mt-2">
                                  <label className="block text-sm mb-1">Phone number (M-Pesa / Airtel Money)</label>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="07xx xxx xxx or +2547xx xxx xxx"
                                    value={phoneInput}
                                    onChange={(e) => {
                                      setPhoneInput(e.target.value);
                                      if (phoneError) setPhoneError("");
                                    }}
                                    onBlur={() => {
                                      if (!normalizeKenyanPhone(phoneInput)) {
                                        setPhoneError("Enter a valid Kenyan number, e.g. 07xx..., 7xx..., or +2547xx...");
                                      }
                                    }}
                                    error={!!phoneError}
                                    helperText={phoneError || "Required for billing & STK/checkout"}
                                  />
                                </div>
                              )}
                              <Button
                                onClick={handlePay}
                                variant="default"
                                disabled={
                                  isSubmitting ||
                                  (!user?.phone && !normalizeKenyanPhone(phoneInput))
                                }
                                className="w-full hover:bg-[#8C4B2C] bg-[#BD7A4F] text-white mt-2 shadow"
                              >
                                {isSubmitting ? "Sending request..." : `Pay Now`}
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
                            <>
                              <div className="mt-10 p-4 border rounded-lg shadow-sm bg-white text-gray-800">
                                {/* Receipt Header */}
                                <div className="text-2xl font-bold mb-2">Payment Receipt</div>

                                {/* Receipt Details */}
                                <div className="space-y-1 text-sm">

                                  <div><span className="font-semibold">Receipt ID:</span> #{receiptData.orderId}</div>
                                  <div><span className="font-semibold">Amount Paid:</span> KES {formatKsh(receiptData.amount)}</div>
                                  <div><span className="font-semibold">TransactionId:</span> {receiptData.transactionId}</div>
                                  <div><span className="font-semibold">Phone:</span> {receiptData.phone}</div>
                                  <div><span className="font-semibold">Date:</span> {receiptData.date}</div>
                                  <div><span className="font-semibold">Payment Method:</span> M-Pesa</div>
                                  <div><span className="font-semibold">Transaction Status:</span> <span className="text-green-600 font-medium">Successful</span></div>
                                </div>

                                {/* Paid & Navigation Buttons */}
                                <div className="flex gap-1 mt-6 items-center">

                                  <div className="flex gap-2 w-full">
                                    <Button
                                      variant="outline"
                                      onClick={onClose}
                                    >
                                      Home
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleOpenShop(user)}
                                    >
                                      My Shop
                                    </Button>
                                  </div>
                                </div>
                              </div>

                            </>
                          )}
                        </div>

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
