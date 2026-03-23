"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithCredential,
    UserCredential,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    updateProfile,
    fetchSignInMethodsForEmail,
} from "firebase/auth";
import { getAuthSafe } from "@/lib/firebase";
import { createUser as createUserInDB } from "@/lib/actions/user.actions";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function AuthPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectParam = searchParams.get("redirect_url");
    const redirectTo =
        redirectParam && redirectParam.startsWith("/")
            ? redirectParam
            : "/";

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [authBundle, setAuthBundle] = useState<{
        auth: any;
        googleProvider: GoogleAuthProvider;
    } | null>(null);

    const formTitle = useMemo(
        () => (isSignUp ? "Create Account" : "Sign In"),
        [isSignUp]
    );

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            GoogleAuth.initialize({
                scopes: ["profile", "email"],
                grantOfflineAccess: true,
                clientId:
                    "1033579054775-p1lhnkja286tij6ta1ssfo1ld1vlkbm6.apps.googleusercontent.com",
            });
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const bundle: any = await getAuthSafe();
                if (!mounted) return;

                await setPersistence(bundle.auth, browserLocalPersistence);
                setAuthBundle(bundle);
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

    const toggleMode = () => {
        if (loading) return;
        setIsSignUp((prev) => !prev);
        setError("");
        setSuccess("");
    };

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const getFriendlyError = (codeOrMessage: string) => {
        const value = String(codeOrMessage || "").toLowerCase();

        switch (value) {
            case "auth/invalid-credential":
                return "Incorrect email or password.";
            case "auth/user-not-found":
                return "No account was found with that email.";
            case "auth/wrong-password":
                return "Incorrect password.";
            case "auth/email-already-in-use":
                return "This email is already registered. Please sign in instead.";
            case "auth/too-many-requests":
                return "Too many attempts. Please wait a bit and try again.";
            case "auth/operation-not-allowed":
                return "Email/password sign-in is currently disabled.";
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/weak-password":
                return "Password should be at least 6 characters.";
            case "auth/network-request-failed":
                return "Network error. Please check your internet connection.";
            case "auth/popup-closed-by-user":
                return "Google sign-in was cancelled before completion.";
            case "auth/popup-blocked":
                return "Popup was blocked by your browser. Please allow popups and try again.";
            case "auth/cancelled-popup-request":
                return "Another sign-in popup was already open.";
            case "auth/account-exists-with-different-credential":
                return "An account already exists with this email using a different sign-in method.";
            case "auth/invalid-login-credentials":
                return "Incorrect email or password.";
            case "auth/missing-password":
                return "Please enter your password.";
            case "auth/user-disabled":
                return "This account has been disabled.";
            default:
                if (value.includes("no id token")) {
                    return "Google sign-in failed. No ID token was returned.";
                }
                return "Something went wrong. Please try again.";
        }
    };

    const processUser = async (result: UserCredential) => {
        const user = result.user;
        const isNewUser = Boolean((result as any)?._tokenResponse?.isNewUser);

        if (isNewUser) {
            const displayName = user.displayName?.trim() || "";
            const nameParts = displayName.split(" ").filter(Boolean);

            await createUserInDB({
                clerkId: user.uid,
                email: user.email || "",
                firstName: nameParts[0] || firstName || "",
                lastName: nameParts.slice(1).join(" ") || lastName || "",
                photo: user.photoURL || "",
                status: "User",
                verified: [
                    {
                        accountverified: false,
                        verifieddate: new Date(),
                    },
                ],
            });
        }

        router.replace(redirectTo);
    };

    const handleForgotPassword = async () => {
        if (!authBundle || loading) return;

        clearMessages();

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) {
            setError("Please enter your email address first.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(authBundle.auth, cleanEmail);
            setSuccess("Password reset link sent. Please check your email.");
        } catch (err: any) {
            console.error("Password reset error:", err);
            setError(getFriendlyError(err?.code || err?.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authBundle || loading) return;

        clearMessages();

        const cleanEmail = email.trim().toLowerCase();
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();

        if (!cleanFirstName || !cleanLastName) {
            setError("Please enter both first name and last name.");
            return;
        }

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const methods = await fetchSignInMethodsForEmail(authBundle.auth, cleanEmail);
            if (methods.length > 0) {
                setError("This email is already registered. Please sign in instead.");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                authBundle.auth,
                cleanEmail,
                password
            );

            if (cleanFirstName || cleanLastName) {
                await updateProfile(userCredential.user, {
                    displayName: `${cleanFirstName} ${cleanLastName}`.trim(),
                });
            }

            await createUserInDB({
                clerkId: userCredential.user.uid,
                email: cleanEmail,
                firstName: cleanFirstName,
                lastName: cleanLastName,
                photo: userCredential.user.photoURL || "",
                status: "User",
                verified: [
                    {
                        accountverified: false,
                        verifieddate: new Date(),
                    },
                ],
            });

            router.replace(redirectTo);
        } catch (err: any) {
            console.error("Sign up error:", err);
            setError(getFriendlyError(err?.code || err?.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authBundle || loading) return;

        clearMessages();

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            await setPersistence(authBundle.auth, browserLocalPersistence);
            await signInWithEmailAndPassword(authBundle.auth, cleanEmail, password);
            router.replace(redirectTo);
        } catch (err: any) {
            console.error("Firebase sign-in error:", {
                code: err?.code,
                message: err?.message,
            });
            setError(getFriendlyError(err?.code || err?.message));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!authBundle || loading) return;

        clearMessages();
        setLoading(true);

        try {
            if (Capacitor.isNativePlatform()) {
                const googleResult = await GoogleAuth.signIn();

                if (!googleResult.authentication?.idToken) {
                    throw new Error("No ID token returned from Google");
                }

                const credential = GoogleAuthProvider.credential(
                    googleResult.authentication.idToken
                );

                const result = await signInWithCredential(authBundle.auth, credential);
                await processUser(result);
            } else {
                const result = await signInWithPopup(
                    authBundle.auth,
                    authBundle.googleProvider
                );
                await processUser(result);
            }
        } catch (err: any) {
            console.error("Google sign-in error:", err);
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
                        Buy, sell, and connect with confidence
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    {formTitle}
                </h2>
                <p className="text-sm text-center text-gray-500 mb-6">
                    {isSignUp
                        ? "Create your account to start posting and managing listings."
                        : "Welcome back. Sign in to continue."}
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

                <form
                    className="space-y-4"
                    onSubmit={isSignUp ? handleSignUp : handleSignIn}
                >
                    {isSignUp && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                autoComplete="given-name"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-orange-200"
                                disabled={loading}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                autoComplete="family-name"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-orange-200"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-orange-200"
                        disabled={loading}
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={isSignUp ? "Password (min 6 characters)" : "Password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={isSignUp ? "new-password" : "current-password"}
                            required
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-orange-200"
                            disabled={loading}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#f97316]"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={loading}
                        >
                            {showPassword ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !authBundle}
                        className="w-full rounded-xl bg-[#f97316] px-4 py-3 font-bold text-white hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(redirectTo)}
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-sm text-gray-400">or</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading || !authBundle}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 flex items-center justify-center gap-3"
                >
                    <FcGoogle size={20} />
                    <span>Continue with Google</span>
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={loading}
                        className="font-semibold text-[#f97316] underline underline-offset-2 disabled:opacity-60"
                    >
                        {isSignUp ? "Sign In" : "Create Account"}
                    </button>
                </div>

                {!isSignUp && (
                    <div className="mt-3 text-center text-sm">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            disabled={loading}
                            className="text-blue-600 underline underline-offset-2 disabled:opacity-60"
                        >
                            Forgot your password?
                        </button>
                    </div>
                )}

                <p className="mt-6 text-center text-xs text-gray-500 leading-5">
                    By continuing, you agree to our{" "}
                    <a
                        href="/terms"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Terms & Conditions
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

function AuthPageFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-orange-100 p-6 sm:p-8">
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                    <p className="mt-4 text-sm text-gray-500">Loading authentication...</p>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<AuthPageFallback />}>
            <AuthPageInner />
        </Suspense>
    );
}