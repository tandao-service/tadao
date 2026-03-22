import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { getAdById, getRelatedAdsServer } from "@/lib/actions/dynamicAd.actions";
import CopyLinkButton from "@/components/shared/CopyLinkButton";
import TopBar from "@/components/home/TopBar.client";
import MobileBackPill from "@/components/home/MobileBackPill.client";
import RelatedPropertiesInfinite from "@/components/home/RelatedPropertiesInfinite";
import PropertyGallery from "@/app/property/PropertyGallery";
import { IoCall, IoChatboxOutline, IoChatbubbleOutline, IoMail } from "react-icons/io5";

type Props = {
    params: {
        id: string;
    };
};

function stripHtml(input: any) {
    return String(input || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function moneyKsh(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return "";
    return `KSh ${n.toLocaleString()}`;
}

function safeStr(v: any) {
    return String(v ?? "").trim();
}

function slugify(input: string) {
    return String(input ?? "")
        .toLowerCase()
        .trim()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function detectMode(name: string): "rent" | "sale" {
    const s = String(name ?? "").toLowerCase();
    return /\b(rent|rental|to let|letting|lease)\b/.test(s) ? "rent" : "sale";
}

function stripIntent(name: string) {
    return String(name ?? "")
        .replace(/for\s+rent/gi, "")
        .replace(/for\s+sale/gi, "")
        .replace(/to\s+let/gi, "")
        .replace(/rent(al)?/gi, "")
        .replace(/lease/gi, "")
        .trim();
}

function toListingSlugFromName(name: string) {
    const mode = detectMode(name);
    const base = stripIntent(name);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";
    return `${slugify(base)}-${suffix}`;
}

function buildSpecs(data: any) {
    const items = [
        { label: "Category", value: safeStr(data?.category) },
        { label: "Subcategory", value: safeStr(data?.subcategory) },
        { label: "Condition", value: safeStr(data?.condition) },
        { label: "Brand", value: safeStr(data?.brand) },
        { label: "Model", value: safeStr(data?.model) },
        { label: "Region", value: safeStr(data?.region) },
        { label: "Area", value: safeStr(data?.area) },
    ];

    return items.filter((item) => item.value);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const ad: any = await getAdById(params.id).catch(() => null);
    const url = `https://tadaomarket.com/ads/${params.id}`;

    if (!ad) {
        return {
            title: "Listing Not Found | Tadao Market",
            robots: { index: false, follow: false },
            alternates: { canonical: url },
        };
    }

    const data = ad?.data || {};
    const titleText = data?.title
        ? `${data.title} | Tadao Market`
        : "Listing | Tadao Market";

    const description =
        (data?.description ? stripHtml(data.description).slice(0, 160) : "") ||
        "Browse listings on Tadao Market.";

    const ogImage =
        data?.coverThumbUrl ||
        (Array.isArray(data?.imageUrls) && data.imageUrls.length > 0
            ? data.imageUrls[0]
            : null) ||
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

export default async function AdDetailsPage({ params }: Props) {
    const ad: any = await getAdById(params.id).catch(() => null);

    if (!ad) {
        return (
            <>
                <TopBar />
                <main className="mx-auto max-w-4xl px-4 pt-[calc(var(--topbar-h,64px)+18px)] pb-10 text-center">
                    <div className="rounded-[28px] border border-orange-100 bg-white p-10 shadow-sm">
                        <h1 className="text-2xl font-extrabold text-slate-900">
                            Listing not found
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Please check the URL or search again.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/"
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-orange-500 px-6 text-sm font-bold text-white hover:bg-orange-600"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const data = ad?.data || {};
    const organizer = ad?.organizer || {};

    const title = safeStr(data?.title) || "Listing";
    const description = stripHtml(data?.description || "");
    const region = safeStr(data?.region) || "Kenya";
    const area = safeStr(data?.area);

    const images: string[] = Array.isArray(data?.imageUrls)
        ? data.imageUrls.filter(Boolean)
        : [];
    const cover =
        safeStr(data?.coverThumbUrl) || (images.length > 0 ? images[0] : "") || "";
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

    const sellerPhoto =
        safeStr(organizer?.photo) || safeStr(organizer?.imageUrl) || "";

    const isVerified =
        organizer?.verified?.accountverified === true ||
        organizer?.verified?.[0]?.accountverified === true;

    const canonicalUrl = `https://tadaomarket.com/ads/${ad._id}`;

    const organizerId = safeStr(organizer?._id);
    const chatHref = organizerId
        ? `/profile-messages/${encodeURIComponent(organizerId)}`
        : "/profile-messages";

    const specs = buildSpecs(data);

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

    const PAGE_SIZE = 8;
    const relatedInitial =
        (await getRelatedAdsServer({
            subcategory: safeStr(data?.subcategory),
            adId: String(ad?._id),
            limit: PAGE_SIZE,
        }).catch(() => [])) || [];

    return (
        <>
            <TopBar />
            <MobileBackPill label="Back" />

            <main className="mx-auto max-w-6xl px-4 pt-[calc(var(--topbar-h,64px)+12px)] pb-8">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
                />

                <div className="mb-4 rounded-2xl border border-orange-100 bg-white p-3 text-sm text-slate-600 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/" className="font-bold text-slate-900 hover:underline">
                            Home
                        </Link>

                        {safeStr(data?.subcategory) ? (
                            <>
                                <span className="text-slate-400">/</span>
                                <Link
                                    href={`/${toListingSlugFromName(safeStr(data.subcategory))}`}
                                    className="font-bold text-slate-900 hover:underline"
                                >
                                    {safeStr(data.subcategory)}
                                </Link>
                            </>
                        ) : null}

                        <span className="text-slate-400">/</span>
                        <span className="text-slate-500">{region}</span>

                        {area ? (
                            <>
                                <span className="text-slate-400">/</span>
                                <span className="text-slate-500">{area}</span>
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
                    <div className="lg:col-span-8">
                        <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
                            <PropertyGallery
                                title={title}
                                images={galleryImages}
                                badgeText={
                                    safeStr(data?.subcategory) ||
                                    safeStr(data?.category) ||
                                    "Listing"
                                }
                            />

                            <div className="p-5 md:p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                                            {title}
                                        </h1>

                                        <div className="mt-2 text-sm text-slate-600">
                                            {region}
                                            {area ? ` • ${area}` : ""}
                                            {safeStr(data?.condition) ? ` • ${safeStr(data?.condition)}` : ""}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-orange-50 px-4 py-3">
                                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                                            Price
                                        </div>
                                        <div className="mt-1 text-xl font-extrabold text-orange-600">
                                            {priceText}
                                        </div>
                                    </div>
                                </div>

                                {(data?.unit || data?.per || data?.period) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {data?.unit && data?.contact === "specify" ? (
                                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                                                {safeStr(data.unit)}
                                            </span>
                                        ) : null}
                                        {data?.per ? (
                                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                                                {safeStr(data.per)}
                                            </span>
                                        ) : null}
                                        {data?.period ? (
                                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                                                {safeStr(data.period)}
                                            </span>
                                        ) : null}
                                    </div>
                                )}

                                {specs.length > 0 ? (
                                    <div className="mt-6">
                                        <h2 className="text-lg font-extrabold text-slate-900">
                                            Key details
                                        </h2>

                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {specs.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        {item.label}
                                                    </div>
                                                    <div className="mt-1 text-sm font-bold text-slate-900">
                                                        {item.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {description ? (
                                    <div className="mt-6">
                                        <h2 className="text-lg font-extrabold text-slate-900">
                                            Description
                                        </h2>
                                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                                            {description}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="space-y-3 lg:sticky lg:top-[calc(var(--topbar-h,64px)+12px)]">
                            <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
                                <div className="text-sm text-slate-500">Price</div>
                                <div className="mt-1 text-2xl font-extrabold text-slate-900">
                                    {priceText}
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-14 w-14 overflow-hidden rounded-full border border-orange-100 bg-orange-50">
                                        {sellerPhoto ? (
                                            <Image
                                                src={sellerPhoto}
                                                alt={sellerName}
                                                width={96}
                                                height={96}
                                                className="h-14 w-14 object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-14 w-14 items-center justify-center text-sm font-bold text-orange-600">
                                                {sellerName.slice(0, 1).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="truncate font-extrabold text-slate-900">
                                            {sellerName}
                                        </div>
                                        <div className="mt-0.5 text-xs text-slate-500">
                                            {isVerified ? "Verified Seller" : "Seller"}
                                        </div>
                                    </div>

                                    {isVerified ? (
                                        <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-extrabold text-emerald-700">
                                            VERIFIED
                                        </span>
                                    ) : null}
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-2">
                                    {phone ? (
                                        <a
                                            href={`tel:${phone}`}
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                        >
                                            <IoCall /> Call {phone}
                                        </a>
                                    ) : null}

                                    {whatsapp ? (
                                        <a
                                            href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                        >
                                            <IoChatbubbleOutline /> WhatsApp {whatsapp}
                                        </a>
                                    ) : null}

                                    {email ? (
                                        <a
                                            href={`mailto:${email}`}
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                                        >
                                            <IoMail /> Email {email}
                                        </a>
                                    ) : null}

                                    <Link
                                        href={chatHref}
                                        className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-center text-sm font-extrabold text-orange-600 hover:bg-orange-100"
                                    >
                                        <IoChatboxOutline /> Chat seller
                                    </Link>

                                    <CopyLinkButton
                                        url={canonicalUrl}
                                        className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600"
                                    >
                                        Share (copy link)
                                    </CopyLinkButton>

                                    <Link
                                        href={`/ads/${ad._id}/update`}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-900 hover:bg-slate-50"
                                    >
                                        Edit this ad
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>

                <RelatedPropertiesInfinite
                    initial={relatedInitial}
                    subcategory={safeStr(data?.subcategory)}
                    currentAdId={String(ad?._id)}
                    regionFallback={region}
                    pageSize={PAGE_SIZE}
                />
            </main>
        </>
    );
}