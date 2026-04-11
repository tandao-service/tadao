"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAuthSafe } from "@/lib/firebase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState<any>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const bundle: any = await getAuthSafe();
                if (!mounted) return;

                await setPersistence(bundle.auth, browserLocalPersistence);
                setAuth(bundle.auth);
            } catch (err) {
                console.error("Auth init error:", err);
                if (mounted) {
                    setError("Failed to initialize authentication. Please refresh the page.");
                }
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const getFriendlyError = (codeOrMessage: string) => {
        const value = String(codeOrMessage || "").toLowerCase();

        switch (value) {
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/user-not-found":
                return "No account was found with that email.";
            case "auth/too-many-requests":
                return "Too many attempts. Please wait a bit and try again.";
            case "auth/network-request-failed":
                return "Network error. Please check your internet connection.";
            default:
                return "Unable to send reset link. Please try again.";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth || loading) return;

        setError("");
        setSuccess("");

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, cleanEmail, {
                url: `${window.location.origin}/auth`,
                handleCodeInApp: false,
            });

            setSuccess("Password reset link sent. Please check your email.");
        } catch (err: any) {
            console.error("Password reset error:", err);
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
                        Reset your password
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Forgot Password
                </h2>
                <p className="text-sm text-center text-gray-500 mb-6">
                    Enter your email address and we’ll send you a password reset link.
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

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-orange-200"
                        disabled={loading}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || !auth}
                        className="w-full rounded-xl bg-[#f97316] px-4 py-3 font-bold text-white hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        <span>Send Reset Link</span>
                    </button>

                    <Link
                        href="/auth"
                        className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 text-center"
                    >
                        Back to Sign In
                    </Link>
                </form>
            </div>
        </div>
    );
}