// components/shared/SmartPropertyCard.tsx
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProgressPopup from "./ProgressPopup";

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "KSh 0";
    return `KSh ${n.toLocaleString()}`;
}

function safeStr(v: any) {
    return (v ?? "").toString().trim();
}

function chip(label: string) {
    return (
        <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
            {label}
        </span>
    );
}

type Props = {
    ad: any;
    regionFallback?: string;
};

export default function SmartPropertyCard({ ad, regionFallback }: Props) {
    const id = String(ad?._id || "");
    const title = safeStr(ad?.data?.title) || "Listing";
    const region = safeStr(ad?.data?.region) || safeStr(regionFallback);
    const area = safeStr(ad?.data?.area);

    const image =
        ad?.data?.coverThumbUrl ||
        (Array.isArray(ad?.data?.imageUrls) && ad.data.imageUrls.length > 0
            ? ad.data.imageUrls[0]
            : null);

    const imgCount = Array.isArray(ad?.data?.imageUrls) ? ad.data.imageUrls.length : 0;

    const planName = safeStr(ad?.plan?.name);
    const planColor = safeStr(ad?.plan?.color);

    const isVerified = ad?.organizer?.verified?.[0]?.accountverified === true;

    const isContactPrice = ad?.data?.contact === "contact";
    const price = Number(ad?.data?.price || 0);

    const isRent = Boolean(ad?.data?.period || ad?.data?.per);
    const condition = safeStr(ad?.data?.condition);
    const transmission = safeStr(ad?.data?.transimmison);
    const engineCC = safeStr(ad?.data?.["engine-CC"]);
    const landType = safeStr(ad?.data?.["land-Type"]);
    const landArea = safeStr(ad?.data?.["land-Area(acres)"]);
    const hasDelivery = Boolean(ad?.data?.["delivery"]);
    const hasBulk = Boolean(ad?.data?.["bulkprice"]);
    const router = useRouter();
    const [isOpenP, setIsOpenP] = useState(false);
    const handleCloseP = () => {
        setIsOpenP(false);
    };
    return (
        <div
            // href={`/property/${id}`}
            onClick={() => { setIsOpenP(true); router.push(`/?Ad=${id}`); }}
            className="block cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-[#2D3236]"
        >
            {/* Image */}
            <div
                className="relative w-full"
                style={
                    planName && planName !== "Free" && planColor
                        ? { border: "2px solid", borderColor: planColor }
                        : undefined
                }
            >
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        width={800}
                        height={450}
                        className="h-[200px] w-full object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-[200px] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-gray-100 to-orange-100 dark:from-[#1b1f22] dark:via-[#242a2e] dark:to-[#1b1f22]">
                        <div className="flex flex-col items-center gap-2">
                            <Image src="/logo.png" alt="Tadao" width={40} height={40} className="h-10 w-10 object-contain" />
                            <p className="text-[11px] font-bold text-orange-500">{safeStr(ad?.data?.category) || "Listing"}</p>
                        </div>
                    </div>
                )}

                {/* Plan badge */}
                {planName && planName !== "Free" && (
                    <div
                        className="absolute left-0 top-0 rounded-br-lg rounded-tl-sm px-2 py-1 text-[10px] font-semibold text-white shadow-lg"
                        style={{ backgroundColor: planColor || "#111827" }}
                    >
                        {planName}
                    </div>
                )}

                {/* Verified badge */}
                {isVerified && (
                    <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Verified
                    </div>
                )}

                {/* Bottom mini badges */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2">
                    <div className="flex items-center gap-1 rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">
                        🖼️ {imgCount}
                    </div>

                    {ad?.data?.["youtube-link"] && (
                        <div className="rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">YouTube</div>
                    )}

                    {ad?.data?.["virtualTourLink"] && (
                        <div className="rounded-sm bg-black/70 px-2 py-1 text-[10px] text-white">3D Tour</div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-3">
                <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>

                <div className="mt-1 line-clamp-1 text-[12px] text-gray-600 dark:text-gray-300">
                    {region}
                    {area ? ` - ${area}` : ""}
                </div>

                {/* Price */}
                <div className="mt-2 font-bold text-orange-500">
                    {isContactPrice ? "Contact for price" : price > 0 ? moneyKsh(price) : "KSh 0"}
                    {ad?.data?.unit && ad?.data?.contact === "specify" ? (
                        <span className="ml-2 text-[11px] font-semibold">{safeStr(ad.data.unit)}</span>
                    ) : null}
                    {ad?.data?.per ? <span className="ml-2 text-[11px] font-semibold">{safeStr(ad.data.per)}</span> : null}
                    {ad?.data?.period ? <span className="ml-2 text-[11px] font-semibold">{safeStr(ad.data.period)}</span> : null}
                </div>

                {/* Chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {isRent && chip("Rent")}
                    {condition && chip(condition)}
                    {transmission && chip(transmission)}
                    {engineCC && chip(engineCC)}
                    {landType && chip(landType)}
                    {landArea && chip(landArea)}
                    {hasBulk && chip("Bulk Price")}
                    {hasDelivery && chip("Delivery")}
                </div>
            </div>
            <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
        </div>
    );
}