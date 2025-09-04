// app/page.tsx

import MainClient from "@/components/shared/MainClient";
import SplashHandler from "@/components/shared/SplashHandler";
import {
  getAllCategoriesCached,
  getAllSubCategoriesCached,
  getAllPackagesCached,
  getAdsCountAllRegionCached,
} from "@/lib/actions/cached.actions";
import { SearchParamProps } from "@/types";

export default async function Home({ searchParams }: SearchParamProps) {
  const queryObject = searchParams
    ? Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined)
    )
    : {};

  // ✅ Fetch server-side cached/global data
  const [categories, subcategories, packages, adsCount] = await Promise.all([
    getAllCategoriesCached(),
    getAllSubCategoriesCached(),
    getAllPackagesCached(),
    getAdsCountAllRegionCached(),
  ]);

  return (<>
    <SplashHandler />
    <MainClient
      categoryList={categories}
      subcategoryList={subcategories}
      packagesList={packages}
      AdsCountPerRegion={adsCount}
      queryObject={queryObject}
    />
  </>

  );
}
