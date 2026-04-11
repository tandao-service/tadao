"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    confirmPasswordReset,
    verifyPasswordResetCode,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { getAuthSafe } from "@/lib/firebase";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function SetPasswordInner() {
    const searchParams = useSearchParams();

    const mode = searchParams.get("mode") || "";
    const oobCode = searchParams.get("oobCode") || "";
    const continueUrl = searchParams.get("continueUrl") || "/auth";

    const [auth, setAuth] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [checking, setChecking] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const pageTitle = useMemo(() => {
        return "Set Your Password";
    }, []);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const bundle: any = await getAuthSafe();
                if (!mounted) return;

                await setPersistence(bundle.auth, browserLocalPersistence);
                setAuth(bundle.auth);

                if (!oobCode || mode !== "resetPassword") {
                    setError("This password link is invalid or incomplete.");
                    setChecking(false);
                    return;
                }

                const restoredEmail = await verifyPasswordResetCode(bundle.auth, oobCode);
                if (!mounted) return;

                setEmail(restoredEmail);
                setChecking(false);
            } catch (err: any) {
                console.error("Verify reset code error:", err);
                if (!mounted) return;

                const code = String(err?.code || "").toLowerCase();
                if (
                    code === "auth/expired-action-code" ||
                    code === "auth/invalid-action-code"
                ) {
                    setError("This password link is invalid or has expired.");
                } else {
                    setError("Unable to verify this password link.");
                }
                setChecking(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [mode, oobCode]);

    const getFriendlyError = (codeOrMessage: string) => {
        const value = String(codeOrMessage || "").toLowerCase();

        switch (value) {
            case "auth/weak-password":
                return "Password should be at least 6 characters.";
            case "auth/expired-action-code":
            case "auth/invalid-action-code":
                return "This password link is invalid or has expired.";
            case "auth/network-request-failed":
                return "Network error. Please check your internet connection.";
            default:
                return "Unable to set password. Please try again.";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth || !oobCode || loading) return;

        setError("");
        setSuccess("");

        if (!password) {
            setError("Please enter your new password.");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode, password);
            setSuccess("Your password has been set successfully.");
        } catch (err: any) {
            console.error("Confirm password reset error:", err);
            setError(getFriendlyError(err?.code || err?.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-orange-100 p-6 sm:p-8">
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="/logo.jpg"
                        alt="Tadao Market"
                        className="w-20 h-20 rounded-full object-cover border border-orange-100 shadow-sm mb-3"
                    />
                    <h1 className="text-3xl font-extrabold text-[#f97316] tracking-tight">
                        Tadao Market
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 text-center">
                        Secure your account
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    {pageTitle}
                </h2>

                <p className="text-sm text-center text-gray-500 mb-6">
                    {checking
                        ? "Checking your password link..."
                        : email
                            ? `Set a new password for ${email}`
                            : "Set your new password below."}
                </p>

                {error ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {success ? (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                ) : null}

                {checking ? (
                    <div className="flex flex-col items-center py-6">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                    </div>
                ) : success ? (
                    <div className="space-y-3">
                        <Link
                            href={continueUrl.startsWith("/") ? continueUrl : "/auth"}
                            className="block w-full rounded-xl bg-[#f97316] px-4 py-3 font-bold text-white hover:opacity-95 text-center"
                        >
                            Continue to Sign In
                        </Link>

                        <Link
                            href="/auth"
                            className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 text-center"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                ) : !error || oobCode ? (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-orange-200"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#f97316]"
                            >
                                {showPassword ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-orange-200"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#f97316]"
                            >
                                {showConfirmPassword ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#f97316] px-4 py-3 font-bold text-white hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            )}
                            <span>Set Password</span>
                        </button>

                        <Link
                            href="/auth"
                            className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 text-center"
                        >
                            Back to Sign In
                        </Link>
                    </form>
                ) : (
                    <Link
                        href="/forgot-password"
                        className="block w-full rounded-xl bg-[#f97316] px-4 py-3 font-bold text-white hover:opacity-95 text-center"
                    >
                        Request New Link
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function SetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center px-4 py-10">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-orange-100 p-6 sm:p-8">
                        <div className="flex flex-col items-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                            <p className="mt-4 text-sm text-gray-500">Loading...</p>
                        </div>
                    </div>
                </div>
            }
        >
            <SetPasswordInner />
        </Suspense>
    );
}