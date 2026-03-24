import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import DynamicAd from "@/lib/database/models/dynamicAd.model";

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const query = String(searchParams.get("query") || "").trim();
        const region = String(searchParams.get("region") || "").trim();

        if (query.length < 2) {
            return NextResponse.json({ suggestions: [] });
        }

        const safe = escapeRegex(query);

        const match: any = {
            adstatus: "Active",
            $or: [
                { "data.title": { $regex: safe, $options: "i" } },
                { "data.make": { $regex: safe, $options: "i" } },
                { "data.model": { $regex: safe, $options: "i" } },
                { "data.category": { $regex: safe, $options: "i" } },
                { "data.subcategory": { $regex: safe, $options: "i" } },
            ],
        };

        if (region) {
            match["data.region"] = { $regex: `^${escapeRegex(region)}$`, $options: "i" };
        }

        const docs = await DynamicAd.find(match)
            .select("data.title data.make data.model data.category data.subcategory")
            .sort({ priority: -1, createdAt: -1 })
            .limit(12)
            .lean();

        const map = new Map<string, { label: string; value: string }>();

        for (const doc of docs) {
            const title = String(doc?.data?.title || "").trim();
            const make = String(doc?.data?.make || "").trim();
            const model = String(doc?.data?.model || "").trim();
            const subcategory = String(
                doc?.data?.subcategory || doc?.data?.category || ""
            ).trim();

            if (title) {
                const key = title.toLowerCase();
                if (!map.has(key)) {
                    map.set(key, { label: title, value: title });
                }
            }

            const makeModel = [make, model].filter(Boolean).join(" ").trim();
            if (makeModel) {
                const key = makeModel.toLowerCase();
                if (!map.has(key)) {
                    map.set(key, { label: makeModel, value: makeModel });
                }
            }

            if (make && subcategory) {
                const label = `${make} in ${subcategory}`;
                const key = label.toLowerCase();
                if (!map.has(key)) {
                    map.set(key, { label, value: make });
                }
            }
        }

        return NextResponse.json({
            suggestions: Array.from(map.values()).slice(0, 8),
        });
    } catch (error: any) {
        console.error("SEARCH SUGGEST ERROR:", error);
        return NextResponse.json({ suggestions: [] }, { status: 500 });
    }
}