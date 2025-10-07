"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

import HomeDashboard from "@/components/shared/HomeDashboard";
import { useAuth } from "@/app/hooks/useAuth";
import { getUserByClerkId } from "@/lib/actions/user.actions";

export default function HomeClient(props: any) {
    const { user, loading: authLoading } = useAuth();
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [redirecting, setRedirecting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return; // wait for auth
        if (!user) return;       // or send to sign-in if that's your flow

        let cancelled = false;

        (async () => {
            try {
                const fetchedUser: any = await getUserByClerkId(user.uid);

                const status = (fetchedUser?.status ?? "user").toLowerCase();
                if (status === "user") {
                    setRedirecting(true);
                    // ⚠️ change "/" to the page you actually want non-admins to see.
                    router.replace("/");
                    return;
                }

                if (!cancelled) {
                    setUserId(fetchedUser?._id ?? "");
                    setUserName(
                        [fetchedUser?.firstName, fetchedUser?.lastName].filter(Boolean).join(" ")
                    );
                    setUserImage(fetchedUser?.photo || "");
                }
            } catch (err) {
                console.error("Failed to fetch user by ClerkId:", err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user, authLoading, router]);

    // Show a loader while auth is resolving or we’re redirecting
    if (authLoading || redirecting) {
        return (
            <div className="flex justify-center items-center h-screen text-lg font-bold">
                <div className="flex gap-2 items-center">
                    <CircularProgress sx={{ color: "gray" }} size={30} />
                    <div className="hidden lg:inline">Loading...</div>
                </div>
            </div>
        );
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
