// app/page.tsx
import { Suspense } from "react";
import Script from "next/script";
import MainClient from "@/components/shared/MainClient";
import {
  getAllCategoriesCached,
  getAllSubCategoriesCached,
  getAllPackagesCached,
  getAdsCountAllRegionCached,
  getallPendingLaonsCached,
} from "@/lib/actions/cached.actions";
import { GlobalDataProvider } from "@/public/context/GlobalDataContext";
import type { SearchParamProps } from "@/types";
import { CircularProgress } from "@mui/material";

/** Optimize TTFB via ISR (static HTML + periodic background re-gen) */
export const dynamic = "force-static";
export const revalidate = 300;

/** Generic timeout helper with typed fallback */
const withTimeout = <T,>(p: Promise<T>, ms: number, fallback: T) =>
  Promise.race<T>([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);

/** Derive return types directly from your data functions */
type Categories = Awaited<ReturnType<typeof getAllCategoriesCached>>;
type Subcategories = Awaited<ReturnType<typeof getAllSubCategoriesCached>>;
type Packages = Awaited<ReturnType<typeof getAllPackagesCached>>;
type AdsCount = Awaited<ReturnType<typeof getAdsCountAllRegionCached>>;
type Loans = Awaited<ReturnType<typeof getallPendingLaonsCached>>;

/** Typed fallbacks (match shapes exactly) */
const categoriesFallback: Categories = [] as Categories;
const subcategoriesFallback: Subcategories = [] as Subcategories;
const packagesFallback: Packages = [] as Packages;
/* Example shape: ensure this matches what getAdsCountAllRegionCached() returns */
const adsCountFallback: AdsCount = { adCount: 0 } as AdsCount;
const loansFallback: Loans = [] as any;

/** Minimal shell so something renders instantly */
function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh">{children}</div>;
}

/** Server component that fetches heavy data without blocking TTFB */
async function HeavyData({ queryObject }: { queryObject: Record<string, any> }) {
  const [categories, subcategories, packages, adsCount, loans] = await Promise.all([
    withTimeout<Categories>(getAllCategoriesCached(), 1500, categoriesFallback),
    withTimeout<Subcategories>(getAllSubCategoriesCached(), 1500, subcategoriesFallback),
    withTimeout<Packages>(getAllPackagesCached(), 1500, packagesFallback),
    withTimeout<AdsCount>(getAdsCountAllRegionCached(), 1500, adsCountFallback),
    withTimeout<Loans>(getallPendingLaonsCached(), 1500, loansFallback),
  ]);

  return (
    <GlobalDataProvider
      initialData={{ categories, subcategories, packages, adsCount, loans }}
    >
      <MainClient queryObject={queryObject} />
    </GlobalDataProvider>
  );
}

export default async function Home({ searchParams }: SearchParamProps) {
  const queryObject =
    searchParams
      ? Object.fromEntries(
        Object.entries(searchParams).filter(([, v]) => v !== undefined)
      )
      : {};

  return (
    <>
      {/* Organization JSON-LD */}
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Tadao Market",
            url: "https://tadaomarket.com",
            logo: "https://tadaomarket.com/logo.png",
            sameAs: [
              "https://www.facebook.com/tadaomarket",
              "https://www.instagram.com/tadaomarket",
              "https://twitter.com/tadaomarket",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+254700000000",
              contactType: "customer service",
              areaServed: "KE",
              availableLanguage: ["English", "Swahili"],
            },
          }),
        }}
      />
      {/* WebSite JSON-LD (SearchAction) */}
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Tadao Market",
            url: "https://tadaomarket.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://tadaomarket.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <Shell>
        {/* Put any instant-render hero/nav here if you want */}

        <Suspense fallback={<div className="flex h-screen justify-center items-center h-full text-lg font-bold">
          <div className="flex gap-2 items-center">  <CircularProgress sx={{ color: "gray" }} size={30} /> <div className="hidden lg:inline">Loading marketplace…</div></div>
        </div>}>

          <HeavyData queryObject={queryObject} />
        </Suspense>
      </Shell>
    </>
  );
}
