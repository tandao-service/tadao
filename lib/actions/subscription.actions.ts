// lib/actions/subscription.actions.ts
"use server";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Packages from "@/lib/database/models/packages.model";

function periodToDays(period: string) {
    const p = String(period || "").toLowerCase();
    const n = parseInt(p, 10);

    if (p.includes("week")) return (Number.isFinite(n) ? n : 1) * 7;
    if (p.includes("month")) return (Number.isFinite(n) ? n : 1) * 30;
    if (p.includes("year")) return (Number.isFinite(n) ? n : 1) * 365;

    return 30;
}

export async function activateSubscription(params: {
    userId: string;
    planId: string;
    period: string;
}) {
    const { userId, planId, period } = params;

    await connectToDatabase();

    const user: any = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const pkg: any = await Packages.findById(planId);
    if (!pkg) throw new Error("Plan not found");

    const days = periodToDays(period);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // ✅ always rely on entitlements first, fallback to legacy fields
    const maxListings = Number(pkg?.entitlements?.maxListings ?? pkg?.list ?? 0) || 0;
    const entitlementPriority = Number(pkg?.entitlements?.priority ?? pkg?.priority ?? 0) || 0;
    const topDays = Number(pkg?.entitlements?.topDays ?? 0) || 0;
    const featuredDays = Number(pkg?.entitlements?.featuredDays ?? 0) || 0;

    const autoRenewHours =
        pkg?.entitlements?.autoRenewHours === null || pkg?.entitlements?.autoRenewHours === undefined
            ? null
            : Number(pkg.entitlements.autoRenewHours);

    // ✅ SAVE INTO USER (matches your schema)
    user.subscription = {
        planId: pkg._id,
        planName: pkg.name,
        active: true,
        expiresAt,
        remainingAds: maxListings,
        entitlements: {
            maxListings,
            priority: entitlementPriority,
            topDays,
            featuredDays,
            autoRenewHours,
        },
    };

    await user.save();

    return {
        success: true,
        planName: pkg.name,
        expiresAt,
        remainingAds: maxListings,
        entitlements: user.subscription.entitlements,
    };
}