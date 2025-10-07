"use client";

import { useEffect, useState } from "react";

import { getUserByClerkId } from "@/lib/actions/user.actions";
import HomeDashboard from "@/components/shared/HomeDashboard";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function HomeClient(props: any) {
    const { user, loading: authLoading } = useAuth();
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const router = useRouter();
    useEffect(() => {
        //  if (!user) return;
        (async () => {
            try {
                const fetchedUser: any = await getUserByClerkId("WS7tuWWGvrTIhdZLMDZIUIw5Y1y2");
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
    }, []);

    if (authLoading) {
        return <div>Loading...</div>;
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
