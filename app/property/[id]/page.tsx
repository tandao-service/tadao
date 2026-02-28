// app/property/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import {
    getAdById,
    getRelatedAdsServer,
} from "@/lib/actions/dynamicAd.actions";
import CopyLinkButton from "@/components/shared/CopyLinkButton";

type Props = { params: { id: string } };

function stripHtml(input: any) {
    return String(input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return "";
    return `KSh ${n.toLocaleString()}`;
}

function safeStr(v: any) {
    return String(v ?? "").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const ad: any = await getAdById(params.id).catch(() => null);

    const url = `https://tadaomarket.com/property/${params.id}`;

    if (!ad) {
        return {
            title: "Listing Not Found | Tadao Market",
            robots: { index: false, follow: false },
            alternates: { canonical: url },
        };
    }

    const data = ad?.data || {};
    const titleText = data?.title ? `${data.title} | Tadao Market` : "Listing | Tadao Market";
    const description =
        (data?.description ? stripHtml(data.description).slice(0, 160) : "") ||
        "Browse listings on Tadao Market.";

    const ogImage =
        data?.coverThumbUrl ||
        (Array.isArray(data?.imageUrls) && data.imageUrls.length > 0 ? data.imageUrls[0] : null) ||
        "https://tadaomarket.com/assets/og-image.png";

    return {
        title: titleText,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: titleText,
            description,
            url,
            images: [ogImage],
            type: "article",
            siteName: "Tadao Market",
        },
        twitter: {
            card: "summary_large_image",
            title: titleText,
            description,
            images: [ogImage],
        },
    };
}

export default async function PropertyPage({ params }: Props) {
    const ad: any = await getAdById(params.id).catch(() => null);

    if (!ad) {
        return (
            <main className="mx-auto max-w-4xl p-6 text-center">
                <h1 className="text-2xl font-bold">Listing not found</h1>
                <p className="mt-2 text-gray-600">Please check the URL or search again.</p>
                <div className="mt-6">
                    <Link className="underline" href="/">
                        Go Home
                    </Link>
                </div>
            </main>
        );
    }

    const data = ad?.data || {};
    const organizer = ad?.organizer || {};

    const title = safeStr(data?.title) || "Listing";
    const description = stripHtml(data?.description || "");
    const region = safeStr(data?.region) || "Kenya";
    const area = safeStr(data?.area);

    const images: string[] = Array.isArray(data?.imageUrls) ? data.imageUrls.filter(Boolean) : [];
    const cover =
        safeStr(data?.coverThumbUrl) ||
        (images.length > 0 ? images[0] : "") ||
        "";

    const price = Number(data?.price || 0);
    const isContactPrice = data?.contact === "contact";
    const priceText = isContactPrice ? "Contact for price" : (moneyKsh(price) || "KSh 0");

    const phone = safeStr(organizer?.phone);
    const whatsapp = safeStr(organizer?.whatsapp);
    const email = safeStr(organizer?.email);
    const sellerName =
        safeStr(organizer?.businessname) ||
        `${safeStr(organizer?.firstName)} ${safeStr(organizer?.lastName)}`.trim() ||
        "Seller";

    const sellerPhoto =
        safeStr(organizer?.photo) || safeStr(organizer?.imageUrl) || "";

    const isVerified = organizer?.verified?.accountverified === true || organizer?.verified?.[0]?.accountverified === true;

    const canonicalUrl = `https://tadaomarket.com/property/${ad._id}`;

    // JSON-LD (Product/Offer style)
    const ld = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        image: cover ? [cover] : undefined,
        description,
        offers: {
            "@type": "Offer",
            priceCurrency: "KES",
            price: isContactPrice ? undefined : (Number.isFinite(price) ? price : undefined),
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
        },
    };

    // ✅ Related ads (server-side)
    const related = await getRelatedAdsServer({
        subcategory: safeStr(data?.subcategory),
        adId: String(ad?._id),
        limit: 8,
    }).catch(() => []);

    return (
        <main className="mx-auto max-w-6xl p-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
            />

            {/* Top breadcrumb-ish nav */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="underline">
                    Home
                </Link>
                <span>/</span>
                <span className="text-gray-500">{region}</span>
                {area ? (
                    <>
                        <span>/</span>
                        <span className="text-gray-500">{area}</span>
                    </>
                ) : null}
                <span className="ml-auto">
                    <a className="underline" href={canonicalUrl}>
                        Canonical
                    </a>
                </span>
            </div>

            {/* Layout like your popup: gallery left, seller box right */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* LEFT: Gallery + details */}
                <div className="lg:col-span-8">
                    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-gray-700 dark:bg-[#2D3236]">
                        {/* Main image */}
                        <div className="relative">
                            {cover ? (
                                <Image
                                    src={cover}
                                    alt={title}
                                    width={1200}
                                    height={700}
                                    className="h-[260px] w-full object-cover md:h-[420px]"
                                    unoptimized
                                    priority
                                />
                            ) : (
                                <div className="flex h-[260px] w-full items-center justify-center bg-gradient-to-br from-orange-50 via-gray-100 to-orange-100 dark:from-[#1b1f22] dark:via-[#242a2e] dark:to-[#1b1f22]">
                                    <div className="flex flex-col items-center gap-2">
                                        <Image
                                            src="/logo.png"
                                            alt="Tadao"
                                            width={44}
                                            height={44}
                                            className="h-11 w-11 object-contain"
                                        />
                                        <p className="text-[12px] font-bold text-orange-500">
                                            {safeStr(data?.category) || "Listing"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Overlays */}
                            <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-semibold text-white">
                                {safeStr(data?.subcategory) || safeStr(data?.category) || "Listing"}
                            </div>

                            {images.length > 0 && (
                                <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-semibold text-white">
                                    🖼️ {images.length} photos
                                </div>
                            )}
                        </div>

                        {/* Thumbs */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto p-3">
                                {images.slice(0, 10).map((src, idx) => (
                                    <a
                                        key={`${src}-${idx}`}
                                        href={src}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 overflow-hidden rounded-xl border dark:border-gray-700"
                                        title="Open image"
                                    >
                                        <Image
                                            src={src}
                                            alt={`${title} ${idx + 1}`}
                                            width={160}
                                            height={120}
                                            className="h-20 w-28 object-cover"
                                            unoptimized
                                        />
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-4">
                            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                {title}
                            </h1>

                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                {region}
                                {area ? ` • ${area}` : ""}
                                {safeStr(data?.condition) ? ` • ${safeStr(data?.condition)}` : ""}
                            </div>

                            <div className="mt-4 text-lg font-extrabold text-orange-500">
                                {priceText}
                                {data?.unit && data?.contact === "specify" ? (
                                    <span className="ml-2 text-[12px] font-semibold text-orange-500">
                                        {safeStr(data.unit)}
                                    </span>
                                ) : null}
                                {data?.per ? (
                                    <span className="ml-2 text-[12px] font-semibold text-orange-500">
                                        {safeStr(data.per)}
                                    </span>
                                ) : null}
                                {data?.period ? (
                                    <span className="ml-2 text-[12px] font-semibold text-orange-500">
                                        {safeStr(data.period)}
                                    </span>
                                ) : null}
                            </div>

                            {/* Chips (like your popup) */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {data?.period || data?.per ? (
                                    <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
                                        Rent
                                    </span>
                                ) : null}

                                {safeStr(data?.transimmison) ? (
                                    <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
                                        {safeStr(data.transimmison)}
                                    </span>
                                ) : null}

                                {safeStr(data?.["engine-CC"]) ? (
                                    <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
                                        {safeStr(data["engine-CC"])}
                                    </span>
                                ) : null}

                                {safeStr(data?.["land-Type"]) ? (
                                    <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
                                        {safeStr(data["land-Type"])}
                                    </span>
                                ) : null}

                                {safeStr(data?.["land-Area(acres)"]) ? (
                                    <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
                                        {safeStr(data["land-Area(acres)"])}
                                    </span>
                                ) : null}

                                {data?.bulkprice ? (
                                    <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
                                        Bulk Price
                                    </span>
                                ) : null}

                                {data?.delivery ? (
                                    <span className="rounded-lg border bg-[#ebf2f7] px-2 py-1 text-[10px] text-gray-700 dark:bg-[#131B1E] dark:text-gray-300">
                                        Delivery
                                    </span>
                                ) : null}
                            </div>

                            {/* Description */}
                            {description ? (
                                <div className="mt-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Description
                                    </h2>
                                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                        {description}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Price + seller + actions */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-3 space-y-3">
                        {/* Price card */}
                        <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#2D3236]">
                            <div className="text-sm text-gray-500 dark:text-gray-300">Price</div>
                            <div className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                                {priceText}
                            </div>
                        </div>

                        {/* Seller card */}
                        <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#2D3236]">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full border bg-gray-100 dark:border-gray-700 dark:bg-[#1b1f22]">
                                    {sellerPhoto ? (
                                        <Image
                                            src={sellerPhoto}
                                            alt={sellerName}
                                            width={96}
                                            height={96}
                                            className="h-12 w-12 object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center text-sm font-bold text-gray-500">
                                            {sellerName.slice(0, 1).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <div className="truncate font-bold text-gray-900 dark:text-white">
                                        {sellerName}
                                    </div>
                                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-300">
                                        {isVerified ? "Verified Seller" : "Seller"}
                                    </div>
                                </div>

                                {isVerified ? (
                                    <span className="ml-auto rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                                        VERIFIED
                                    </span>
                                ) : null}
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-2">
                                {phone ? (
                                    <a
                                        href={`tel:${phone}`}
                                        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#2D3236] dark:text-white dark:hover:bg-[#262b2f]"
                                    >
                                        📞 Call {phone}
                                    </a>
                                ) : null}

                                {whatsapp ? (
                                    <a
                                        href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#2D3236] dark:text-white dark:hover:bg-[#262b2f]"
                                    >
                                        💬 WhatsApp {whatsapp}
                                    </a>
                                ) : null}

                                {email ? (
                                    <a
                                        href={`mailto:${email}`}
                                        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#2D3236] dark:text-white dark:hover:bg-[#262b2f]"
                                    >
                                        ✉️ Email {email}
                                    </a>
                                ) : null}

                                {/* Share */}
                                <CopyLinkButton
                                    url={canonicalUrl}
                                    className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-extrabold text-white hover:bg-orange-600"
                                >
                                    Share (copy link)
                                </CopyLinkButton>

                                <div className="text-xs text-gray-500 dark:text-gray-300">
                                    Tip: For fastest browsing, use the popup view from listings.
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            {/* Related Ads */}
            <section className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                        Related Ads
                    </h2>
                    {safeStr(data?.subcategory) ? (
                        <span className="text-xs text-gray-500 dark:text-gray-300">
                            {safeStr(data.subcategory)}
                        </span>
                    ) : null}
                </div>

                {Array.isArray(related) && related.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {related.map((r: any) => {
                            const rid = String(r?._id || "");
                            const rdata = r?.data || {};
                            const rtitle = safeStr(rdata?.title) || "Listing";
                            const rimg =
                                safeStr(rdata?.coverThumbUrl) ||
                                (Array.isArray(rdata?.imageUrls) && rdata.imageUrls.length > 0 ? rdata.imageUrls[0] : "") ||
                                "";
                            const rprice = rdata?.contact === "contact" ? "Contact for price" : (moneyKsh(rdata?.price) || "KSh 0");

                            return (
                                <Link
                                    key={rid}
                                    href={`/property/${rid}`}
                                    className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-[#2D3236]"
                                >
                                    <div className="relative">
                                        {rimg ? (
                                            <Image
                                                src={rimg}
                                                alt={rtitle}
                                                width={800}
                                                height={450}
                                                className="h-32 w-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-32 items-center justify-center bg-gray-100 dark:bg-[#1b1f22]">
                                                <Image src="/logo.png" alt="Tadao" width={28} height={28} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <div className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                                            {rtitle}
                                        </div>
                                        <div className="mt-1 text-sm font-extrabold text-orange-500">
                                            {rprice}
                                        </div>
                                        <div className="mt-1 line-clamp-1 text-[11px] text-gray-600 dark:text-gray-300">
                                            {safeStr(rdata?.region)}
                                            {safeStr(rdata?.area) ? ` - ${safeStr(rdata?.area)}` : ""}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-[#2D3236] dark:text-gray-300">
                        No related ads found.
                    </div>
                )}
            </section>

            {/* ✅ NOTE:
          The "Share (copy link)" button above is server component-safe but doesn't copy yet.
          If you want a working copy button, I’ll give you a tiny client component (ShareButton)
          to drop in without changing this page’s server rendering.
      */}
        </main>
    );
}