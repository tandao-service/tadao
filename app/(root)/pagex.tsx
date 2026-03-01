// app/page.tsx
import { Suspense } from "react";
import Script from "next/script";
import NextDynamic from "next/dynamic";
import {
  getAllCategoriesCached,
  getAllSubCategoriesCached,
  getAllPackagesCached,
  getAdsCountAllRegionCached,
  getallPendingLaonsCached,
} from "@/lib/actions/cached.actions";
import { GlobalDataProvider } from "@/public/context/GlobalDataContext";
import type { SearchParamProps } from "@/types";
import CircularProgress from "@mui/material/CircularProgress";

export const dynamic = "force-static";
export const revalidate = 300;

const MainClient = NextDynamic(() => import("@/components/shared/MainClient"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-center text-gray-600">
      Preparing the marketplace UI…
    </div>
  ),
});

const withTimeout = <T,>(p: Promise<T>, ms: number, fallback: T) =>
  Promise.race<T>([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);

type Categories = Awaited<ReturnType<typeof getAllCategoriesCached>>;
type Subcategories = Awaited<ReturnType<typeof getAllSubCategoriesCached>>;
type Packages = Awaited<ReturnType<typeof getAllPackagesCached>>;
type AdsCount = Awaited<ReturnType<typeof getAdsCountAllRegionCached>>;
type Loans = Awaited<ReturnType<typeof getallPendingLaonsCached>>;

const categoriesFallback = [] as Categories;
const subcategoriesFallback = [] as Subcategories;
const packagesFallback = [] as Packages;
const adsCountFallback = { adCount: 0 } as AdsCount;
const loansFallback = [] as any;

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh">{children}</div>;
}

async function HeavyData({ queryObject }: { queryObject: Record<string, any> }) {
  const [categories, subcategories, packages, adsCount, loans] = await Promise.all([
    getAllCategoriesCached().catch((e) => {
      console.warn("categories failed", e);
      return categoriesFallback;
    }),
    getAllSubCategoriesCached().catch((e) => {
      console.warn("subcategories failed", e);
      return subcategoriesFallback;
    }),
    getAllPackagesCached().catch((e) => {
      console.warn("AllPackages failed", e);
      return packagesFallback;
    }),
    getAdsCountAllRegionCached().catch((e) => {
      console.warn("AdsCountAllRegion failed", e);
      return adsCountFallback;
    }),
    getallPendingLaonsCached().catch((e) => {
      console.warn("allPendingLaons failed", e);
      return loansFallback;
    }),
    // withTimeout(getAllPackagesCached(), 4000, packagesFallback),
    //withTimeout(getAdsCountAllRegionCached(), 4000, adsCountFallback),
    //withTimeout(getallPendingLaonsCached(), 4000, loansFallback),
  ]);

  return (
    <GlobalDataProvider initialData={{ categories, subcategories, packages, adsCount, loans }}>
      <MainClient queryObject={queryObject} />
    </GlobalDataProvider>
  );
}

export default async function Home({ searchParams }: SearchParamProps) {
  const queryObject =
    searchParams ? Object.fromEntries(Object.entries(searchParams).filter(([, v]) => v !== undefined)) : {};

  return (
    <>
      {/* JSON-LD */}
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
        <Suspense
          fallback={
            // PLAIN HTML/CSS fallback (no MUI)
            <div className="flex justify-center items-center h-dvh w-full">
              <div className="flex gap-2 items-center animate-pulse text-gray-600"><CircularProgress sx={{ color: "gray" }} size={30} />Loading marketplace…</div>
            </div>
          }
        >
          <HeavyData queryObject={queryObject} />
        </Suspense>
      </Shell>
    </>
  );
}
