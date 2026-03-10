// lib/actions/subscription.guard.ts
"use server";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

export type CanPostReason =
    | "FREE"
    | "OK"
    | "INACTIVE_SUBSCRIPTION"
    | "EXPIRED"
    | "LIMIT_REACHED"
    | "NO_SUBSCRIPTION"
    | "MISSING_PLAN";

export type CanPostResult =
    | { allowed: true; reason: "FREE" | "OK" }
    | {
        allowed: false;
        reason: Exclude<CanPostReason, "FREE" | "OK">;
        planId?: string;
    };

/**
 * ✅ Single source of truth: user.subscription
 * - Free users (or no subscription) are allowed by default
 * - Paid plans require: active=true, expiresAt not passed, remainingAds > 0
 */
export async function requireCanPostAd(userId: string): Promise<CanPostResult> {
    await connectToDatabase();

    const user: any = await User.findById(userId).select("subscription");
    if (!user) throw new Error("User not found");

    const sub = user.subscription;

    // 🟢 No subscription object at all -> treat as FREE (or return NO_SUBSCRIPTION if you prefer)
    if (!sub) {
        return { allowed: true, reason: "FREE" };
        // If you want to force subscription object existence, use:
        // return { allowed: false, reason: "NO_SUBSCRIPTION" };
    }

    const planName = String(sub.planName || "").trim();
    const planId = sub.planId ? String(sub.planId) : undefined;

    // 🟢 Free plan -> always allowed
    if (!planName || planName.toLowerCase() === "free") {
        return { allowed: true, reason: "FREE" };
    }

    // ❌ Missing planId for a paid plan (data inconsistency)
    if (!planId) {
        return { allowed: false, reason: "MISSING_PLAN" };
    }

    // ❌ Inactive subscription
    if (!sub.active) {
        return { allowed: false, reason: "INACTIVE_SUBSCRIPTION", planId };
    }

    // ⏳ Expired
    if (sub.expiresAt) {
        const expiresAt = new Date(sub.expiresAt);
        if (!Number.isFinite(expiresAt.getTime())) {
            // bad date stored: fail safe (block) or allow — choose your policy
            return { allowed: false, reason: "EXPIRED", planId };
        }
        if (new Date() > expiresAt) {
            return { allowed: false, reason: "EXPIRED", planId };
        }
    }

    // 📦 Quota reached
    // remainingAds is your runtime counter. If you prefer, you can recompute using ads count,
    // but remainingAds is the clean SaaS approach.
    if (typeof sub.remainingAds === "number" && sub.remainingAds <= 0) {
        return { allowed: false, reason: "LIMIT_REACHED", planId };
    }

    return { allowed: true, reason: "OK" };
}