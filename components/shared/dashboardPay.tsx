"use client";

import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatKsh } from "@/lib/help";
import { Toaster } from "../ui/toaster";
import { Button } from "../ui/button";
import { checkPaymentStatus } from "@/lib/actions/payment.actions";
import TopBar from "../home/TopBar.client";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Phone,
  Receipt,
  ShieldCheck,
} from "lucide-react";

// kept from your current flow
import { activateSubscription } from "@/lib/actions/subscription.actions";
import {
  completeSubscriptionAfterPayment,
  markTransactionPaid,
} from "@/lib/actions/transactions.actions";

type payProps = {
  userId: string;
  callbackurl: string;
  trans: any;
  user: any;
};

const DashboardPay = ({ callbackurl, trans, user }: payProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const tx = Array.isArray(trans) && trans.length > 0 ? trans[0] : null;

  const [deposit, setdeposit] = useState(tx?.amount ?? 0);
  const [stkresponse, setstkresponse] = useState("");
  const [errorstkresponse, errorsetstkresponse] = useState("");
  const [payphone, setpayphone] = useState("");
  const [errormpesaphone, seterrormpesaphone] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>({});
  const [pay, setpay] = useState(tx?.status ?? "Pending");
  const [countryCode, setCountryCode] = useState("254");

  const didActivateRef = useRef(false);

  const formatPhoneNumber = (input: any) => {
    const cleaned = String(input || "").replace(/\D/g, "");
    if (cleaned.length < 4) return cleaned;
    if (cleaned.length < 7) return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    if (cleaned.length < 11) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6)}`;
    }
    return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6, 10)}`;
  };

  function removeLeadingZero(numberString: string) {
    return numberString?.charAt(0) === "0"
      ? numberString.substring(1)
      : numberString;
  }

  function removeLeadingPlus(numberString: string) {
    return numberString?.charAt(0) === "+"
      ? numberString.substring(1)
      : numberString;
  }

  const handleTopup = async (e: any) => {
    e.preventDefault();

    if (payphone.trim() === "") {
      seterrormpesaphone("Enter M-Pesa phone number");
      return;
    }

    try {
      setisSubmitting(true);
      setstkresponse("");
      errorsetstkresponse("");
      seterrormpesaphone("");

      const res = await fetch("/api/safaricom/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountReference: tx.orderTrackingId,
          Amount: Number(deposit),
          Account: removeLeadingPlus(countryCode) + removeLeadingZero(payphone),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setstkresponse(
          "STK push sent to your phone. Check your M-Pesa prompt and enter your PIN to complete payment."
        );

        let attempts = 0;
        const maxAttempts = 10;

        const intervalId = setInterval(async () => {
          const paymentStatus: any = await checkPaymentStatus(tx.orderTrackingId);

          if (paymentStatus?.success === true) {
            clearInterval(intervalId);

            const done = await completeSubscriptionAfterPayment({
              orderTrackingId: tx.orderTrackingId,
            });

            setstkresponse("Payment completed successfully.");
            setdeposit("");
            setpayphone("");
            setpay("Active");
            setisSubmitting(false);

            const receipt = {
              orderId: tx.orderTrackingId,
              transactionId: paymentStatus.payment.transactionId,
              amount: tx.amount,
              date: new Date().toLocaleString(),
              phone: payphone,
            };

            setReceiptData(receipt);

            toast({
              title: "Payment successful!",
              description: done?.subscriptionActivated
                ? "Subscription activated. You can now continue."
                : "Payment completed successfully.",
              duration: 5000,
              className: "bg-[#f97316] text-white border-0",
            });

            setTimeout(() => {
              router.push(callbackurl);
            }, 1500);

            return;
          }

          if (++attempts >= maxAttempts) {
            clearInterval(intervalId);
            errorsetstkresponse(
              "Payment confirmation timed out. Please try again."
            );
            setstkresponse("");
            setisSubmitting(false);
          }
        }, 5000);
      } else {
        errorsetstkresponse(
          `Error initiating payment: ${data.errorMessage || "Unknown error"}`
        );
        setisSubmitting(false);
      }
    } catch (err: any) {
      setstkresponse("");
      errorsetstkresponse(`Error: ${err.message}`);
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.phone) {
      const cleanNumber = user.phone.startsWith("+")
        ? user.phone.slice(1)
        : user.phone;
      const c = cleanNumber.slice(0, 3);
      const localNumber = cleanNumber.slice(3);
      setCountryCode(c);
      setpayphone(formatPhoneNumber(localNumber));
    }
  }, [user]);

  if (!tx) {
    return (
      <>
        <TopBar />
        <main className="min-h-[calc(100vh-72px)] bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
            <div className="rounded-[28px] border border-orange-100 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Receipt className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                No order found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                We could not find payment details for this order.
              </p>
              <Button
                onClick={() => router.push("/plan")}
                className="mt-6 rounded-2xl bg-orange-500 px-6 text-white hover:bg-orange-600"
              >
                Back to packages
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const statusTone =
    pay === "Pending"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : pay === "Failed"
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <>
      <TopBar />

      <main className="min-h-[calc(100vh-72px)] bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-8">
          <section className="overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-r from-orange-500 to-orange-400 shadow-sm">
            <div className="px-6 py-8 text-white md:px-10 md:py-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                    <CreditCard className="h-4 w-4" />
                    Secure payment
                  </div>

                  <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
                    Complete Your Payment
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
                    Pay for your selected plan securely via M-Pesa Express and
                    continue with your listing.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">
                    Status
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-white">{pay}</p>
                  <p className="mt-1 text-sm text-orange-50">
                    Order: {tx.orderTrackingId}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review your package and payment details below.
                  </p>
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${statusTone}`}
                >
                  {pay}
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Plan
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                        {tx.plan}
                      </h3>
                    </div>

                    <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                      Tadao Market
                    </div>
                  </div>

                  {tx.plan !== "Verification" && (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-slate-500">Period</p>
                        <p className="mt-1 font-bold text-slate-900">
                          {tx.period || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-slate-500">Allowable Ads</p>
                        <p className="mt-1 font-bold text-slate-900">
                          {tx?.planId?.list ?? "-"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">Order Tracking ID</p>
                    <p className="text-right text-sm font-bold break-all text-slate-900">
                      {tx.orderTrackingId}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Total Amount
                    </p>
                    <p className="text-2xl font-extrabold text-orange-600">
                      {formatKsh(tx.amount)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm md:p-6">
              {pay === "Pending" ? (
                <>
                  <div className="border-b border-slate-100 pb-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                      <ShieldCheck className="h-4 w-4" />
                      M-Pesa Express
                    </div>

                    <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                      Pay with M-Pesa
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter the phone number that will receive the STK push.
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Phone className="h-4 w-4 text-orange-500" />
                        M-Pesa phone number
                      </div>

                      <TextField
                        label="M-Pesa Phone Number"
                        type="text"
                        value={payphone}
                        onChange={(e) =>
                          setpayphone(formatPhoneNumber(e.target.value))
                        }
                        variant="outlined"
                        placeholder="712345678"
                        className="w-full"
                      />

                      {errormpesaphone ? (
                        <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                          {errormpesaphone}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">
                          Amount to pay
                        </span>
                        <span className="text-xl font-extrabold text-slate-900">
                          {formatKsh(tx.amount)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleTopup}
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-2xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending request...
                        </span>
                      ) : (
                        "Pay Now"
                      )}
                    </Button>

                    {stkresponse ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {stkresponse}
                      </div>
                    ) : null}

                    {errorstkresponse ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorstkresponse}
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-slate-100 pb-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Payment complete
                    </div>

                    <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                      Payment Receipt
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Your payment was received successfully.
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="space-y-3 text-sm text-slate-700">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Receipt ID</span>
                        <span className="text-right font-bold text-slate-900">
                          #{receiptData.orderId || tx.orderTrackingId}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Amount Paid</span>
                        <span className="text-right font-bold text-slate-900">
                          {formatKsh(receiptData.amount || tx.amount)}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Transaction ID</span>
                        <span className="text-right font-bold break-all text-slate-900">
                          {receiptData.transactionId || "-"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Phone</span>
                        <span className="text-right font-bold text-slate-900">
                          {receiptData.phone || "-"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Date</span>
                        <span className="text-right font-bold text-slate-900">
                          {receiptData.date || new Date().toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Method</span>
                        <span className="text-right font-bold text-slate-900">
                          M-Pesa
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Status</span>
                        <span className="text-right font-bold text-emerald-600">
                          Successful
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push(callbackurl)}
                    className="mt-5 h-12 w-full rounded-2xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600"
                  >
                    Continue
                  </Button>
                </>
              )}
            </section>
          </div>
        </div>

        <Toaster />
      </main>
    </>
  );
};

export default DashboardPay;