"use server";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Packages from "@/lib/database/models/packages.model";
import { requireCanPostAd } from "@/lib/actions/subscription.guard";
import { handleError } from "@/lib/utils";
import { createTransaction } from "@/lib/actions/transactions.actions";

function normalizePeriodKey(period: string) {
    const p = String(period || "").toLowerCase().trim();

    if (p.includes("week")) return "1 week";
    if (p.includes("3") && p.includes("month")) return "3 months";
    if (p.includes("6") && p.includes("month")) return "6 months";
    if (p.includes("year") || p.includes("12")) return "1 year";
    return "1 month";
}

export async function getSellPostGate(userId: string) {
    try {
        await connectToDatabase();

        const gate: any = await requireCanPostAd(userId);

        return {
            allowed: gate.allowed,
            reason: gate.reason || null,
            planId: gate.planId || null,
        };
    } catch (error) {
        handleError(error);
        return {
            allowed: false,
            reason: "Unable to verify posting eligibility.",
            planId: null,
        };
    }
}

type CreateSellSubscriptionCheckoutParams = {
    userId: string;
    packageId: string;
    period: string;
    returnUrl: string;
};

export async function createSellSubscriptionCheckout({
    userId,
    packageId,
    period,
    returnUrl,
}: CreateSellSubscriptionCheckoutParams) {
    try {
        await connectToDatabase();

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const pkg = await Packages.findById(packageId);
        if (!pkg) throw new Error("Package not found");

        const periodKey = normalizePeriodKey(period);
        const prices = Array.isArray(pkg.price) ? pkg.price : [];
        const priceRow = prices.find(
            (x: any) => String(x.period).toLowerCase() === periodKey
        );

        const amount = Number(priceRow?.amount || 0);

        if (!amount || amount <= 0) {
            throw new Error("Invalid package amount");
        }

        /**
         * IMPORTANT:
         * Map this payload to your existing createTransaction() signature.
         * The goal is to create a PENDING subscription transaction,
         * then redirect to /pay/[transactionId].
         */
        const tx: any = await createTransaction({
            userId,
            type: "subscription",
            amount,
            currency: "KES",
            planId: pkg._id.toString(),
            planName: pkg.name,
            period: periodKey,
            status: "Pending",
            source: "sell-flow",
            returnUrl,
            path: "/sell",
        } as any);

        return {
            ok: true,
            transactionId: tx?._id?.toString?.() || tx?.id || "",
            amount,
            planName: pkg.name,
            period: periodKey,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message || "Failed to create checkout.",
        };
    }
}