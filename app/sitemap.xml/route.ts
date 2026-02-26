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

export async function GET() {
  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.5" },
    { loc: `${baseUrl}/terms`, changefreq: "monthly", priority: "0.5" },
    { loc: `${baseUrl}/privacy-policy`, changefreq: "monthly", priority: "0.5" },
  ];

  // Fetch once
  const [ads, listingMap] = await Promise.all([
    getAllAds(),
    getListingMapFromDB(),
  ]);

  // 1) Dynamic ad pages (/property/:id)
  const dynamicAdUrls = (ads || [])
    .filter((ad: any) => ad && ad._id)
    .map((ad: any) => {
      const d = ad.updatedAt ? new Date(ad.updatedAt) : new Date();
      const lastmod = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();

      return {
        loc: `${baseUrl}/property/${ad._id}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.7",
      };
    });

  // 2) Region slugs discovered from ads
  const regions = Array.from(
    new Set(
      (ads || [])
        .map((a: any) => a?.data?.region)
        .filter(Boolean)
        .map((r: string) => slugify(r))
    )
  );

  // 3) Listing slugs discovered from DB map (source of truth)
  const listingSlugs = Object.keys(listingMap || {});
  // If empty, avoid generating nothing
  // (but your listingMap should not be empty if subcategories exist)

  // 4) Region + listing landing pages
  const listingUrls = regions.flatMap((regionSlug) =>
    listingSlugs.map((listingSlug) => ({
      loc: `${baseUrl}/${regionSlug}/${listingSlug}`,
      changefreq: "daily",
      priority: "0.9",
    }))
  );

  const all = [...staticUrls, ...listingUrls, ...dynamicAdUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
      .map(
        (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
      )
      .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}