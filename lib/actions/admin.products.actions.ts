"use server";

import { connectToDatabase } from "@/lib/database";
import DynamicAd from "@/lib/database/models/dynamicAd.model";
import User from "@/lib/database/models/user.model";
import Subcategory from "@/lib/database/models/subcategory.model";
import Packages from "@/lib/database/models/packages.model";
import { revalidatePath } from "next/cache";

export async function getAdminProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
}) {
    try {
        await connectToDatabase();

        const page = Math.max(Number(params.page || 1), 1);
        const limit = Math.min(Math.max(Number(params.limit || 20), 1), 200);
        const skip = (page - 1) * limit;

        const search = String(params.search || "").trim();
        const status = String(params.status || "").trim();
        const category = String(params.category || "").trim();

        const query: any = {};

        if (status) query.adstatus = status;
        if (category) query["data.category"] = { $regex: category, $options: "i" };

        if (search) {
            query.$or = [
                { "data.title": { $regex: search, $options: "i" } },
                { "data.description": { $regex: search, $options: "i" } },
                { "data.category": { $regex: search, $options: "i" } },
                { "data.subcategory": { $regex: search, $options: "i" } },
                { "data.phone": { $regex: search, $options: "i" } },
            ];
        }

        const [items, total] = await Promise.all([
            DynamicAd.find(query)
                .populate({
                    path: "organizer",
                    model: User,
                    select:
                        "_id email firstName lastName businessname phone whatsapp verified imageUrl photo",
                })
                .populate({
                    path: "subcategory",
                    model: Subcategory,
                    select: "subcategory category",
                })
                .populate({
                    path: "plan",
                    model: Packages,
                    select: "name color",
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            DynamicAd.countDocuments(query),
        ]);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(items)),
            total,
            page,
            totalPages: Math.max(Math.ceil(total / limit), 1),
        };
    } catch (error: any) {
        console.error("getAdminProducts error:", error);

        return {
            success: false,
            data: [],
            total: 0,
            page: 1,
            totalPages: 1,
            message: error?.message || "Failed to load products.",
        };
    }
}

export async function deleteAdminProduct(productId: string) {
    try {
        await connectToDatabase();

        await DynamicAd.findByIdAndDelete(productId);

        revalidatePath("/admin/products");

        return {
            success: true,
        };
    } catch (error: any) {
        console.error("deleteAdminProduct error:", error);

        return {
            success: false,
            message: error?.message || "Failed to delete product.",
        };
    }
}