"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { getAuthSafe } from "@/lib/firebase";
import { getUserById } from "@/lib/actions/user.actions";

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

type AuthContextType = {
    authUser: User | null;
    appUser: AppUser | null;
    appUserId: string | null;
    loading: boolean;
    profileLoading: boolean;
    isAuthenticated: boolean;
    signOutUser: () => Promise<void>;
    refreshAppUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [authInstance, setAuthInstance] = useState<any>(null);

    const loadAppUser = async (firebaseUser?: User | null) => {
        const current = firebaseUser ?? authUser;

        if (!current?.uid) {
            setAppUser(null);
            return;
        }

        setProfileLoading(true);

        try {
            const data = await getUserById(current.uid);

            if (data) {
                setAppUser(data);
            } else {
                setAppUser(null);
            }
        } catch (error) {
            console.error("Failed to load app user:", error);
            setAppUser(null);
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        let mounted = true;

        (async () => {
            try {
                const authData = await getAuthSafe();

                if (!mounted) return;

                if (!authData) {
                    setLoading(false);
                    return;
                }

                const { auth } = authData;
                setAuthInstance(auth);

                unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                    if (!mounted) return;

                    setAuthUser(firebaseUser);

                    if (firebaseUser) {
                        await loadAppUser(firebaseUser);
                    } else {
                        setAppUser(null);
                    }

                    setLoading(false);
                });
            } catch (error) {
                console.error("AuthProvider init error:", error);

                if (mounted) {
                    setAuthUser(null);
                    setAppUser(null);
                    setLoading(false);
                    setProfileLoading(false);
                }
            }
        })();

        return () => {
            mounted = false;
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const signOutUser = async () => {
        try {
            if (authInstance) {
                await signOut(authInstance);
            }
        } catch (error) {
            console.error("Sign out failed:", error);
        } finally {
            setAuthUser(null);
            setAppUser(null);
        }
    };

    const refreshAppUser = async () => {
        await loadAppUser();
    };

    const value = useMemo(
        () => ({
            authUser,
            appUser,
            appUserId: appUser?._id ?? null,
            loading,
            profileLoading,
            isAuthenticated: !!authUser,
            signOutUser,
            refreshAppUser,
        }),
        [authUser, appUser, loading, profileLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function userAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}