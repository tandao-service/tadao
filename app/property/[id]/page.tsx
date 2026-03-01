// app/property/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { getAdById, getRelatedAdsServer } from "@/lib/actions/dynamicAd.actions";
import CopyLinkButton from "@/components/shared/CopyLinkButton";
import PropertyGallery from "../PropertyGallery";

import TopBar from "@/components/home/TopBar.client";
import MobileBackPill from "@/components/home/MobileBackPill.client";


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
        (data?.description ? stripHtml(data.description).slice(0, 160) : "") || "Browse listings on Tadao Market.";

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
    const cover = safeStr(data?.coverThumbUrl) || (images.length > 0 ? images[0] : "") || "";
    const galleryImages = images.length ? images : cover ? [cover] : [];

    const price = Number(data?.price || 0);
    const isContactPrice = data?.contact === "contact";
    const priceText = isContactPrice ? "Contact for price" : moneyKsh(price) || "KSh 0";

    const phone = safeStr(organizer?.phone);
    const whatsapp = safeStr(organizer?.whatsapp);
    const email = safeStr(organizer?.email);

    const sellerName =
        safeStr(organizer?.businessname) ||
        `${safeStr(organizer?.firstName)} ${safeStr(organizer?.lastName)}`.trim() ||
        "Seller";

    const sellerPhoto = safeStr(organizer?.photo) || safeStr(organizer?.imageUrl) || "";

    const isVerified =
        organizer?.verified?.accountverified === true || organizer?.verified?.[0]?.accountverified === true;

    const canonicalUrl = `https://tadaomarket.com/property/${ad._id}`;

    // ✅ chat route (adjust if your app uses a different chat URL)
    const organizerId = safeStr(organizer?._id);
    const chatHref = organizerId ? `/chat?to=${encodeURIComponent(organizerId)}&ad=${encodeURIComponent(String(ad._id))}` : "/chat";

    // JSON-LD
    const ld = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        image: cover ? [cover] : undefined,
        description,
        offers: {
            "@type": "Offer",
            priceCurrency: "KES",
            price: isContactPrice ? undefined : Number.isFinite(price) ? price : undefined,
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
        },
    };

    const related =
        (await getRelatedAdsServer({
            subcategory: safeStr(data?.subcategory),
            adId: String(ad?._id),
            limit: 8,
        }).catch(() => [])) || [];

    return (
        <>
            <TopBar />
            <MobileBackPill label="Back" />

            <main className="mx-auto max-w-6xl p-4 pt-[calc(var(--topbar-h,64px)+12px)]">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

                {/* Breadcrumb + canonical */}
                <div className="mb-4 rounded-2xl border bg-white p-3 text-sm text-gray-600 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/" className="font-bold text-gray-900 hover:underline">
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-500">{region}</span>
                        {area ? (
                            <>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-500">{area}</span>
                            </>
                        ) : null}

                        <span className="ml-auto">
                            <a className="underline" href={canonicalUrl}>
                                Canonical
                            </a>
                        </span>
                    </div>
                </div>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    {/* LEFT */}
                    <div className="lg:col-span-8">
                        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                            <PropertyGallery
                                title={title}
                                images={galleryImages}
                                badgeText={safeStr(data?.subcategory) || safeStr(data?.category) || "Listing"}
                            />

                            <div className="p-4">
                                <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>

                                <div className="mt-2 text-sm text-gray-600">
                                    {region}
                                    {area ? ` • ${area}` : ""}
                                    {safeStr(data?.condition) ? ` • ${safeStr(data?.condition)}` : ""}
                                </div>

                                <div className="mt-4 text-lg font-extrabold text-orange-500">
                                    {priceText}
                                    {data?.unit && data?.contact === "specify" ? (
                                        <span className="ml-2 text-[12px] font-semibold text-orange-500">{safeStr(data.unit)}</span>
                                    ) : null}
                                    {data?.per ? (
                                        <span className="ml-2 text-[12px] font-semibold text-orange-500">{safeStr(data.per)}</span>
                                    ) : null}
                                    {data?.period ? (
                                        <span className="ml-2 text-[12px] font-semibold text-orange-500">{safeStr(data.period)}</span>
                                    ) : null}
                                </div>

                                {description ? (
                                    <div className="mt-6">
                                        <h2 className="text-lg font-extrabold text-gray-900">Description</h2>
                                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{description}</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <aside className="lg:col-span-4">
                        <div className="space-y-3 lg:sticky lg:top-[calc(var(--topbar-h,64px)+12px)]">
                            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                                <div className="text-sm text-gray-500">Price</div>
                                <div className="mt-1 text-xl font-extrabold text-gray-900">{priceText}</div>
                            </div>

                            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 overflow-hidden rounded-full border bg-gray-100">
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
                                        <div className="truncate font-extrabold text-gray-900">{sellerName}</div>
                                        <div className="mt-0.5 text-xs text-gray-500">{isVerified ? "Verified Seller" : "Seller"}</div>
                                    </div>

                                    {isVerified ? (
                                        <span className="ml-auto rounded-full bg-green-100 px-2 py-1 text-[10px] font-extrabold text-green-700">
                                            VERIFIED
                                        </span>
                                    ) : null}
                                </div>

                                {/* Contacts */}
                                <div className="mt-4 grid grid-cols-1 gap-2">
                                    {phone ? (
                                        <a
                                            href={`tel:${phone}`}
                                            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            📞 Call {phone}
                                        </a>
                                    ) : null}

                                    {whatsapp ? (
                                        <a
                                            href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            💬 WhatsApp {whatsapp}
                                        </a>
                                    ) : null}

                                    {email ? (
                                        <a
                                            href={`mailto:${email}`}
                                            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            ✉️ Email {email}
                                        </a>
                                    ) : null}

                                    {/* ✅ Chat button under contacts */}
                                    <Link
                                        href={chatHref}
                                        className="rounded-xl border bg-white px-3 py-2 text-center text-sm font-extrabold text-gray-900 hover:bg-orange-50"
                                    >
                                        💬 Chat seller
                                    </Link>

                                    <CopyLinkButton
                                        url={canonicalUrl}
                                        className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-extrabold text-white hover:bg-orange-600"
                                    >
                                        Share (copy link)
                                    </CopyLinkButton>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>

                {/* Related Ads */}
                <section className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-extrabold text-gray-900">Related Ads</h2>
                        {safeStr(data?.subcategory) ? <span className="text-xs text-gray-500">{safeStr(data.subcategory)}</span> : null}
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
                                const rprice = rdata?.contact === "contact" ? "Contact for price" : moneyKsh(rdata?.price) || "KSh 0";

                                return (
                                    <Link
                                        key={rid}
                                        href={`/property/${rid}`}
                                        className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md"
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
                                                <div className="flex h-32 items-center justify-center bg-gray-100">
                                                    <Image src="/logo.png" alt="Tadao" width={28} height={28} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <div className="line-clamp-2 text-sm font-semibold text-gray-900">{rtitle}</div>
                                            <div className="mt-1 text-sm font-extrabold text-orange-500">{rprice}</div>
                                            <div className="mt-1 line-clamp-1 text-[11px] text-gray-600">
                                                {safeStr(rdata?.region)}
                                                {safeStr(rdata?.area) ? ` - ${safeStr(rdata?.area)}` : ""}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600">No related ads found.</div>
                    )}
                </section>
            </main>
        </>
    );
}