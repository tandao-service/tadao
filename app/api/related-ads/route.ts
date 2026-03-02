// app/api/related-ads/route.ts
import { NextResponse } from "next/server";
import { getRelatedAdsServer } from "@/lib/actions/dynamicAd.actions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const subcategory = String(searchParams.get("subcategory") || "").trim();
    const adId = String(searchParams.get("adId") || "").trim();

    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") || "8"))); // safety

    // ✅ if your action doesn’t support skip/page yet, add skip support there too
    const skip = (page - 1) * limit;

    const items =
      (await getRelatedAdsServer({
        subcategory,
        adId,
        limit,
        skip, // 👈 add this param in your action (shown below)
      }).catch(() => [])) || [];

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e?.message || "Error" }, { status: 500 });
  }
}