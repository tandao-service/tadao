// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import DynamicAd from "@/lib/database/models/dynamicAd.model";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const query = String(searchParams.get("query") || "").trim();
        const category = String(searchParams.get("category") || "").trim();
        const region = String(searchParams.get("region") || "").trim();
        const sort = String(searchParams.get("sort") || "recommended").trim();
        const membership = String(searchParams.get("membership") || "").trim();
        const page = Math.max(1, Number(searchParams.get("page") || 1));
        const limit = 24;
        const skip = (page - 1) * limit;

        const mongoQuery: any = {
            adstatus: "Active",
        };

        if (query) {
            mongoQuery.$or = [
                { "data.title": { $regex: query, $options: "i" } },
                { "data.description": { $regex: query, $options: "i" } },
                { "data.make": { $regex: query, $options: "i" } },
                { "data.model": { $regex: query, $options: "i" } },
                { "data.category": { $regex: query, $options: "i" } },
                { "data.subcategory": { $regex: query, $options: "i" } },
            ];
        }

        if (category) {
            mongoQuery["data.subcategory"] = category;
        }

        if (region) {
            mongoQuery["data.region"] = { $regex: `^${escapeRegex(region)}$`, $options: "i" };
        }

        if (membership === "verified") {
            const verifiedUsers = await User.find({
                "verified.accountverified": true,
            }).select("_id");

            mongoQuery.organizer = { $in: verifiedUsers.map((u) => u._id) };
        } else if (membership === "unverified") {
            const unverifiedUsers = await User.find({
                "verified.accountverified": false,
            }).select("_id");

            mongoQuery.organizer = { $in: unverifiedUsers.map((u) => u._id) };
        }

        let sortObj: any = { priority: -1, createdAt: -1 };

        if (sort === "new") sortObj = { createdAt: -1 };
        if (sort === "lowest") sortObj = { "data.price": 1, createdAt: -1 };
        if (sort === "highest") sortObj = { "data.price": -1, createdAt: -1 };

        const groupedMatch: any = {
            adstatus: "Active",
        };

        if (query) {
            groupedMatch.$or = [
                { "data.title": { $regex: query, $options: "i" } },
                { "data.description": { $regex: query, $options: "i" } },
                { "data.make": { $regex: query, $options: "i" } },
                { "data.model": { $regex: query, $options: "i" } },
                { "data.category": { $regex: query, $options: "i" } },
                { "data.subcategory": { $regex: query, $options: "i" } },
            ];
        }

        if (region) {
            groupedMatch["data.region"] = { $regex: `^${escapeRegex(region)}$`, $options: "i" };
        }

        if (membership === "verified") {
            const verifiedUsers = await User.find({
                "verified.accountverified": true,
            }).select("_id");
            groupedMatch.organizer = { $in: verifiedUsers.map((u) => u._id) };
        } else if (membership === "unverified") {
            const unverifiedUsers = await User.find({
                "verified.accountverified": false,
            }).select("_id");
            groupedMatch.organizer = { $in: unverifiedUsers.map((u) => u._id) };
        }

        const [items, total, groupedCategories, groupedRegions] = await Promise.all([
            DynamicAd.find(mongoQuery)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .lean(),

            DynamicAd.countDocuments(mongoQuery),

            DynamicAd.aggregate([
                {
                    $match: {
                        ...groupedMatch,
                        "data.subcategory": { $exists: true, $ne: "" },
                    },
                },
                {
                    $group: {
                        _id: "$data.subcategory",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]),

            DynamicAd.aggregate([
                {
                    $match: {
                        ...groupedMatch,
                        "data.region": { $exists: true, $ne: "" },
                    },
                },
                {
                    $group: {
                        _id: "$data.region",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]),
        ]);

        return NextResponse.json({
            items,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            categories: groupedCategories
                .filter((x) => x._id)
                .map((x) => ({
                    slug: String(x._id)
                        .toLowerCase()
                        .replace(/&/g, "and")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, ""),
                    name: String(x._id),
                    count: x.count,
                })),
            regions: groupedRegions
                .filter((x) => x._id)
                .map((x) => ({
                    name: String(x._id),
                    count: x.count,
                })),
        });
    } catch (error: any) {
        console.error("SEARCH API ERROR:", error);
        return NextResponse.json(
            { error: error?.message || "Search failed" },
            { status: 500 }
        );
    }
}

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}