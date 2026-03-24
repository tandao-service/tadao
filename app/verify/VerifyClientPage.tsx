"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import { format, isToday, isYesterday } from "date-fns";

import TopBar from "@/components/home/TopBar.client";
import { useAuth } from "@/app/hooks/useAuth";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { getVerfiesfee } from "@/lib/actions/verifies.actions";
import { VerificationPackId } from "@/constants";

export default function VerifyClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [activationFee, setActivationFee] = useState("500");
    const [loadingFee, setLoadingFee] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const redirectParam = searchParams.get("redirect_url");
    const redirectTo =
        redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

    const userId = user?._id || user?.clerkId || "";

    const isVerified = useMemo(() => {
        return Boolean(user?.verified?.some((v: any) => v?.accountverified === true));
    }, [user]);

    useEffect(() => {
        let mounted = true;

        const fetchFee = async () => {
            try {
                setLoadingFee(true);
                const feeData = await getVerfiesfee();
                const feeValue = feeData?.[0]?.fee;

                if (mounted && feeValue != null) {
                    setActivationFee(String(feeValue));
                }
            } catch (error) {
                console.error("Failed to fetch verification fee", error);
            } finally {
                if (mounted) {
                    setLoadingFee(false);
                }
            }
        };

        fetchFee();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (user && isVerified && redirectTo) {
            const timer = setTimeout(() => {
                router.replace(redirectTo);
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [user, isVerified, redirectTo, router]);

    const verifiedDateText = useMemo(() => {
        try {
            const verifiedDate = user?.verified?.find(
                (v: any) => v?.accountverified === true
            )?.verifieddate;

            if (!verifiedDate) return "";

            const createdAtDate = new Date(verifiedDate);

            if (isToday(createdAtDate)) {
                return "Today " + format(createdAtDate, "HH:mm");
            }
            if (isYesterday(createdAtDate)) {
                return "Yesterday " + format(createdAtDate, "HH:mm");
            }

            return format(createdAtDate, "dd-MM-yyyy HH:mm");
        } catch {
            return "";
        }
    }, [user]);

    function generateRandomOrderId() {
        const timestamp = Date.now();
        return `MERCHANT_${userId}_${timestamp}`;
    }

    const handlePay = async () => {
        if (!user) {
            router.push(
                `/auth?redirect_url=${encodeURIComponent(
                    `/verify?redirect_url=${encodeURIComponent(redirectTo)}`
                )}`
            );
            return;
        }

        if (!userId) return;

        try {
            setIsSending(true);

            const referenceId = generateRandomOrderId();

            const trans = {
                orderTrackingId: referenceId,
                amount: Number(activationFee),
                plan: "Verification",
                planId: VerificationPackId,
                period: "0",
                buyerId: userId,
                merchantId: referenceId,
                status: "Pending",
                createdAt: new Date(),
            };

            const response = await createTransaction(trans);

            if (response?.status === "Pending") {
                router.push(
                    `/pay/${response.merchantId}?redirect_url=${encodeURIComponent(
                        redirectTo
                    )}`
                );
            }
        } catch (error) {
            console.error("Verification payment error:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <TopBar />

            <main className="mx-auto max-w-6xl px-4 pt-[calc(var(--topbar-h,64px)+18px)] pb-10">
                <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-[0_18px_60px_rgba(16,185,129,0.10)]">
                    <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-8">
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                                    <WorkspacePremiumOutlinedIcon sx={{ fontSize: 14 }} />
                                    Account Verification
                                </div>

                                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                                    Verify your account and build buyer trust
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                                    Verified accounts look more trustworthy, unlock protected
                                    areas like donations and lost &amp; found, and help you
                                    attract more confident buyers and sellers.
                                </p>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-4 shadow-sm">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Status
                                        </div>
                                        <div className="mt-2 text-sm font-extrabold text-slate-900">
                                            {isVerified ? "Verified" : "Unverified"}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-4 shadow-sm">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Verification fee
                                        </div>
                                        <div className="mt-2 text-sm font-extrabold text-slate-900">
                                            {loadingFee
                                                ? "Loading..."
                                                : `KSh ${Number(activationFee).toLocaleString()}`}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-4 shadow-sm">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Redirect after verify
                                        </div>
                                        <div className="mt-2 truncate text-sm font-extrabold text-slate-900">
                                            {redirectTo}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                <GppGoodOutlinedIcon />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-slate-900">
                                                    Protected access
                                                </h3>
                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    Access verified-only sections like Donations and Lost
                                                    &amp; Found.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                                                <LockOutlinedIcon />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-slate-900">
                                                    Higher confidence
                                                </h3>
                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    Let users know your account is genuine and trusted on
                                                    the platform.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
                            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-200/40 blur-2xl" />
                            <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-green-200/30 blur-2xl" />

                            {isVerified ? (
                                <div className="relative">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-green-700">
                                        <VerifiedUserOutlinedIcon sx={{ fontSize: 14 }} />
                                        Verified Account
                                    </div>

                                    <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                                        Your account is already verified
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Your profile has already been verified and can access
                                        verified-only features.
                                    </p>

                                    {verifiedDateText ? (
                                        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                            Verified since{" "}
                                            <span className="font-bold">{verifiedDateText}</span>
                                        </div>
                                    ) : null}

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Link
                                            href={redirectTo}
                                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
                                        >
                                            Continue
                                            <ArrowForwardOutlinedIcon
                                                sx={{ fontSize: 18, marginLeft: "8px" }}
                                            />
                                        </Link>

                                        <Link
                                            href="/"
                                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Go Home
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                                        <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
                                        Unverified Account
                                    </div>

                                    <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                                        Verify now to unlock trusted access
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Complete verification once and continue using protected
                                        platform features with more trust and visibility.
                                    </p>

                                    <div className="mt-5 space-y-3">
                                        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
                                            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-700">
                                                1
                                            </div>
                                            <p className="text-sm leading-6 text-slate-700">
                                                Pay the one-time verification fee.
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
                                            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-700">
                                                2
                                            </div>
                                            <p className="text-sm leading-6 text-slate-700">
                                                Your account gets marked as verified after successful
                                                processing.
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
                                            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-700">
                                                3
                                            </div>
                                            <p className="text-sm leading-6 text-slate-700">
                                                Continue straight to the page you wanted to open.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 px-4 py-4">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                            Verification fee
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                                            {loadingFee
                                                ? "Loading..."
                                                : `KSh ${Number(activationFee).toLocaleString()}`}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {!user ? (
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/auth?redirect_url=${encodeURIComponent(
                                                            `/verify?redirect_url=${encodeURIComponent(
                                                                redirectTo
                                                            )}`
                                                        )}`
                                                    )
                                                }
                                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
                                            >
                                                Sign in to verify
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handlePay}
                                                disabled={isSending || loadingFee}
                                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                                            >
                                                {isSending ? (
                                                    <>
                                                        <CircularProgress size={18} color="inherit" />
                                                        <span className="ml-2">Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircleIcon
                                                            sx={{ fontSize: 18, marginRight: "8px" }}
                                                        />
                                                        Verify Now
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <Link
                                            href={redirectTo}
                                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Maybe later
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}