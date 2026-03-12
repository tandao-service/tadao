"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

import HomeDashboard from "@/components/shared/HomeDashboard";
import { useAuth } from "@/app/hooks/useAuth";
import { getUserByClerkId } from "@/lib/actions/user.actions";

export default function HomeClient(props: any) {
    const { user, loading: authLoading } = useAuth();

    const [userId, setUserId] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [userImage, setUserImage] = useState<string>("");

    const [decided, setDecided] = useState(false);  // finished deciding?
    const [allowed, setAllowed] = useState(false);  // allowed to view?

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (authLoading) return;
        if (!user) { setDecided(true); return; } // optionally redirect to /login here

        let cancelled = false;
        (async () => {
            try {
                const res: any = await getUserByClerkId(user.uid);
                const u = res?.user; // support either shape
                const status = String(u?.status ?? "user").toLowerCase();

                if (status === "user") {
                    setAllowed(false);
                    const target = "/"; // change to where non-admins should land
                    if (pathname !== target) router.replace(target);
                    setDecided(true);
                    return;
                }

                if (!cancelled) {
                    setUserId(u?._id ?? "");
                    setUserName([u?.firstName, u?.lastName].filter(Boolean).join(" "));
                    setUserImage(u?.photo || "");
                    setAllowed(true);
                    setDecided(true);
                }
            } catch (e) {
                console.error("Failed to fetch user by ClerkId:", e);
                setAllowed(false);
                setDecided(true);
            }
        })();

        return () => { cancelled = true; };
    }, [user, authLoading, router, pathname]);

    // Block UI until we've decided
    if (authLoading || !decided) {
        return (
            <div className="flex justify-center items-center h-screen text-lg font-bold">
                <div className="flex gap-2 items-center">
                    <CircularProgress sx={{ color: "gray" }} size={30} />
                    <div className="hidden lg:inline">Loading...</div>
                </div>
            </div>
        );
    }

    // If not allowed (we redirected or will), don't render the dashboard
    if (!allowed) return null;

    // ✅ Only shows after confirming no redirect
    return (
        <HomeDashboard
            {...props}
            userId={userId}
            userName={userName}
            userImage={userImage}
        />
    );
}
