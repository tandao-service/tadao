"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithCredential,
    UserCredential,
    sendPasswordResetEmail,
} from "firebase/auth";
import { getAuthSafe } from "@/lib/firebase";
import { createUser as createUserInDB } from "@/lib/actions/user.actions";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useToast } from "@/components/ui/use-toast";

export default function AuthPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [authBundle, setAuthBundle] = useState<any>(null);

    // ✅ Initialize GoogleAuth once (only for native)
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            GoogleAuth.initialize({
                scopes: ["profile", "email"],
                grantOfflineAccess: true,
                clientId: "1033579054775-p1lhnkja286tij6ta1ssfo1ld1vlkbm6.apps.googleusercontent.com",
            });
        }
    }, []);

    // ✅ Load Firebase auth safely
    useEffect(() => {
        (async () => {
            const bundle = await getAuthSafe();
            setAuthBundle(bundle);
        })();
    }, []);

    const toggleMode = () => setIsSignUp((prev) => !prev);

    // ✅ Friendly Firebase error messages
    const getFriendlyError = (code: string) => {
        switch (code) {
            case "auth/email-already-in-use":
                return "This email is already registered.";
            case "auth/invalid-email":
                return "Invalid email address.";
            case "auth/weak-password":
                return "Password should be at least 6 characters.";
            case "auth/user-not-found":
                return "No account found with this email.";
            case "auth/wrong-password":
                return "Incorrect password.";
            default:
                return "Something went wrong. Please try again.";
        }
    };

    // ✅ After successful Google/Firebase login, process user
    const processUser = async (result: UserCredential) => {
        const user = result.user;
        const isNewUser = (result as any)?._tokenResponse?.isNewUser;

        if (isNewUser) {
            await createUserInDB({
                clerkId: user.uid,
                email: user.email || "",
                firstName: user.displayName?.split(" ")[0] || "",
                lastName: user.displayName?.split(" ")[1] || "",
                photo: user.photoURL || "",
                status: "User",
                verified: [
                    { accountverified: false, verifieddate: new Date() },
                ],
            });
        }

        router.push("/");
    };

    // ✅ Forgot password
    const handleForgotPassword = async () => {
        if (!authBundle) return;
        const { auth } = authBundle;

        if (!email) {
            setError("Please enter your email to reset your password.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setError("Password reset link sent! Please check your email.");
            // toast({
            //     title: "Alert",
            //      description: "Password reset link sent! Please check your email.",
            //     duration: 5000,
            //       className: "bg-[#000000] text-white",
            //  });

        } catch (err: any) {
            console.error(err);
            setError(getFriendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    // ✅ Email/Password Sign Up
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authBundle) return;
        const { auth } = authBundle;

        setError("");
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            await createUserInDB({
                clerkId: user.uid,
                email,
                firstName,
                lastName,
                photo: user.photoURL || "",
                status: "User",
                verified: [
                    { accountverified: false, verifieddate: new Date() },
                ],
            });

            router.push("/");
        } catch (err: any) {
            console.error(err);
            setError(getFriendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    // ✅ Email/Password Sign In
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authBundle) return;
        const { auth } = authBundle;

        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            console.error(err);
            setError(getFriendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    // ✅ Google Sign In (web vs native)
    const handleGoogleSignIn = async () => {
        if (!authBundle) return;
        const { auth, googleProvider } = authBundle;

        setError("");
        setLoading(true);

        try {
            if (Capacitor.isNativePlatform()) {
                // 🔹 Native (Android/iOS)
                const googleResult = await GoogleAuth.signIn();
                if (!googleResult.authentication?.idToken) {
                    throw new Error("No ID token returned from Google");
                }

                const credential = GoogleAuthProvider.credential(
                    googleResult.authentication.idToken
                );

                const result: any = await signInWithCredential(auth, credential);
                await processUser(result);
            } else {
                // 🔹 Web/PWA
                const result = await signInWithPopup(auth, googleProvider);
                await processUser(result);
            }
        } catch (err: any) {
            console.error(err);
            setError(getFriendlyError(err.code || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white lg:bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded lg:shadow">
                <div className="flex flex-col items-center mb-4">
                    <img
                        src="/logo.png"
                        alt="Tadao Market"
                        className="w-20 h-20 mb-2"
                    />
                    <h1 className="text-3xl font-bold text-[#f97316]">
                        Tadao Market
                    </h1>
                </div>

                <h2 className="text-2xl font-bold text-center">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h2>

                {error && (
                    <p className="text-red-500 text-center bg-red-100 p-2 rounded">
                        {error}
                    </p>
                )}

                <form
                    className="space-y-4"
                    onSubmit={isSignUp ? handleSignUp : handleSignIn}
                >
                    {isSignUp && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-1/2 p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-1/2 p-2 border rounded"
                            />
                        </div>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full p-2 font-bold text-white rounded flex justify-center items-center gap-2 hover:opacity-90"
                        style={{ backgroundColor: "#f97316" }}
                        disabled={loading || !authBundle}
                    >
                        {loading && (
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                        )}
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                    {/* Cancel button */}
                    <button
                        type="button" // ✅ so it doesn't submit the form
                        onClick={() => router.push("/")}
                        className="w-full p-2 font-bold rounded border border-gray-300 text-gray-700 hover:bg-gray-100 mt-2"
                    >
                        Cancel
                    </button>
                </form>

                <div className="flex items-center justify-center space-x-2">
                    <span>or</span>
                    <button
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center gap-2 w-full p-2 font-semibold text-gray-700 border rounded hover:bg-gray-100 transition"
                        disabled={loading || !authBundle}
                    >
                        {/**   {loading ? (
                            <span className="animate-spin border-2 border-gray-700 border-t-transparent rounded-full w-5 h-5"></span>
                        ) : (
                            <>*/}
                        <FcGoogle size={20} />
                        <span>Sign in with Google</span>
                        {/**   </>
                        )}*/}
                    </button>
                </div>

                <p className="text-center text-sm">
                    {isSignUp
                        ? "Already have an account?"
                        : "Don't have an account?"}{" "}
                    <button
                        onClick={toggleMode}
                        className="text-blue-600 underline"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>

                {!isSignUp && (
                    <p className="text-center text-sm">
                        <button
                            onClick={handleForgotPassword}
                            className="text-blue-600 underline"
                        >
                            Forgot your password?
                        </button>
                    </p>
                )}

                <p className="text-xs text-center text-gray-500">
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
