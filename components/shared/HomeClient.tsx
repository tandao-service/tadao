"use client";

import { useEffect, useState } from "react";

import { getUserByClerkId } from "@/lib/actions/user.actions";
import HomeDashboard from "@/components/shared/HomeDashboard";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

export default function HomeClient(props: any) {
    const { user, loading: authLoading } = useAuth();
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const router = useRouter();
    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const fetchedUser: any = await getUserByClerkId(user.uid);
                if (fetchedUser.status === "User") {
                    router.push("/");
                    return
                }
                setUserId(fetchedUser._id);
                setUserName(fetchedUser.firstName + " " + fetchedUser.lastName);
                setUserImage(fetchedUser.photo || "");
            } catch (err) {
                console.error("Failed to fetch user by ClerkId:", err);
            }
        })();
    }, [user]);

    if (authLoading) {
        return <div className="flex justify-center items-center h-full text-lg font-bold">
            <div className="flex gap-2 items-center">  <CircularProgress sx={{ color: "gray" }} size={30} /> <div className="hidden lg:inline">Loading...</div></div>
        </div>;
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
