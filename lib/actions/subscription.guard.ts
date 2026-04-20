"use server";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import DynamicAd from "@/lib/database/models/dynamicAd.model";
import Packages from "@/lib/database/models/packages.model";

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

async function getFreePackageBenefits() {
    const freePkg: any = await Packages.findOne({
        name: { $regex: /^free$/i },
    }).select("_id name list entitlements");

    const maxListings = Number(
        freePkg?.entitlements?.maxListings ?? freePkg?.list ?? 0
    );

    const priority = Number(
        freePkg?.entitlements?.priority ?? freePkg?.priority ?? 0
    );

    return {
        packageId: freePkg?._id ? String(freePkg._id) : undefined,
        packageName: freePkg?.name || "Free",
        maxListings: maxListings > 0 ? maxListings : 100,
        priority,
    };
}

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

    const freeBenefits = await getFreePackageBenefits();
    const freeMaxListings = freeBenefits.maxListings;

    // No subscription object => treat as Free package from DB
    if (!sub) {
        const remainingAds = Math.max(0, freeMaxListings - activeAdsCount);

        if (activeAdsCount >= freeMaxListings) {
            return {
                allowed: false,
                reason: "FREE_LIMIT_REACHED",
                planId: freeBenefits.packageId,
                activeAdsCount,
                allowedListings: freeMaxListings,
                remainingAds,
            };
        }

        return {
            allowed: true,
            reason: "FREE",
            planId: freeBenefits.packageId,
            activeAdsCount,
            allowedListings: freeMaxListings,
            remainingAds,
        };
    }

    const planName = String(sub.planName || "").trim();
    const planId = sub.planId ? String(sub.planId) : undefined;

    // Free plan => use Free package benefits from DB
    if (!planName || planName.toLowerCase() === "free") {
        const remainingAds = Math.max(0, freeMaxListings - activeAdsCount);

        if (activeAdsCount >= freeMaxListings) {
            return {
                allowed: false,
                reason: "FREE_LIMIT_REACHED",
                planId: planId || freeBenefits.packageId,
                activeAdsCount,
                allowedListings: freeMaxListings,
                remainingAds,
            };
        }

        return {
            allowed: true,
            reason: "FREE",
            planId: planId || freeBenefits.packageId,
            activeAdsCount,
            allowedListings: freeMaxListings,
            remainingAds,
        };
    }

    // Paid plan but missing plan id
    if (!planId) {
        return {
            allowed: false,
            reason: "MISSING_PLAN",
            activeAdsCount,
            allowedListings: Number(sub?.entitlements?.maxListings ?? 0),
            remainingAds: Number(sub?.remainingAds ?? 0),
        };
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
            return {
                allowed: false,
                reason: "EXPIRED",
                planId,
                activeAdsCount,
                allowedListings: Number(sub?.entitlements?.maxListings ?? 0),
                remainingAds: Number(sub?.remainingAds ?? 0),
            };
        }

        if (now > expiresAt) {
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