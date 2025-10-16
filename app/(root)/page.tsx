// app/page.tsx

import MainClient from "@/components/shared/MainClient";
import SplashHandler from "@/components/shared/SplashHandlerAdroid";
import {
  getAllCategoriesCached,
  getAllSubCategoriesCached,
  getAllPackagesCached,
  getAdsCountAllRegionCached,
  getallPendingLaonsCached,
} from "@/lib/actions/cached.actions";
import { GlobalDataProvider } from "@/public/context/GlobalDataContext";
import { SearchParamProps } from "@/types";
import Script from "next/script";

export default async function Home({ searchParams }: SearchParamProps) {
  const queryObject = searchParams
    ? Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined)
    )
    : {};

  // ✅ Fetch server-side cached/global data
  const [categories, subcategories, packages, adsCount, loans] = await Promise.all([
    getAllCategoriesCached(),
    getAllSubCategoriesCached(),
    getAllPackagesCached(),
    getAdsCountAllRegionCached(),
    getallPendingLaonsCached(),
  ]);

  return (<>
    {/* Organization JSON-LD */}
    <Script id="org-jsonld" type="application/ld+json"
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
    <Script id="website-jsonld" type="application/ld+json"
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
    <GlobalDataProvider
      initialData={{
        categories,
        subcategories,
        packages,
        adsCount,
        loans,
      }}
    >
      <MainClient
        queryObject={queryObject}
      />
    </GlobalDataProvider>
  </>

  );
}
