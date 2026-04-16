import { NextResponse } from "next/server";
import { getGlobalCategoryTree } from "@/lib/home/home-tree-cache";
export const dynamic = "force-dynamic";
export async function GET() {
  const tree = await getGlobalCategoryTree();
  return NextResponse.json({ tree });
}