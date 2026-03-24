"use server";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import DynamicAd from "@/lib/database/models/dynamicAd.model";

const FREE_MAX_LISTINGS = 3;

export type CanPostReason =
    | "FREE"
    | "OK"
    | "INACTIVE_SUBSCRIPTION"
    | "EXPIRED"
    | "LIMIT_REACHED"
    | "FREE_LIMIT_REACHED"
    | "NO_SUBSCRIPTION"
    | "MISSING_PLAN";

export type CanPostResult =
    | {
        allowed: true;
        reason: "FREE" | "OK";
        planId?: string;
        activeAdsCount?: number;
        allowedListings?: number;
        remainingAds?: number;
    }
    | {
        allowed: false;
        reason: Exclude<CanPostReason, "FREE" | "OK">;
        planId?: string;
        activeAdsCount?: number;
        allowedListings?: number;
        remainingAds?: number;
    };

export async function requireCanPostAd(userId: string): Promise<CanPostResult> {
    await connectToDatabase();

    const user: any = await User.findById(userId).select("subscription");
    if (!user) throw new Error("User not found");

    const sub = user.subscription;
    const now = new Date();

    const activeAdsCount = await DynamicAd.countDocuments({
        organizer: user._id,
        adstatus: { $in: ["Active", "Pending", "Published"] },
        expirely: { $gt: now },
    });

    // No subscription object => treat as free, but LIMITED
    if (!sub) {
        if (activeAdsCount >= FREE_MAX_LISTINGS) {
            return {
                allowed: false,
                reason: "FREE_LIMIT_REACHED",
                activeAdsCount,
                allowedListings: FREE_MAX_LISTINGS,
                remainingAds: 0,
            };
        }

        return {
            allowed: true,
            reason: "FREE",
            activeAdsCount,
            allowedListings: FREE_MAX_LISTINGS,
            remainingAds: 0,
        };
    }

    const planName = String(sub.planName || "").trim();
    const planId = sub.planId ? String(sub.planId) : undefined;

    // Free plan => LIMITED
    if (!planName || planName.toLowerCase() === "free") {
        if (activeAdsCount >= FREE_MAX_LISTINGS) {
            return {
                allowed: false,
                reason: "FREE_LIMIT_REACHED",
                planId,
                activeAdsCount,
                allowedListings: FREE_MAX_LISTINGS,
                remainingAds: 0,
            };
        }

        return {
            allowed: true,
            reason: "FREE",
            planId,
            activeAdsCount,
            allowedListings: FREE_MAX_LISTINGS,
            remainingAds: 0,
        };
    }

    // Paid plan but missing plan id
    if (!planId) {
        return { allowed: false, reason: "MISSING_PLAN" };
    }

    if (!sub.active) {
        return {
            allowed: false,
            reason: "INACTIVE_SUBSCRIPTION",
            planId,
            activeAdsCount,
            allowedListings: Number(sub?.entitlements?.maxListings ?? 0),
            remainingAds: Number(sub?.remainingAds ?? 0),
        };
    }

    if (sub.expiresAt) {
        const expiresAt = new Date(sub.expiresAt);

        if (!Number.isFinite(expiresAt.getTime())) {
            return { allowed: false, reason: "EXPIRED", planId };
        }

        if (now > expiresAt) {
            // optional DB cleanup
            await User.findByIdAndUpdate(user._id, {
                $set: { "subscription.active": false },
            });

            return {
                allowed: false,
                reason: "EXPIRED",
                planId,
                activeAdsCount,
                allowedListings: Number(sub?.entitlements?.maxListings ?? 0),
                remainingAds: Number(sub?.remainingAds ?? 0),
            };
        }
    }

    const maxListings = Number(sub?.entitlements?.maxListings ?? 0);
    const remainingAds = Number(sub?.remainingAds ?? 0);

    if (remainingAds <= 0) {
        return {
            allowed: false,
            reason: "LIMIT_REACHED",
            planId,
            activeAdsCount,
            allowedListings: maxListings,
            remainingAds,
        };
    }

    if (maxListings > 0 && activeAdsCount >= maxListings) {
        return {
            allowed: false,
            reason: "LIMIT_REACHED",
            planId,
            activeAdsCount,
            allowedListings: maxListings,
            remainingAds,
        };
    }

    return {
        allowed: true,
        reason: "OK",
        planId,
        activeAdsCount,
        allowedListings: maxListings,
        remainingAds,
    };
}