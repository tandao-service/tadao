"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

import { getUserByClerkId } from "@/lib/actions/user.actions";
import HomeDashboard from "@/components/shared/HomeDashboard";
import { useAuth } from "@/app/hooks/useAuth";

export default function HomeClient(props: any) {
    const { user, loading: authLoading } = useAuth();
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [deciding, setDeciding] = useState(true); // block UI until we know
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // wait until auth resolves
        if (authLoading) return;

        // if no user, you might want to send them to login here (optional)
        if (!user) {
            setDeciding(false);
            return;
        }

        (async () => {
            try {
                const fetchedUser: any = await getUserByClerkId(user.uid);

                const status = String(fetchedUser?.status ?? "").toLowerCase();

                if (status === "user") {
                    // Non-admin: send them away and prevent dashboard render
                    // If already on "/", just block render (no-op navigation)
                    if (pathname !== "/") router.replace("/");
                    setDeciding(false);
                    return; // do NOT set userId / name / image
                }

                // Allowed: hydrate dashboard props
                setUserId(fetchedUser._id);
                setUserName(`${fetchedUser.firstName ?? ""} ${fetchedUser.lastName ?? ""}`.trim());
                setUserImage(fetchedUser.photo || "");
                setDeciding(false);
            } catch (err) {
                console.error("Failed to fetch user by ClerkId:", err);
                setDeciding(false);
            }
        })();
    }, [user, authLoading, router, pathname]);

    // Show a small loader while deciding or while auth is loading
    if (authLoading || deciding) {
        return (
            <div className="flex justify-center items-center h-full text-lg font-bold">
                <div className="flex gap-2 items-center">
                    <CircularProgress sx={{ color: "gray" }} size={30} />
                    <div className="hidden lg:inline">Loading...</div>
                </div>
            </div>
        );
    }

    // If status was "User", we returned early without setting userId.
    // Don’t render the dashboard in that case.
    if (!userId) {
        return null; // or a message like: <p className="p-4">Redirecting…</p>
    }

    return (
        <HomeDashboard
            {...props}
            userId={userId}
            userName={userName}
            userImage={userImage}
        />
    );
}
