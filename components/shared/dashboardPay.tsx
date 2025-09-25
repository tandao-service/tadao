"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { Button } from "../ui/button";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";
import { formatKsh } from "@/lib/help";
import { requestOrder } from "@/lib/actions/requestOrder";
import { updateOrder } from "@/lib/actions/transactions.actions";

type Trans = {
  amount: number;
  plan: string;
  planId?: { list: string };
  period?: string;
  orderTrackingId: string;
  merchantId: string;
  status: "Pending" | "Failed" | "Paid" | string;
};

type User = {
  _id: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
};

type ReceiptData = {
  orderId?: string;
  amount?: number;
  transactionId?: string;
  phone?: string;
  date?: string;
};

type PayProps = {
  userId: string;
  recipientUid: string;
  trans: Trans[];
  user: User;
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

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Failed:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Paid:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        }`}
    >
      {status}
    </span>
  );
};

const Row = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div className="flex items-start justify-between py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value ?? "—"}</span>
  </div>
);

const DashboardPay = ({
  userId,
  trans,
  user,
  onClose,
  recipientUid,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  handleOpenSell,
  handleOpenChat,
  handleOpenBook,
  handleOpenPlan,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
}: PayProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stkresponse, setStkresponse] = useState("");
  const [errorStkresponse, setErrorStkresponse] = useState("");
  const [receiptData, setReceiptData] = useState<ReceiptData>({});

  const t = trans?.[0];
  const pay = t?.status ?? "Pending";

  const handlePay = async () => {
    if (!t) return;
    try {
      setIsSubmitting(true);
      setErrorStkresponse("");
      setStkresponse("");

      const orderDetails = {
        id: t.orderTrackingId,
        currency: "KES",
        amount: t.amount,
        description: t.plan || "Tadao Payment",
        callback_url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}successful`,
        notification_id: "",
        billing_address: {
          email: user?.email ?? "",
          phone_number: user?.phone ?? "+254720672621",
          first_name: user?.firstName ?? "",
          last_name: user?.lastName ?? "",
        },
      };

      const response = await requestOrder(orderDetails);
      await updateOrder(t.merchantId, response.order_tracking_id);

      if (response.redirect_url && response.redirect_url !== "error") {
        window.location.href = response.redirect_url;
      } else {
        throw new Error("Invalid redirect URL");
      }
    } catch (err: any) {
      setErrorStkresponse(err?.message ?? "Error processing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty state
  if (!t) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar
          user={user}
          userstatus={user?.status ?? "User"}
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
        <main className="max-w-2xl mx-auto px-4 pt-20">
          <div className="rounded-lg border p-8 text-center">
            <h2 className="text-lg font-semibold">No order found</h2>
            <p className="text-sm text-muted-foreground mt-1">
              There’s nothing to pay right now.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
      <div className="fixed top-0 inset-x-0 z-50">
        <Navbar
          user={user}
          userstatus={user?.status ?? "User"}
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

      <div className="max-w-3xl mx-auto px-4 pt-20 pb-10">
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

        {/* Alerts */}
        {errorStkresponse && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
          >
            {errorStkresponse}
          </div>
        )}
        {stkresponse && (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200"
          >
            {stkresponse}
          </div>
        )}

        {/* Order Summary */}
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-sm font-medium text-muted-foreground">
              Order Summary
            </h2>
            <StatusPill status={pay} />
          </div>

          <div className="px-4 py-2">
            <Row label="Plan" value={t.plan} />
            {t.plan === "Verification" ? (
              <Row label="Description" value="One-time account verification fee" />
            ) : (
              <>
                <Row label="Period" value={t.period} />
                <Row label="Allowable Ads" value={t.planId?.list} />
              </>
            )}
            <Row label="Amount" value={formatKsh(t.amount)} />
          </div>
        </section>

        {/* Actions / Receipt */}
        {pay === "Pending" ? (
          <section className="mt-4">
            <Button
              onClick={handlePay}
              className="w-full"
              disabled={isSubmitting || !t.amount || !t.orderTrackingId}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Redirecting to payment…" : "Pay now"}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              You’ll be securely redirected to complete your payment.
            </p>
          </section>
        ) : (
          <section
            className="mt-4 rounded-xl border bg-card text-card-foreground shadow-sm"
            aria-live="polite"
          >
            <div className="px-4 py-3 border-b">
              <h2 className="text-sm font-medium text-muted-foreground">
                Payment Receipt
              </h2>
            </div>
            <div className="px-4 py-3 space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Receipt ID:</span>{" "}
                <span className="font-medium">
                  #{receiptData.orderId ?? t.orderTrackingId}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Amount Paid:</span>{" "}
                <span className="font-medium">
                  KES {formatKsh(receiptData.amount ?? t.amount)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Transaction Id:</span>{" "}
                <span className="font-medium">
                  {receiptData.transactionId ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>{" "}
                <span className="font-medium">
                  {receiptData.phone ?? user?.phone ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>{" "}
                <span className="font-medium">
                  {receiptData.date ?? new Date().toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Payment Method:</span>{" "}
                <span className="font-medium">M-Pesa</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Successful
                </span>
              </div>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <Button variant="outline" className="w-full" onClick={onClose}>
                Home
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOpenShop(user)}
              >
                My Shop
              </Button>
            </div>
          </section>
        )}

        <Toaster />
      </div>
    </main>
  );
};

export default DashboardPay;
