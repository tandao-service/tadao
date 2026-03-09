"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

type AuthGuardProps = {
    children: React.ReactNode;
    redirectTo?: string;
    fallback?: React.ReactNode;
    requireProfile?: boolean; // if true, wait for Mongo user too
};

export default function AuthGuard({
    children,
    redirectTo = "/auth",
    fallback = null,
    requireProfile = false,
}: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { authUser, user, loading, profileLoading } = useAuth();

    const search = searchParams?.toString() || "";
    const nextPath = `${pathname || "/"}${search ? `?${search}` : ""}`;

    useEffect(() => {
        if (loading) return;
        if (!authUser) {
            router.replace(`${redirectTo}?next=${encodeURIComponent(nextPath)}`);
            return;
        }

        if (requireProfile && !profileLoading && !user) {
            router.replace(`${redirectTo}?next=${encodeURIComponent(nextPath)}`);
        }
    }, [
        authUser,
        user,
        loading,
        profileLoading,
        redirectTo,
        nextPath,
        router,
        requireProfile,
    ]);

    if (loading) return <>{fallback}</>;
    if (!authUser) return null;

    if (requireProfile) {
        if (profileLoading) return <>{fallback}</>;
        if (!user) return null;
    }

    return <>{children}</>;
}