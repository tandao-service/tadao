"use client";

import { useEffect, useState } from "react";

import { getUserByClerkId } from "@/lib/actions/user.actions";
import HomeDashboard from "@/components/shared/HomeDashboard";
import { useAuth } from "@/app/hooks/useAuth";

export default function HomeClient(props: any) {
    const { user, loading: authLoading } = useAuth();
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        if (!user) return;

        (async () => {
            try {
                const fetchedUser: any = await getUserByClerkId(user.uid);
                setUserId(fetchedUser._id);
                setUserName(fetchedUser.firstName + " " + fetchedUser.lastName);
                setUserImage(fetchedUser.photo || "");
            } catch (err) {
                console.error("Failed to fetch user by ClerkId:", err);
            }
        })();
    }, [user]);

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
