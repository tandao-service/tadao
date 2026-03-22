"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { createTransaction } from "@/lib/actions/transactions.actions";

type PackagePrice = {
  amount: number | string;
  period: string;
};

type PackageFeature = {
  checked: boolean;
  title: string;
};

type Package = {
  imageUrl?: string;
  name: string;
  _id: string;
  description: string;
  price: PackagePrice[];
  features: PackageFeature[];
  color?: string;
};

type PackProps = {
  packagesList: Package[];
  userId: string;
  daysRemaining: number;
  packname: string;
  user: any;
};

const PERIOD_OPTIONS = [
  { index: 0, label: "1 week" },
  { index: 1, label: "1 month" },
  { index: 2, label: "3 months" },
  { index: 3, label: "6 months" },
  { index: 4, label: "1 year" },
];

export default function Listpackages({
  packagesList,
  userId,
  packname,
  daysRemaining,
  user,
}: PackProps) {
  const router = useRouter();

  const firstPaidPackage = useMemo(() => {
    return packagesList.find((pack) => pack.name !== "Free") || packagesList[0] || null;
  }, [packagesList]);

  const [activeButton, setActiveButton] = useState(1);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 month");
  const [activePackage, setActivePackage] = useState<Package | null>(firstPaidPackage);

  const selectedPrice = useMemo(() => {
    if (!activePackage?.price?.length) return null;
    return activePackage.price[activeButton] || activePackage.price[0] || null;
  }, [activePackage, activeButton]);

  const priceInput = selectedPrice ? String(selectedPrice.amount ?? "") : "";
  const periodInput = selectedPrice ? String(selectedPrice.period ?? "") : "";
  const packIdInput = activePackage?._id || "";
  const packNameInput = activePackage?.name || "";

  useEffect(() => {
    if (!firstPaidPackage) {
      setActivePackage(null);
      return;
    }
    setActivePackage(firstPaidPackage);
  }, [firstPaidPackage]);

  useEffect(() => {
    if (!activePackage?.price?.length) return;

    if (!activePackage.price[activeButton]) {
      const fallbackIndex = activePackage.price.length > 1 ? 1 : 0;
      setActiveButton(fallbackIndex);
      setActiveButtonTitle(PERIOD_OPTIONS[fallbackIndex]?.label || "1 month");
    }
  }, [activePackage, activeButton]);

  const handlepay = async (
    packageId: string,
    packageName: string,
    period: string,
    price: string
  ) => {
    if (!packageId || !packageName || !period || !price) return;

    const generateRandomOrderId = () => {
      const timestamp = Date.now();
      return `MERCHANT_${userId}_${timestamp}`;
    };

    const customerId = generateRandomOrderId();

    const trans = {
      orderTrackingId: customerId,
      amount: Number(price),
      plan: packageName,
      planId: packageId,
      period,
      buyerId: userId,
      merchantId: customerId,
      status: "Pending",
      createdAt: new Date(),
    };

    try {
      const response = await createTransaction(trans);

      if (response?.status === "Pending" && response?.orderTrackingId) {
        router.push(`/pay/${response.orderTrackingId}`);
      }
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);
  };

  const handlePackageClick = (pack: Package) => {
    if (pack.name === "Free") return;
    setActivePackage(pack);
  };

  const isCurrentPlan = (pack: Package) => {
    if (daysRemaining > 0 && pack.name === packname) return true;
    if (pack.name === "Free" && daysRemaining <= 0) return true;
    return false;
  };

  const canBuy =
    !!user &&
    !!activePackage &&
    activePackage.name !== "Free" &&
    !!priceInput &&
    !!periodInput;

  return (
    <div className="pb-36">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {packagesList.length > 0 ? (
          packagesList.map((pack) => {
            const isSelected = activePackage?._id === pack._id;
            const activePackPrice =
              pack.price?.[activeButton] || pack.price?.[0] || null;
            const displayAmount = activePackPrice?.amount
              ? Number(activePackPrice.amount).toLocaleString()
              : null;

            return (
              <div
                key={pack._id}
                onClick={() => handlePackageClick(pack)}
                className={`group relative overflow-hidden rounded-[28px] border bg-white transition-all duration-200 ${pack.name !== "Free" ? "cursor-pointer" : "cursor-default"
                  } ${isSelected
                    ? "border-orange-500 shadow-[0_20px_60px_rgba(249,115,22,0.18)] ring-2 ring-orange-100"
                    : "border-slate-200 shadow-sm hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                  }`}
              >
                {isSelected && pack.name !== "Free" ? (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Selected
                  </div>
                ) : null}

                <div
                  className={`px-5 py-5 text-white ${isSelected
                    ? "bg-gradient-to-r from-orange-600 to-orange-500"
                    : "bg-gradient-to-r from-slate-800 to-slate-700"
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                        Package
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold">{pack.name}</h3>
                    </div>

                    {isCurrentPlan(pack) ? (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                        Active
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm text-white/85">{pack.description}</p>

                  {pack.name !== "Free" && displayAmount ? (
                    <div className="mt-5">
                      <p className="text-xs font-medium text-white/70">
                        Starting from
                      </p>
                      <p className="mt-1 text-3xl font-extrabold">
                        Ksh {displayAmount}
                      </p>
                      <p className="mt-1 text-sm text-white/80">
                        / {activeButtonTitle}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <p className="text-3xl font-extrabold">Free</p>
                      <p className="mt-1 text-sm text-white/80">
                        Basic access for getting started
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {pack.name !== "Free" ? (
                    <div className="mb-5 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                      Click this card to select this package.
                    </div>
                  ) : (
                    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      This is the default package.
                    </div>
                  )}

                  <ul className="space-y-4">
                    {pack.features?.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${feature.checked
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-500"
                            }`}
                        >
                          {feature.checked ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </span>

                        <p className="text-sm leading-6 text-slate-700">
                          {feature.title}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan(pack) ? (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {pack.name === "Free" && daysRemaining <= 0
                        ? "You are currently using the Free plan."
                        : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"
                        } remaining on this plan.`}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No packages available
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Packages will appear here once they are added.
            </p>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-orange-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const isActive = activeButton === option.index;
              const isAvailable = !!activePackage?.price?.[option.index];

              return (
                <button
                  key={option.index}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleButtonClick(option.index, option.label)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : isAvailable
                      ? "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                      : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-500">Ksh</span>
              <input
                type="text"
                value={priceInput ? Number(priceInput).toLocaleString() : ""}
                disabled
                className="w-[140px] bg-transparent text-base font-bold text-slate-900 outline-none md:w-[180px]"
              />
            </div>

            {user ? (
              <Button
                type="button"
                onClick={() =>
                  handlepay(packIdInput, packNameInput, periodInput, priceInput)
                }
                disabled={!canBuy}
                className="h-12 rounded-2xl bg-orange-500 px-6 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy Now
              </Button>
            ) : (
              <Button
                asChild
                className="h-12 rounded-2xl bg-orange-500 px-6 text-sm font-bold text-white hover:bg-orange-600"
              >
                <Link href="/auth">Pay Now</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}