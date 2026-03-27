import { NextResponse } from "next/server";
import { getAllAds, getListingMapFromDB } from "@/lib/actions/dynamicAd.actions";
import { buildAdPath } from "@/app/_ad/ad-url";

const baseUrl = "https://tadaomarket.com";

function slugify(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSlug(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

function safeDateISO(v: any) {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d.getTime()) ? d.toISOString() : undefined;
}

function xmlEscape(v: string) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.5" },
    { loc: `${baseUrl}/terms`, changefreq: "monthly", priority: "0.5" },
    { loc: `${baseUrl}/privacy-policy`, changefreq: "monthly", priority: "0.5" },
  ];

  const [adsRaw, listingMap] = await Promise.all([
    getAllAds(),
    getListingMapFromDB(),
  ]);

  const ads = Array.isArray(adsRaw) ? adsRaw : [];

  // 1) Dynamic ad pages -> new SEO URLs
  const dynamicAdUrls = ads
    .filter((ad: any) => ad && ad._id)
    .map((ad: any) => ({
      loc: `${baseUrl}${buildAdPath(ad)}`,
      lastmod: safeDateISO(ad.updatedAt) || safeDateISO(ad.createdAt),
      changefreq: "weekly",
      priority: "0.7",
    }));

  // 2) Region slugs discovered from ads
  const regions = Array.from(
    new Set(
      ads
        .map((a: any) => a?.data?.region)
        .filter(Boolean)
        .map((r: string) => slugify(r))
        .filter(Boolean)
    )
  );

  // 3) Listing slugs from DB map
  const listingSlugs = Array.from(
    new Set(Object.keys(listingMap || {}).map(normalizeSlug).filter(Boolean))
  );

  // 4) National listing landing pages
  const nationalListingUrls = listingSlugs.map((listingSlug) => ({
    loc: `${baseUrl}/${listingSlug}`,
    changefreq: "daily",
    priority: "0.8",
  }));

  // 5) Region + listing landing pages
  const regionListingUrls = regions.flatMap((regionSlug) =>
    listingSlugs.map((listingSlug) => ({
      loc: `${baseUrl}/r/${regionSlug}/${listingSlug}`,
      changefreq: "daily",
      priority: "0.9",
    }))
  );

  const all = [
    ...staticUrls,
    ...nationalListingUrls,
    ...regionListingUrls,
    ...dynamicAdUrls,
  ];

  const unique = Array.from(
    new Map(all.map((item) => [item.loc, item])).values()
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
      .map(
        (u: any) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ""}
    <changefreq>${xmlEscape(u.changefreq)}</changefreq>
    <priority>${xmlEscape(u.priority)}</priority>
  </url>`
      )
      .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}