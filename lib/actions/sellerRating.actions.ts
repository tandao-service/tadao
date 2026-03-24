"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database";
import SellerRating from "../database/models/sellerRating.model";
import { handleError } from "../utils";
import { hasCompletedBuyerInteraction } from "./sellerReview.guard";

export async function upsertSellerRating({
    sellerId,
    reviewerId,
    adId,
    rating,
    review,
    path,
}: {
    sellerId: string;
    reviewerId: string;
    adId?: string;
    rating: number;
    review?: string;
    path: string;
}) {
    try {
        await connectToDatabase();

        if (!sellerId || !reviewerId) {
            throw new Error("Seller and reviewer are required.");
        }

        if (String(sellerId) === String(reviewerId)) {
            throw new Error("You cannot review yourself.");
        }

        const safeRating = Number(rating);
        if (!Number.isFinite(safeRating) || safeRating < 1 || safeRating > 5) {
            throw new Error("Rating must be between 1 and 5.");
        }

        const allowed = await hasCompletedBuyerInteraction({
            sellerId,
            buyerId: reviewerId,
            adId,
        });

        if (!allowed) {
            throw new Error("You can only review after a completed buyer interaction.");
        }

        const doc = await SellerRating.findOneAndUpdate(
            { seller: sellerId, reviewer: reviewerId },
            {
                seller: sellerId,
                reviewer: reviewerId,
                ad: adId || null,
                rating: safeRating,
                review: String(review || "").trim().slice(0, 500),
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        revalidatePath(path);

        return JSON.parse(JSON.stringify(doc));
    } catch (error) {
        handleError(error);
        throw error;
    }
}

export async function getSellerRatingSummary(sellerId: string) {
    try {
        await connectToDatabase();

        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

        const rows = await SellerRating.aggregate([
            { $match: { seller: sellerObjectId } },
            {
                $group: {
                    _id: "$seller",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 },
                    fiveStar: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                    fourStar: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    threeStar: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    twoStar: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
                },
            },
        ]);

        const summary = rows[0];

        if (!summary) {
            return {
                averageRating: 0,
                totalRatings: 0,
                fiveStar: 0,
                fourStar: 0,
                threeStar: 0,
                twoStar: 0,
                oneStar: 0,
            };
        }

        return JSON.parse(
            JSON.stringify({
                averageRating: Number(summary.averageRating?.toFixed(1) || 0),
                totalRatings: Number(summary.totalRatings || 0),
                fiveStar: Number(summary.fiveStar || 0),
                fourStar: Number(summary.fourStar || 0),
                threeStar: Number(summary.threeStar || 0),
                twoStar: Number(summary.twoStar || 0),
                oneStar: Number(summary.oneStar || 0),
            })
        );
    } catch (error) {
        handleError(error);
        return {
            averageRating: 0,
            totalRatings: 0,
            fiveStar: 0,
            fourStar: 0,
            threeStar: 0,
            twoStar: 0,
            oneStar: 0,
        };
    }
}

export async function getBuyerSellerReview({
    sellerId,
    reviewerId,
}: {
    sellerId: string;
    reviewerId: string;
}) {
    try {
        await connectToDatabase();

        const doc = await SellerRating.findOne({
            seller: sellerId,
            reviewer: reviewerId,
        }).lean();

        return JSON.parse(JSON.stringify(doc || null));
    } catch (error) {
        handleError(error);
        return null;
    }
}

export async function getSellerReviews({
    sellerId,
    limit = 10,
}: {
    sellerId: string;
    limit?: number;
}) {
    try {
        await connectToDatabase();

        const rows = await SellerRating.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate({
                path: "reviewer",
                select: "_id firstName lastName businessname photo imageUrl",
            })
            .lean();

        return JSON.parse(JSON.stringify(rows || []));
    } catch (error) {
        handleError(error);
        return [];
    }
}