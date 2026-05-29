"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Packages from "@/lib/database/models/packages.model";
import Transaction from "@/lib/database/models/transaction.model";

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
        Number(pkg?.entitlements?.maxListings ?? pkg?.list ?? 0) || 0;

    const entitlementPriority =
        Number(pkg?.entitlements?.priority ?? pkg?.priority ?? 0) || 0;

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
            priority: entitlementPriority,
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

    user.subscription = buildSubscriptionFromPackage(pkg, expiresAt);

    await user.save();

    revalidateSubscriptionPages();

    return {
        success: true,
        planName: pkg.name,
        expiresAt,
        remainingAds: user.subscription.remainingAds,
        entitlements: user.subscription.entitlements,
    };
}

export async function getSubscriptionOverview() {
    try {
        await connectToDatabase();

        const now = new Date();
        const in7Days = new Date();
        in7Days.setDate(in7Days.getDate() + 7);

        const notRemoved = {
            $or: [
                { "subscription.removed": { $exists: false } },
                { "subscription.removed": { $ne: true } },
            ],
        };

        const [
            totalUsers,
            activeSubscriptions,
            expiredSubscriptions,
            expiringSoon,
            inactiveSubscriptions,
            lowRemainingAds,
            planDistribution,
            recentRenewals,
            upcomingExpiries,
            revenueSummary,
            transactionStatusSummary,
        ] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({
                ...notRemoved,
                "subscription.active": true,
                "subscription.expiresAt": { $gt: now },
            }),
            User.countDocuments({
                ...notRemoved,
                "subscription.expiresAt": { $lt: now },
            }),
            User.countDocuments({
                ...notRemoved,
                "subscription.active": true,
                "subscription.expiresAt": { $gte: now, $lte: in7Days },
            }),
            User.countDocuments({
                ...notRemoved,
                $or: [
                    { "subscription.active": false },
                    { "subscription.active": { $exists: false } },
                    { "subscription.planId": null },
                ],
            }),
            User.countDocuments({
                ...notRemoved,
                "subscription.active": true,
                "subscription.expiresAt": { $gt: now },
                "subscription.remainingAds": { $lte: 2 },
            }),
            User.aggregate([
                {
                    $match: {
                        ...notRemoved,
                        "subscription.planId": { $ne: null },
                    },
                },
                {
                    $group: {
                        _id: "$subscription.planName",
                        total: { $sum: 1 },
                        active: {
                            $sum: {
                                $cond: [{ $eq: ["$subscription.active", true] }, 1, 0],
                            },
                        },
                    },
                },
                { $sort: { total: -1 } },
            ]),
            Transaction.find({})
                .populate("buyer", "firstName lastName businessname email photo imageUrl")
                .populate("planId", "name color imageUrl")
                .sort({ createdAt: -1 })
                .limit(8)
                .lean(),
            User.find({
                ...notRemoved,
                "subscription.active": true,
                "subscription.expiresAt": { $gte: now },
            })
                .select("firstName lastName businessname email photo imageUrl subscription")
                .sort({ "subscription.expiresAt": 1 })
                .limit(8)
                .lean(),
            Transaction.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" },
                        paidRevenue: {
                            $sum: {
                                $cond: [
                                    {
                                        $in: [
                                            { $toLower: { $ifNull: ["$status", ""] } },
                                            ["paid", "completed", "success", "successful"],
                                        ],
                                    },
                                    "$amount",
                                    0,
                                ],
                            },
                        },
                        totalTransactions: { $sum: 1 },
                        paidTransactions: {
                            $sum: {
                                $cond: [
                                    {
                                        $in: [
                                            { $toLower: { $ifNull: ["$status", ""] } },
                                            ["paid", "completed", "success", "successful"],
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
            Transaction.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        totalAmount: { $sum: "$amount" },
                    },
                },
                { $sort: { count: -1 } },
            ]),
        ]);

        return {
            success: true,
            overview: {
                totalUsers,
                activeSubscriptions,
                expiredSubscriptions,
                expiringSoon,
                inactiveSubscriptions,
                lowRemainingAds,
                planDistribution,
                recentRenewals,
                upcomingExpiries,
                revenueSummary: revenueSummary?.[0] || {
                    totalRevenue: 0,
                    paidRevenue: 0,
                    totalTransactions: 0,
                    paidTransactions: 0,
                },
                transactionStatusSummary,
            },
        };
    } catch (error) {
        console.error("getSubscriptionOverview error:", error);
        return {
            success: false,
            overview: null,
        };
    }
}

export async function getSubscriptionsTable(params?: {
    page?: number;
    limit?: number;
    filter?: "all" | "active" | "expired" | "expiring" | "inactive";
    search?: string;
}) {
    try {
        await connectToDatabase();

        const page = Number(params?.page || 1);
        const limit = Number(params?.limit || 20);
        const filter = params?.filter || "all";
        const search = String(params?.search || "").trim();

        const now = new Date();
        const in7Days = new Date();
        in7Days.setDate(in7Days.getDate() + 7);

        const andConditions: any[] = [
            {
                $or: [
                    { "subscription.removed": { $exists: false } },
                    { "subscription.removed": { $ne: true } },
                ],
            },
        ];

        if (filter === "active") {
            andConditions.push({
                "subscription.active": true,
                "subscription.expiresAt": { $gt: now },
            });
        }

        if (filter === "expired") {
            andConditions.push({
                "subscription.expiresAt": { $lt: now },
            });
        }

        if (filter === "expiring") {
            andConditions.push({
                "subscription.active": true,
                "subscription.expiresAt": { $gte: now, $lte: in7Days },
            });
        }

        if (filter === "inactive") {
            andConditions.push({
                $or: [
                    { "subscription.active": false },
                    { "subscription.active": { $exists: false } },
                    { "subscription.planId": null },
                ],
            });
        }

        if (search) {
            const regex = new RegExp(search, "i");
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
                .select(
                    "firstName lastName businessname email phone whatsapp photo imageUrl verified subscription"
                )
                .sort({ "subscription.expiresAt": 1, firstName: 1, businessname: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        return {
            success: true,
            data: items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error("getSubscriptionsTable error:", error);
        return {
            success: false,
            data: [],
            total: 0,
            page: Number(params?.page || 1),
            totalPages: 0,
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

        const user: any = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const updatePayload: any = {};

        let nextExpiry: Date | null = null;

        if (expiresAt) {
            nextExpiry = new Date(expiresAt);
        } else if (typeof addDays === "number") {
            const base =
                user?.subscription?.expiresAt &&
                    new Date(user.subscription.expiresAt) > new Date()
                    ? new Date(user.subscription.expiresAt)
                    : new Date();

            base.setDate(base.getDate() + addDays);
            nextExpiry = base;
        }

        if (nextExpiry) {
            updatePayload["subscription.expiresAt"] = nextExpiry;
            updatePayload["subscription.active"] = true;
            updatePayload["subscription.removed"] = false;
        }

        if (typeof remainingAds === "number") {
            updatePayload["subscription.remainingAds"] = remainingAds;
        }

        await User.findByIdAndUpdate(userId, { $set: updatePayload }, { new: true });

        revalidateSubscriptionPages();

        return { success: true };
    } catch (error) {
        console.error("extendUserSubscription error:", error);
        return { success: false };
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

        const user: any = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const pkg: any = await Packages.findById(planId);
        if (!pkg) throw new Error("Plan not found");

        const days = periodToDays(period);

        const currentExpiry =
            user?.subscription?.expiresAt &&
                new Date(user.subscription.expiresAt) > new Date()
                ? new Date(user.subscription.expiresAt)
                : new Date();

        currentExpiry.setDate(currentExpiry.getDate() + days);

        user.subscription = buildSubscriptionFromPackage(pkg, currentExpiry);

        await user.save();

        revalidateSubscriptionPages();

        return {
            success: true,
            subscription: user.subscription,
        };
    } catch (error) {
        console.error("updateUserSubscriptionPlan error:", error);
        return { success: false };
    }
}

export async function decrementSubscriptionRemainingAds(
    userId: string,
    count = 1
) {
    try {
        await connectToDatabase();

        const user: any = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const current = Number(user?.subscription?.remainingAds || 0);
        const next = Math.max(0, current - Number(count || 1));

        user.subscription = {
            ...user.subscription,
            remainingAds: next,
        };

        await user.save();

        return {
            success: true,
            remainingAds: next,
        };
    } catch (error) {
        console.error("decrementSubscriptionRemainingAds error:", error);
        return {
            success: false,
            remainingAds: 0,
        };
    }
}

export async function markExpiredSubscriptions() {
    try {
        await connectToDatabase();

        const now = new Date();

        const result = await User.updateMany(
            {
                "subscription.active": true,
                "subscription.expiresAt": { $lt: now },
            },
            {
                $set: {
                    "subscription.active": false,
                },
            }
        );

        revalidateSubscriptionPages();

        return {
            success: true,
            modifiedCount: result.modifiedCount || 0,
        };
    } catch (error) {
        console.error("markExpiredSubscriptions error:", error);
        return {
            success: false,
            modifiedCount: 0,
        };
    }
}

export async function deleteUserPendingSubscription(userId: string) {
    try {
        await connectToDatabase();

        const user: any = await User.findById(userId).lean();
        if (!user) {
            return {
                success: false,
                message: "User not found.",
            };
        }

        const isActiveNow =
            Boolean(user?.subscription?.active) &&
            user?.subscription?.expiresAt &&
            new Date(user.subscription.expiresAt) > new Date();

        if (isActiveNow) {
            return {
                success: false,
                message: "Cannot delete an active subscription.",
            };
        }

        await User.findByIdAndUpdate(userId, {
            $set: {
                "subscription.planId": null,
                "subscription.planName": "",
                "subscription.active": false,
                "subscription.expiresAt": null,
                "subscription.remainingAds": 0,
                "subscription.entitlements.maxListings": 0,
                "subscription.entitlements.priority": 0,
                "subscription.entitlements.topDays": 0,
                "subscription.entitlements.featuredDays": 0,
                "subscription.entitlements.autoRenewHours": null,
                "subscription.createdAt": new Date(),
                "subscription.removed": true,
            },
        });

        revalidatePath("/admin/subscription");
        revalidatePath("/admin");
        revalidatePath("/admin/users");

        return {
            success: true,
            message: "Pending subscription deleted.",
        };
    } catch (error) {
        console.error("deleteUserPendingSubscription error:", error);
        return {
            success: false,
            message: "Failed to delete pending subscription.",
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
            data: packages,
        };
    } catch (error) {
        console.error("getAllPackagesSimple error:", error);
        return {
            success: false,
            data: [],
        };
    }
}
export async function deletePendingSubscriptionTransaction(transactionId: string) {
    try {
        await connectToDatabase();

        const tx: any = await Transaction.findById(transactionId);
        if (!tx) {
            return {
                success: false,
                message: "Transaction not found.",
            };
        }

        const status = String(tx?.status || "").toLowerCase();

        if (!["pending", "failed", "cancelled"].includes(status)) {
            return {
                success: false,
                message: "Only pending, failed, or cancelled transactions can be deleted.",
            };
        }

        await Transaction.findByIdAndDelete(transactionId);

        revalidatePath("/admin/subscription");
        revalidatePath("/admin");
        revalidatePath("/admin/transactions");

        return {
            success: true,
            message: "Pending subscription transaction deleted.",
        };
    } catch (error) {
        console.error("deletePendingSubscriptionTransaction error:", error);
        return {
            success: false,
            message: "Failed to delete transaction.",
        };
    }
}