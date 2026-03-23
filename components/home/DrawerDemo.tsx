"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
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
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { FreePackId, VerificationPackId } from "@/constants";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { getVerfiesfee } from "@/lib/actions/verifies.actions";

type PackagePrice = {
  amount: number | string;
  period: number | string;
};

type PackageFeature = {
  title: string;
};

type Package = {
  imageUrl?: string;
  name: string;
  _id: string;
  description?: string;
  price: PackagePrice[];
  features: PackageFeature[];
  color?: string;
  priority?: number;
};

type AppUser = {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  photo?: string;
  imageUrl?: string;
  status?: string;
  businessname?: string;
  aboutbusiness?: string;
  businessaddress?: string;
  latitude?: string;
  longitude?: string;
  businesshours?: {
    openHour: string;
    openMinute: string;
    closeHour: string;
    closeMinute: string;
  }[];
  businessworkingdays?: string[];
  phone?: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  verified?: { accountverified: boolean; verifieddate: string | Date }[];
  token?: string;
  notifications?: {
    email: boolean;
    fcm: boolean;
  };
  fee?: string | number;
  subscription?: {
    planId?: string | null;
    planName?: string;
    active?: boolean;
    expiresAt?: string | Date | null;
    remainingAds?: number;
    entitlements?: {
      maxListings?: number;
      priority?: number;
      topDays?: number;
      featuredDays?: number;
      autoRenewHours?: number | null;
    };
  };
  [key: string]: any;
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
  viewHref,
}: {
  category: string;
  subcategory: string;
  userId: string;
  user: AppUser | null;
  isOpen: boolean;
  packagesList: Package[];
  onClose: () => void;
  handlePayNow: (id: string) => void;
  handleSubCategory: (category: string, subcategory: string) => void;
  handleOpenSell: (category?: string, subcategory?: string) => void;
  viewHref?: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [showVerify, setShowVerify] = useState(true);
  const [showPackages, setShowPackages] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [activePackage, setActivePackage] = useState<Package | null>(null);
  const [activeButton, setActiveButton] = useState(0);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 week");

  const [plan, setPlan] = useState("Free");
  const [planId, setPlanId] = useState(FreePackId);
  const [priceInput, setPriceInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");

  const [activationFee, setActivationFee] = useState("500");
  const [loadingFee, setLoadingFee] = useState(false);

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function generateRandomOrderId() {
    const timestamp = Date.now();
    return `MERCHANT_${userId}_${timestamp}`;
  }

  const getPostHref = () => {
    if (subcategory === "bids") return "/create-ad";
    if (!category && !subcategory) return "/create-ad";

    return `/create-ad?category=${encodeURIComponent(
      category
    )}&subcategory=${encodeURIComponent(subcategory)}`;
  };

  const getViewHref = () => {
    if (viewHref) return viewHref;
    if (subcategory === "bids") return "/auction";
    if (subcategory === "Donated Items") return "/donations";
    if (subcategory === "Lost and Found Items") return "/lost-and-found";
    return "/";
  };

  const isVerified = useMemo(() => {
    return Boolean(user?.verified?.some((v) => v?.accountverified === true));
  }, [user]);

  const subscriptionInfo = useMemo(() => {
    const active = Boolean(user?.subscription?.active);
    const planName = user?.subscription?.planName || "";

    const expiresAtRaw = user?.subscription?.expiresAt;
    const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

    const hasValidExpiry =
      !!expiresAt &&
      !Number.isNaN(expiresAt.getTime()) &&
      expiresAt.getTime() > Date.now();

    const remainingAds =
      typeof user?.subscription?.remainingAds === "number"
        ? user.subscription.remainingAds
        : null;

    const hasRemainingAds = remainingAds === null ? true : remainingAds > 0;

    const hasActiveSubscription = active && hasValidExpiry && hasRemainingAds;

    return {
      active,
      planName,
      expiresAt,
      hasValidExpiry,
      remainingAds,
      hasRemainingAds,
      hasActiveSubscription,
    };
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoadingFee(true);
        const fee = await getVerfiesfee();
        if (mounted && fee != null) {
          setActivationFee(String(fee));
        }
      } catch (error) {
        console.error("Failed to fetch verification fee", error);
      } finally {
        if (mounted) {
          setLoadingFee(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setShowVerify(true);
    setShowPackages(true);

    const defaultPack = packagesList?.[1] || packagesList?.[0] || null;
    setActivePackage(defaultPack);
    setPlanId(defaultPack?._id || FreePackId);
    setPlan(defaultPack?.name || "Free");

    const defaultPrice = defaultPack?.price?.[activeButton];
    setPriceInput(String(defaultPrice?.amount ?? ""));
    setPeriodInput(String(defaultPrice?.period ?? ""));
  }, [packagesList, activeButton]);

  const handleClick = (pack: Package) => {
    setActivePackage(pack);
    setPlanId(pack._id);
    setPlan(pack.name);

    const selectedPrice = pack.price?.[activeButton];
    setPriceInput(String(selectedPrice?.amount ?? ""));
    setPeriodInput(String(selectedPrice?.period ?? ""));
  };

  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);

    const selectedPrice = activePackage?.price?.[index];
    setPriceInput(String(selectedPrice?.amount ?? ""));
    setPeriodInput(String(selectedPrice?.period ?? ""));
  };

  const handlePostRequest = () => {
    const postHref = getPostHref();

    if (!currentUser) {
      onClose();
      router.push(`/auth?redirect_url=${encodeURIComponent(postHref)}`);
      return;
    }

    if (subcategory === "bids") {
      handleOpenSell("", "");
    } else {
      handleOpenSell(category, subcategory);
    }

    onClose();
  };

  const handlePay = async (
    packIdInput: string,
    packNameInput: string,
    periodInputValue: string,
    priceInputValue: string
  ) => {
    const customerId = generateRandomOrderId();

    const trans = {
      orderTrackingId: customerId,
      amount: Number(priceInputValue),
      plan: packNameInput,
      planId: packIdInput,
      period: periodInputValue,
      buyerId: userId,
      merchantId: customerId,
      status: "Pending",
      createdAt: new Date(),
    };

    try {
      setIsSending(true);
      const response = await createTransaction(trans);

      if (response?.status === "Pending") {
        handlePayNow(response.merchantId);
        onClose();
      }
    } catch (error) {
      console.error("Error processing payment: ", error);
      toast({
        title: "Payment failed",
        description: "Could not start payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleViewRequests = () => {
    const targetViewHref = getViewHref();

    if (!currentUser) {
      onClose();
      router.push(`/auth?redirect_url=${encodeURIComponent(targetViewHref)}`);
      return;
    }

    if (!isVerified) {
      setShowVerify(false);
      setShowPackages(true);
      return;
    }

    if (!subscriptionInfo.hasActiveSubscription) {
      setShowVerify(true);
      setShowPackages(false);
      return;
    }

    handleSubCategory(category, subcategory);
    onClose();
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setShowVerify(true);
          setShowPackages(true);
        }
      }}
    >
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
                      activationFee
                    )
                  }
                  disabled={isSending || loadingFee}
                  className="w-full flex flex-col gap-2 items-center bg-orange-500 text-white hover:bg-orange-600 py-3 px-4 rounded-lg shadow disabled:opacity-60"
                >
                  {isSending || loadingFee ? (
                    <div className="flex gap-2 items-center">
                      <CircularProgress sx={{ color: "white" }} size={24} />
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

          {showVerify && showPackages && (
            <div className="p-4">
              <DrawerHeader>
                <DrawerTitle>
                  {subcategory === "bids" ? "Auction" : capitalizeFirstLetter(subcategory)}
                </DrawerTitle>

                <DrawerDescription>
                  {subcategory === "Donated Items" ? (
                    <p className="mt-1 text-sm text-gray-800 leading-relaxed dark:text-gray-200">
                      Give out items you no longer use — they can be of help to a needy person.
                      <span className="block mt-1 text-xs text-gray-900 dark:text-gray-300">
                        E.g. Equipment, Electronics, Furniture, Clothes, Baby-walker, etc.
                      </span>
                    </p>
                  ) : (
                    <>What would you like to do?</>
                  )}
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex flex-col gap-4 w-full items-center">
                <button
                  onClick={handlePostRequest}
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 py-2 px-4 rounded"
                >
                  {subcategory === "Donated Items"
                    ? "Post Items to Donate"
                    : subcategory === "bids"
                      ? "Post Item on Auction"
                      : `Post ${subcategory}`}
                </button>

                <button
                  onClick={handleViewRequests}
                  disabled={isSending}
                  className="w-full text-orange-500 bg-white border border-orange-500 hover:bg-[#FAE6DA] py-2 px-4 rounded disabled:opacity-50"
                >
                  {isSending
                    ? "Checking..."
                    : subcategory === "bids"
                      ? "View Items on Auction"
                      : `View ${subcategory}`}
                </button>
              </div>
            </div>
          )}

          {!showPackages && (
            <div className="p-4 text-center text-gray-600">
              <DrawerHeader>
                <DrawerTitle>Subscription Required</DrawerTitle>
                <DrawerDescription>
                  <div className="space-y-1">
                    <p>You need a subscription to view requests.</p>

                    {!subscriptionInfo.active && (
                      <p className="text-xs text-red-500">No active subscription found.</p>
                    )}

                    {subscriptionInfo.active && !subscriptionInfo.hasValidExpiry && (
                      <p className="text-xs text-red-500">Your subscription has expired.</p>
                    )}

                    {subscriptionInfo.active &&
                      subscriptionInfo.hasValidExpiry &&
                      !subscriptionInfo.hasRemainingAds && (
                        <p className="text-xs text-red-500">
                          Your subscription has no remaining ads.
                        </p>
                      )}
                  </div>
                </DrawerDescription>
              </DrawerHeader>

              <div className="w-full mt-2 p-0 dark:text-gray-100 rounded-lg">
                <div className="w-full">
                  {packagesList.length > 0 &&
                    packagesList
                      .filter((pack) => pack.name !== "Free")
                      .map((pack, index) => {
                        const isSamePackage = user?.subscription?.planName === pack.name;
                        const isCurrentActive =
                          isSamePackage && subscriptionInfo.hasActiveSubscription;

                        return (
                          <div
                            key={pack._id || index}
                            className={`mb-2 dark:bg-[#2D3236] border bg-white rounded-lg cursor-pointer ${activePackage?._id === pack._id
                              ? "bg-[#F2FFF2] border-orange-600 border-2"
                              : ""
                              }`}
                          >
                            <div
                              onClick={() => handleClick(pack)}
                              className="flex justify-between items-center w-full"
                            >
                              <div className="p-3">
                                <p className="text-gray-700 font-semibold dark:text-gray-300">
                                  {pack.name}
                                </p>

                                <ul className="flex flex-col gap-1 p-1">
                                  {pack.features?.slice(0, 1).map((feature, i) => (
                                    <li key={i} className="flex items-center gap-1">
                                      <DoneOutlinedIcon />
                                      <p className="text-sm">{feature.title}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-3">
                                <div className="text-gray-600 mb-1">
                                  <div className="flex gap-2 text-sm justify-end">
                                    {isCurrentActive ? (
                                      <div className="p-1 rounded-full bg-orange-500">
                                        <p className="text-white text-xs">Active</p>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="text-gray-800 font-bold mb-0">
                                    <ul className="flex flex-col items-center gap-0 py-0">
                                      {pack.price?.map((price, i) => (
                                        <li
                                          key={i}
                                          className={`flex items-center gap-0 ${i !== activeButton ? "hidden" : ""
                                            }`}
                                        >
                                          <p
                                            className={`font-semibold ${activePackage?._id === pack._id
                                              ? "text-orange-500"
                                              : "text-gray-800 dark:text-gray-400"
                                              }`}
                                          >
                                            Ksh {Number(price.amount).toLocaleString()}/{" "}
                                            {activeButtonTitle}
                                          </p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {activePackage?._id === pack._id && (
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
                onClick={() => handlePay(planId, plan, periodInput, priceInput)}
                disabled={isSending || !planId || !priceInput}
                className="w-full mt-3 hover:bg-orange-600 bg-orange-500 text-white px-4 py-2 rounded-sm disabled:opacity-60"
              >
                {isSending ? "Processing..." : "Subscribe Now"}
              </button>
            </div>
          )}

          <DrawerFooter>
            <Button
              onClick={() => {
                onClose();
                setShowVerify(true);
                setShowPackages(true);
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}