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
