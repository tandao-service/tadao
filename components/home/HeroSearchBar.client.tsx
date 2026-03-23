// components/home/HeroSearchBar.client.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

const REGIONS = [
    { value: "all-kenya", label: "All Kenya" },
    { value: "nairobi", label: "Nairobi" },
    { value: "kiambu", label: "Kiambu" },
    { value: "nakuru", label: "Nakuru" },
    { value: "mombasa", label: "Mombasa" },
];

export default function HeroSearchBar() {
    const router = useRouter();
    const [region, setRegion] = useState("all-kenya");
    const [q, setQ] = useState("");

    const go = () => {
        const query = new URLSearchParams();
        if (q.trim()) query.set("q", q.trim());
        if (region !== "all-kenya") query.set("region", region);
        router.push(`/r/?${query.toString()}`);
    };

    return (
        <div className="rounded-2xl bg-white p-2 shadow-lg">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[170px_1fr_52px]">
                <label className="flex items-center gap-2 rounded-xl border px-3 py-2">
                    <span className="text-sm">📍</span>
                    <select
                        className="w-full bg-transparent text-sm outline-none"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                    >
                        {REGIONS.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                </label>

                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && go()}
                    placeholder="Search keywords..."
                    className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                />

                <button
                    onClick={go}
                    className="items-center justify-center p-2 rounded-xl bg-orange-500 text-white font-extrabold hover:bg-orange-600"
                    aria-label="Search"
                >
                    <IoSearch />
                </button>
            </div>
        </div>
    );
}