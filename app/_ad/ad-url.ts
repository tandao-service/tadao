// app/_ad/ad-url.ts

export function safeStr(v: any) {
    return String(v ?? "").trim();
}

export function slugify(input: string) {
    return String(input ?? "")
        .toLowerCase()
        .trim()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function stripIntent(name: string) {
    return String(name ?? "")
        .replace(/for\s+rent/gi, "")
        .replace(/for\s+sale/gi, "")
        .replace(/to\s+let/gi, "")
        .replace(/rent(al)?/gi, "")
        .replace(/lease/gi, "")
        .trim();
}

export function detectMode(name: string): "rent" | "sale" {
    const s = String(name ?? "").toLowerCase();
    return /\b(rent|rental|to let|letting|lease)\b/.test(s) ? "rent" : "sale";
}

export function toListingSlugFromName(name: string) {
    const mode = detectMode(name);
    const base = stripIntent(name);
    const suffix = mode === "rent" ? "for-rent" : "for-sale";
    return `${slugify(base)}-${suffix}`;
}

export function extractIdFromProductSlug(productSlug: string) {
    const cleaned = String(productSlug || "").trim();
    const match = cleaned.match(/([a-f0-9]{24})$/i);
    return match?.[1] || "";
}

export function getAdId(ad: any) {
    return safeStr(ad?._id || ad?.id);
}

export function buildAdContentSlug(ad: any) {
    const title = safeStr(ad?.data?.title || ad?.title || ad?.name);
    const region = safeStr(ad?.data?.region || ad?.region);
    const slug = slugify([title, region].filter(Boolean).join(" "));
    return slug || "listing";
}

export function generateListingSlug(ad: any) {
    const directListingSlug = safeStr(ad?.listingSlug || ad?.data?.listingSlug);
    if (directListingSlug) return directListingSlug.toLowerCase();

    const subcategory = safeStr(ad?.data?.subcategory || ad?.subcategory);
    const category = safeStr(ad?.data?.category || ad?.category).toLowerCase();

    if (subcategory) {
        const s = subcategory.toLowerCase();



        return toListingSlugFromName(subcategory);
    }

    if (category) {

        return toListingSlugFromName(category);
    }

    return "ads";
}

export function resolveListingSlug(ad: any, listingSlug?: string) {
    if (listingSlug) return safeStr(listingSlug).toLowerCase();
    return generateListingSlug(ad);
}

export function buildAdPath(ad: any, listingSlug?: string) {
    const id = getAdId(ad);
    if (!id) return "/ads";

    const resolvedListingSlug = resolveListingSlug(ad, listingSlug);
    const contentSlug = buildAdContentSlug(ad);

    return `/${resolvedListingSlug}/${contentSlug}-${id}`;
}

export function buildAdAbsoluteUrl(ad: any, listingSlug?: string) {
    return `https://tadaomarket.com${buildAdPath(ad, listingSlug)}`;
}