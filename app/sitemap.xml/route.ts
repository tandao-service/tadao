// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { getAllAds, getListingMapFromDB } from "@/lib/actions/dynamicAd.actions";

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
    .replace(/^\/+|\/+$/g, ""); // remove leading/trailing slashes
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

  const [adsRaw, listingMap] = await Promise.all([getAllAds(), getListingMapFromDB()]);
  const ads = Array.isArray(adsRaw) ? adsRaw : [];

  // 1) Dynamic ad pages (/property/:id)
  const dynamicAdUrls = ads
    .filter((ad: any) => ad && ad._id)
    .map((ad: any) => ({
      loc: `${baseUrl}/ads/${ad._id}`,
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

  // 3) Listing slugs from DB map (source of truth)
  const listingSlugs = Array.from(
    new Set(Object.keys(listingMap || {}).map(normalizeSlug).filter(Boolean))
  );

  // 3b) National listing landing pages: /cars-for-sale
  const nationalListingUrls = listingSlugs.map((listingSlug) => ({
    loc: `${baseUrl}/${listingSlug}`,
    changefreq: "daily",
    priority: "0.8",
  }));

  // 4) Region + listing landing pages: /r/nairobi/cars-for-sale
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
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