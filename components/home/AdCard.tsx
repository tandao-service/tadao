// components/home/AdCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { HomeAd } from "@/lib/home/home.data";
import { IoAddSharp, IoCamera } from "react-icons/io5";

function moneyKsh(v: number | null) {
    if (!v || v <= 0) return "Contact for price";
    return `KSh ${v.toLocaleString()}`;
}

export default function AdCard({ ad }: { ad: HomeAd }) {
    const {
        id,
        title,
        price,
        region,
        area,
        image,
        imagesCount,
        isFeatured,
        isTop,
        isVerifiedSeller,
    } = ad;

    return (
        <Link
            href={`/property/${id}`}
            className="block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
        >
            {/* IMAGE */}
            <div className="relative">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        width={800}
                        height={450}
                        className="h-[190px] w-full object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-[190px] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-slate-100 to-orange-100">
                        <div className="flex flex-col items-center gap-2">
                            <Image src="/logo.png" alt="Logo" width={36} height={36} />
                            <span className="text-[11px] font-bold text-orange-500">
                                {region}
                            </span>
                        </div>
                    </div>
                )}

                {/* LEFT BADGES */}
                <div className="absolute left-0 top-0 flex flex-col gap-1">
                    {isFeatured && (
                        <div className="rounded-br-lg rounded-tl-sm bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white shadow">
                            ⭐ FEATURED
                        </div>
                    )}

                    {isTop && (
                        <div className="rounded-br-lg rounded-tl-sm bg-black/80 px-2 py-1 text-[10px] font-extrabold text-white shadow">
                            🔥 TOP
                        </div>
                    )}
                </div>

                {/* VERIFIED */}
                {isVerifiedSeller && (
                    <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Verified
                    </div>
                )}

                {/* IMAGE COUNT */}
                <div className="absolute bottom-2 left-2 rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">
                    <div className="flex gap-1 items-center">
                        <IoCamera /> {imagesCount ?? 0}
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold">{title}</h3>

                <div className="mt-1 line-clamp-1 text-[12px] text-slate-500">
                    {region}
                    {area ? ` • ${area}` : ""}
                </div>

                <div className="mt-2 text-sm font-extrabold text-orange-600">
                    {moneyKsh(price)}
                </div>
            </div>
        </Link>
    );
}