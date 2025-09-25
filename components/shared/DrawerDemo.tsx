"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FreePackId, VerificationPackId } from "@/constants";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "../ui/use-toast";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ProgressPopup from "./ProgressPopup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

// import { Checkbox } from "../ui/checkbox"; // Unused
type Package = {
  imageUrl: string;
  name: string;
  _id: string;
  description: string;
  price: string[];
  features: string[];
  color: string;
  priority: number;

};
export function DrawerDemo({
  handleOpenSell,
  onClose,
  handleSubCategory,
  handlePayNow,
  isOpen,
  userId,
  category,
  subcategory,
  packagesList,
  user,
}: {
  category: string;
  subcategory: string;
  userId: string;
  user: any;
  isOpen: boolean;
  packagesList: any,
  onClose: () => void;
  handlePayNow: (id: string) => void;
  handleSubCategory: (category: string, subcategory: string) => void;
  handleOpenSell: (category?: string, subcategory?: string) => void;
}) {
  const { toast } = useToast();
  const [showVerify, setShowVerify] = useState(true);
  const [showPackages, setShowPackages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user: currentUser } = useAuth();
  const handlePostRequest = () => {

    handleOpenSell(category, subcategory);
    onClose();
  };
  function generateRandomOrderId() {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    return `MERCHANT_${userId}_${timestamp}`;
  }
  const handlePay = async (
    packIdInput: string,
    packNameInput: string,
    periodInput: string,
    priceInput: string
  ) => {
    const customerId = generateRandomOrderId();

    const trans = {
      orderTrackingId: customerId,
      amount: Number(priceInput),
      plan: packNameInput,
      planId: packIdInput,
      period: periodInput,
      buyerId: userId,
      merchantId: customerId,
      status: "Pending",
      createdAt: new Date(),
    };

    try {
      setIsSending(true);
      const response = await createTransaction(trans);
      if (response.status === "Pending") {
        handlePayNow(response.merchantId);
        onClose();
      }
    } catch (error) {
      //console.log(response);
      console.log("Error processing payment: ", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleViewRequests = () => {

    const isVerified =
      user?.user?.verified && user?.user?.verified[0]?.accountverified === true;
    const hasSubscription = user?.subscriptionStatus === "Active";

    // if (!isVerified) {
    //  setShowVerify(false);
    //  return;
    //}

    // if (isVerified && !hasSubscription) {
    //  setShowPackages(false);
    //  return;
    //}

    handleSubCategory(category, subcategory);
    onClose();
  };
  const [activePackage, setActivePackage] = useState<Package | null>(null);
  const [activeButton, setActiveButton] = useState(0);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 week");
  const createdAt = new Date(user?.transaction?.createdAt || new Date());
  const periodInDays = parseInt(user?.transaction?.period) || 0;
  const expiryDate = new Date(createdAt.getTime() + periodInDays * 24 * 60 * 60 * 1000);
  const currentTime = new Date();
  const remainingTime = expiryDate.getTime() - currentTime.getTime();
  const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));


  const [Plan, setplan] = useState("Free");
  const [PlanId, setplanId] = useState(FreePackId);
  const [Priority_, setpriority] = useState(0);
  const [Adstatus_, setadstatus] = useState("Active");
  const [priceInput, setPriceInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [ExpirationDate_, setexpirationDate] = useState(new Date());

  const currDate = new Date();
  // Add one month to the current date
  let expirationDate = new Date(currDate);
  // expirationDate.setMonth(currDate.getMonth() + 1);
  expirationDate.setDate(currDate.getDate() + 7);

  useEffect(() => {
    setShowVerify(true);
    setShowPackages(true);
    setadstatus("Pending");
    setActivePackage(packagesList[1] || "Free");
    setplanId(packagesList[1]?._id || FreePackId);
    setplan(packagesList[1]?.name || "Free");
    setpriority(packagesList[1]?.priority || 1);
    setexpirationDate(expirationDate);
    packagesList[1]?.price.forEach((price: any, index: number) => {
      if (index === activeButton) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  }, []);
  const handleClick = (pack: Package) => {

    if (pack.name === "Free") {
      setadstatus("Active");
    } else {
      setadstatus("Pending");
    }
    setActivePackage(pack);
    setplanId(pack._id);
    setplan(pack.name);
    setpriority(pack.priority);
    setexpirationDate(expirationDate);
    pack.price.forEach((price: any, index: number) => {
      if (index === activeButton) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  };
  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);
    activePackage?.price.forEach((price: any, indexx: number) => {
      if (indexx === index) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  };
  const router = useRouter();
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => {
    setIsOpenP(false);
  };
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="dark:bg-[#131B1E]">
        <div className="mx-auto w-full max-w-md">
          {!showVerify && (
            <div className="p-4 items-center justify-center w-full">
              <DrawerHeader>
                <DrawerTitle>Account Not Verified</DrawerTitle>
                <DrawerDescription>
                  You need to verify your account to view requests.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col gap-4 w-full items-center">
                <button
                  onClick={() =>
                    handlePay(
                      VerificationPackId,
                      "Verification",
                      "0",
                      user.user?.fee
                    )
                  }
                  className="w-full flex flex-col gap-2 justify-enter items-center bg-orange-500 text-white hover:bg-orange-600 py-3 px-4 rounded-lg shadow"
                >
                  {isSending ? (
                    <div className="flex gap-2 items-center">
                      <CircularProgress
                        sx={{ color: "white" }}
                        size={24}
                      />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <CheckCircleIcon sx={{ marginRight: "5px" }} />
                      Verify Now
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {(showVerify && showPackages) && (
            <div className="p-4">
              <DrawerHeader>
                <DrawerTitle>{subcategory === "bids" ? (<>Auction</>) : (<>{capitalizeFirstLetter(subcategory)}</>)}</DrawerTitle>
                <DrawerDescription>

                  {subcategory === "Donated Items" ? (<>
                    <p className="mt-1 text-sm text-gray-800 leading-relaxed">
                      Give out items you no longer use — they can be of help to a needy person.
                      <span className="block mt-1 text-xs text-gray-900">
                        E.g. Equipment, Electronics, Furniture, Clothes, Baby-walker, etc.
                      </span>
                    </p>
                  </>) : (<>  What would you like to do?</>)}
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col gap-4 w-full items-center">

                {currentUser ? (<> <button
                  onClick={handlePostRequest}
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 py-2 px-4 rounded"
                >
                  {subcategory === "Donated Items" ? (
                    <>
                      <p>Post Items to Donate</p>
                    </>
                  ) : subcategory === "bids" ? (
                    <>
                      <p>Post Item on Auction</p>
                    </>
                  ) : (
                    <>Post {subcategory}</>
                  )}


                </button>
                  <button
                    onClick={handleViewRequests}
                    disabled={isSending}
                    className="w-full text-orange-500 bg-white border border-orange-500 hover:bg-[#FAE6DA] py-2 px-4 rounded  disabled:opacity-50"
                  >
                    {isSending ? ("Checking...") : (<>{subcategory === "bids" ? (<>View Items on Auction</>) : (<>View {subcategory}</>)}</>)}

                  </button></>) : (
                  <> <button

                    onClick={() => {
                      setIsOpenP(true);
                      router.push("/auth");
                    }}
                    className="w-full bg-orange-500 text-white hover:bg-orange-600 py-2 px-4 rounded"
                  >
                    {subcategory === "Donated Items" ? (
                      <>
                        <p>Post Items to Donate</p>
                      </>
                    ) : subcategory === "bids" ? (
                      <>
                        <p>Post Item on Auction</p>
                      </>
                    ) : (
                      <>Post {subcategory}</>
                    )}

                  </button>
                    <button

                      onClick={() => {
                        setIsOpenP(true);
                        router.push("/auth");
                      }}
                      disabled={isSending}
                      className="w-full text-orange-500 bg-white border border-orange-500 hover:bg-[#FAE6DA] py-2 px-4 rounded disabled:opacity-50"
                    >
                      {isSending ? ("Checking...") : (<>{subcategory === "bids" ? (<>View Items on Auction</>) : (<>View {subcategory}</>)}</>)}


                    </button>
                    <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} /></>
                )}

              </div>

            </div>
          )}

          {!showPackages && (
            <div className="p-4 text-center text-gray-600">

              <DrawerHeader>
                <DrawerTitle>Subscription Required</DrawerTitle>
                <DrawerDescription>
                  <p>You need a subscription to view requests.</p>
                </DrawerDescription>
              </DrawerHeader>

              <div className="w-full mt-2 p-0 dark:text-gray-100 rounded-lg">


                {/* No Promo */}
                <div className="w-full">
                  {packagesList.length > 0 &&
                    packagesList.slice(1).map((pack: any, index: number) => {
                      const issamepackage = user.currentpack.name === pack.name;

                      return (
                        <div
                          key={index}
                          className={`mb-2 dark:bg-[#2D3236] border bg-white rounded-lg cursor-pointer ${activePackage === pack
                            ? "bg-[#F2FFF2] border-orange-600 border-2"
                            : ""
                            }`}
                        >
                          <div
                            onClick={() =>
                              (!issamepackage && pack.name === "Free") ||
                                (issamepackage && pack.name === "Free" && (user.currentpack.list - user.ads) === 0)
                                ? handleClick(pack)
                                : handleClick(pack)
                            }
                            className="flex justify-between items-center w-full"
                          >
                            {/* Left Column: Package Details */}
                            <div className="p-3">
                              <p className="text-gray-700 font-semibold dark:text-gray-300">
                                {pack.name}
                              </p>
                              <ul className="flex flex-col gap-1 p-1">
                                {pack.features.slice(0, 1).map((feature: any, i: number) => (
                                  <li key={i} className="flex items-center gap-1">
                                    <DoneOutlinedIcon />
                                    <p className="text-sm">{feature.title}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Right Column: Status and Price */}
                            <div className="p-3">
                              <div className="text-gray-600 mb-1">
                                <div className="flex gap-2 text-sm">
                                  {remainingDays > 0 && pack.name === user.currentpack.name ? (
                                    <div className="p-1 flex-block rounded-full bg-orange-500">
                                      <p className="text-white text-xs">Active</p>
                                    </div>
                                  ) : (
                                    <>
                                      {(!issamepackage && pack.name === "Free") ||
                                        (issamepackage &&
                                          pack.name === "Free" &&
                                          (user.currentpack.list - user.ads) === 0) ? null : issamepackage &&
                                            pack.name === "Free" &&
                                            (user.currentpack.list - user.ads) > 0 ? null : null}
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Price Display */}
                              <div className="text-center">
                                {pack.name !== "Free" && (
                                  <div className="text-gray-800 font-bold mb-0">
                                    <ul className="flex flex-col items-center gap-0 py-0">
                                      {pack.price.map((price: any, i: number) => (
                                        <li
                                          key={i}
                                          className={`flex items-center gap-0 ${i !== activeButton ? "hidden" : ""
                                            }`}
                                        >
                                          <p
                                            className={`font-semibold ${activePackage === pack
                                              ? "text-orange-500"
                                              : "text-gray-800 dark:text-gray-400"
                                              }`}
                                          >
                                            Ksh {price.amount.toLocaleString()}/ {activeButtonTitle}
                                          </p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Button Group */}
                          {pack.name !== "Free" && activePackage === pack && (
                            <div className="flex flex-wrap justify-end items-center p-2">
                              <button
                                className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 0
                                  ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                  : "border border-orange-500 text-orange-500 rounded-full p-2"
                                  }`}
                                onClick={() => handleButtonClick(0, "1 week")}
                              >
                                1 week
                              </button>
                              <button
                                className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 1
                                  ? "bg-gradient-to-b from-orange-600 to-orange-500 text-white p-2 rounded-full"
                                  : "border border-orange-500 text-orange-500 rounded-full p-2"
                                  }`}
                                onClick={() => handleButtonClick(1, "1 month")}
                              >
                                1 month
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <button
                onClick={() =>
                  handlePay(
                    PlanId,
                    Plan,
                    periodInput,
                    priceInput
                  )
                }
                className="w-full mt-3 hover:bg-orange-600 bg-orange-500 text-white px-4 py-2 rounded-sm"
              >
                Subscribe Now
              </button>
            </div>
          )}

          <DrawerFooter>
            <Button onClick={() => {
              onClose();
              setShowVerify(true);
              setShowPackages(true);
            }} variant="outline">
              Cancel
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
