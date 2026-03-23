"use server";

import { connectToDatabase } from "@/lib/database";
import DynamicAd from "@/lib/database/models/dynamicAd.model";
import User from "@/lib/database/models/user.model";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

export async function getActiveAuctionAds(subcategoryId?: string) {
    await connectToDatabase();

    const now = new Date();

    const query: any = {
        biddingEnabled: true,
        adstatus: "Active",
        biddingEndsAt: { $gt: now },
        expirely: { $gt: now },
    };

    if (subcategoryId && Types.ObjectId.isValid(subcategoryId)) {
        query.subcategory = new Types.ObjectId(subcategoryId);
    }

    const ads = await DynamicAd.find(query)
        .populate("organizer", "firstName lastName photo verified whatsapp token")
        .populate("plan", "name color imageUrl")
        .populate("subcategory")
        .sort({ priority: -1, createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(ads));
}

export async function placeBid({
    adId,
    userId,
    amount,
}: {
    adId: string;
    userId: string;
    amount: number;
}) {
    await connectToDatabase();

    const user: any = await User.findById(userId).lean();
    if (!user) {
        throw new Error("User not found");
    }

    const isVerified = Array.isArray(user.verified)
        ? user.verified.some((v: any) => v?.accountverified === true)
        : false;

    if (!isVerified) {
        throw new Error("Only verified users can place bids");
    }

    const ad = await DynamicAd.findById(adId);
    if (!ad) {
        throw new Error("Auction item not found");
    }

    const now = new Date();

    if (!ad.biddingEnabled) {
        throw new Error("Bidding is not enabled for this item");
    }

    if (!ad.biddingEndsAt || new Date(ad.biddingEndsAt) <= now) {
        throw new Error("Bidding has ended");
    }

    if (ad.expirely && new Date(ad.expirely) <= now) {
        throw new Error("This ad has expired");
    }

    if (ad.adstatus !== "Active") {
        throw new Error("This ad is not active");
    }

    const bids = Array.isArray(ad.bids) ? ad.bids : [];
    const highestBid =
        bids.length > 0 ? Math.max(...bids.map((b: any) => Number(b.amount || 0))) : 0;

    const minimumAllowed = highestBid > 0
        ? highestBid + Number(ad.bidIncrement || 100)
        : Number(ad.data?.price || 0);

    if (Number(amount) < minimumAllowed) {
        throw new Error(`Minimum allowed bid is ${minimumAllowed}`);
    }

    ad.bids.push({
        amount: Number(amount),
        userId,
        username: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        timestamp: new Date(),
        isWinner: false,
        isAbusive: false,
    });

    await ad.save();

    revalidatePath("/auction");
    revalidatePath(`/ads/${adId}`);

    return { success: true };
}