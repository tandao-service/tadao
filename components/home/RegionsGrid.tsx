// components/home/RegionsGrid.tsx
import type { HomeRegion } from "@/lib/home/home.data";

export default function RegionsGrid({ regions }: { regions: HomeRegion[] }) {
    return (
        <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Browse by Region</h2>
                <a href="/regions" className="text-sm font-bold text-orange-600 hover:underline">
                    All regions
                </a>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {regions.map((r) => (
                    <a
                        key={r.slug}
                        href={`/r/${r.slug}`}
                        className="rounded-xl border bg-slate-50 px-3 py-3 hover:bg-slate-100 transition"
                    >
                        <div className="text-sm font-extrabold">{r.name}</div>
                        <div className="text-xs text-slate-500">{r.count.toLocaleString()} ads</div>
                    </a>
                ))}
            </div>
        </div>
    );
}