// components/home/RegionsGrid.tsx
import Link from "next/link";
import type { HomeRegion } from "@/lib/home/home.data";

export default function RegionsGrid({
    regions,
    listingSlug,
}: {
    regions: HomeRegion[];
    listingSlug: string;
}) {
    const slug = String(listingSlug || "").trim().toLowerCase();

    return (
        <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Browse by Region</h2>

                {/* ✅ Default start: national listing */}
                <Link
                    href={`/${slug}`}
                    className="text-sm font-bold text-orange-600 hover:underline"
                >
                    All regions
                </Link>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {regions.map((r) => (
                    <Link
                        key={r.slug}
                        href={slug ? `/r/${r.slug}/${slug}` : `/r/${r.slug}`} // ✅ region listing
                        className="rounded-xl border bg-slate-50 px-3 py-3 transition hover:bg-slate-100"
                    >
                        <div className="text-sm font-extrabold">{r.name}</div>
                        <div className="text-xs text-slate-500">
                            {r.count.toLocaleString()} ads
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}