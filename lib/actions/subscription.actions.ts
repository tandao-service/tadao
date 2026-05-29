"use server";

import { revalidatePath } from "next/cache";
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

function buildSubscriptionFromPackage(pkg: any, expiresAt: Date) {
    const maxListings =
        Number(pkg?.entitlements?.maxListings) > 0
            ? Number(pkg.entitlements.maxListings)
            : Number(pkg?.list || 0);

    const priority =
        Number(pkg?.entitlements?.priority) > 0
            ? Number(pkg.entitlements.priority)
            : Number(pkg?.priority || 0);
    const topDays = Number(pkg?.entitlements?.topDays ?? 0) || 0;
    const featuredDays = Number(pkg?.entitlements?.featuredDays ?? 0) || 0;

    const autoRenewHours =
        pkg?.entitlements?.autoRenewHours === null ||
            pkg?.entitlements?.autoRenewHours === undefined
            ? null
            : Number(pkg.entitlements.autoRenewHours);

    return {
        planId: pkg._id,
        planName: pkg.name,
        active: true,
        expiresAt,
        remainingAds: maxListings,
        entitlements: {
            maxListings,
            priority,
            topDays,
            featuredDays,
            autoRenewHours,
        },
        createdAt: new Date(),
        removed: false,
    };
}

function revalidateSubscriptionPages() {
    revalidatePath("/admin/subscription");
    revalidatePath("/admin");
    revalidatePath("/admin/users");
}

export async function getSubscriptionsTable(params?: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    try {
        await connectToDatabase();

        const page = Math.max(Number(params?.page || 1), 1);
        const limit = Math.min(Math.max(Number(params?.limit || 20), 1), 100);
        const search = String(params?.search || "").trim();

        const andConditions: any[] = [
            {
                "subscription.active": true,
                "subscription.expiresAt": { $gt: new Date() },
                "subscription.planName": { $nin: [null, "", "Free", "No plan"] },
            },
        ];

        if (search) {
            const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

            andConditions.push({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { businessname: regex },
                    { email: regex },
                    { phone: regex },
                    { whatsapp: regex },
                    { "subscription.planName": regex },
                ],
            });
        }

        const query = { $and: andConditions };
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            User.find(query)
                .select("firstName lastName businessname email phone whatsapp photo imageUrl subscription")
                .sort({ "subscription.expiresAt": 1, businessname: 1, firstName: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            User.countDocuments(query),
        ]);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)),
            total,
            page,
            totalPages: Math.max(Math.ceil(total / limit), 1),
        };
    } catch (error) {
        console.error("getSubscriptionsTable error:", error);

        return {
            success: false,
            message: "Failed to load subscriptions.",
            data: [],
            total: 0,
            page: Number(params?.page || 1),
            totalPages: 1,
        };
    }
}

export async function getAllPackagesSimple() {
    try {
        await connectToDatabase();

        const packages = await Packages.find({})
            .select("name color imageUrl entitlements list priority")
            .sort({ createdAt: -1, name: 1 })
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(packages)),
        };
    } catch (error) {
        console.error("getAllPackagesSimple error:", error);

        return {
            success: false,
            message: "Failed to load packages.",
            data: [],
        };
    }
}

export async function extendUserSubscription(params: {
    userId: string;
    expiresAt?: string;
    remainingAds?: number;
    addDays?: number;
}) {
    try {
        await connectToDatabase();

        const { userId, expiresAt, remainingAds, addDays } = params;

        const user: any = await User.findById(userId).select("subscription");
        if (!user) {
            return {
                success: false,
                message: "User not found.",
            };
        }

        const updatePayload: any = {};

        let nextExpiry: Date | null = null;

        if (expiresAt) {
            nextExpiry = new Date(expiresAt);
        } else if (typeof addDays === "number") {
            const currentExpiry = user?.subscription?.expiresAt
                ? new Date(user.subscription.expiresAt)
                : null;

            const base = currentExpiry && currentExpiry > new Date() ? currentExpiry : new Date();

            base.setDate(base.getDate() + addDays);
            nextExpiry = base;
        }

        if (nextExpiry) {
            updatePayload["subscription.expiresAt"] = nextExpiry;
            updatePayload["subscription.active"] = true;
            updatePayload["subscription.removed"] = false;
        }

        if (typeof remainingAds === "number") {
            updatePayload["subscription.remainingAds"] = Math.max(0, remainingAds);
        }

        if (Object.keys(updatePayload).length === 0) {
            return {
                success: false,
                message: "No subscription changes provided.",
            };
        }

        await User.findByIdAndUpdate(userId, { $set: updatePayload }, { new: true });

        revalidateSubscriptionPages();

        return {
            success: true,
            message: "Subscription updated successfully.",
        };
    } catch (error) {
        console.error("extendUserSubscription error:", error);

        return {
            success: false,
            message: "Failed to extend subscription.",
        };
    }
}

export async function updateUserSubscriptionPlan(params: {
    userId: string;
    planId: string;
    period?: string;
}) {
    try {
        await connectToDatabase();

        const { userId, planId, period = "1 month" } = params;

        const user: any = await User.findById(userId).select("subscription");
        if (!user) {
            return {
                success: false,
                message: "User not found.",
            };
        }

        const pkg: any = await Packages.findById(planId);
        if (!pkg) {
            return {
                success: false,
                message: "Package not found.",
            };
        }

        const days = periodToDays(period);

        const currentExpiry =
            user?.subscription?.expiresAt && new Date(user.subscription.expiresAt) > new Date()
                ? new Date(user.subscription.expiresAt)
                : new Date();

        currentExpiry.setDate(currentExpiry.getDate() + days);

        const subscription = buildSubscriptionFromPackage(pkg, currentExpiry);

        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    subscription,
                },
            },
            { new: true }
        );

        revalidateSubscriptionPages();

        return {
            success: true,
            message: "Subscription plan updated successfully.",
            subscription: JSON.parse(JSON.stringify(subscription)),
        };
    } catch (error) {
        console.error("updateUserSubscriptionPlan error:", error);

        return {
            success: false,
            message: "Failed to update subscription plan.",
        };
    }
}

export async function activateSubscription(params: {
    userId: string;
    planId: string;
    period: string;
}) {
    return updateUserSubscriptionPlan(params);
}

export async function decrementSubscriptionRemainingAds(userId: string, count = 1) {
    try {
        await connectToDatabase();

        const user: any = await User.findById(userId).select("subscription.remainingAds");
        if (!user) {
            return {
                success: false,
                message: "User not found.",
                remainingAds: 0,
            };
        }

        const current = Number(user?.subscription?.remainingAds || 0);
        const next = Math.max(0, current - Number(count || 1));

        await User.findByIdAndUpdate(userId, {
            $set: {
                "subscription.remainingAds": next,
            },
        });

        return {
            success: true,
            remainingAds: next,
        };
    } catch (error) {
        console.error("decrementSubscriptionRemainingAds error:", error);

        return {
            success: false,
            message: "Failed to update remaining ads.",
            remainingAds: 0,
        };
    }
}