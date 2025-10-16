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
    withTimeout(getAllCategoriesCached(), 1500, categoriesFallback),
    withTimeout(getAllSubCategoriesCached(), 1500, subcategoriesFallback),
    withTimeout(getAllPackagesCached(), 1500, packagesFallback),
    withTimeout(getAdsCountAllRegionCached(), 1500, adsCountFallback),
    withTimeout(getallPendingLaonsCached(), 1500, loansFallback),
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
      {/* JSON-LD … (unchanged) */}

      <Shell>
        <Suspense
          fallback={
            // PLAIN HTML/CSS fallback (no MUI)
            <div className="flex justify-center items-center h-dvh w-full">
              <div className="animate-pulse text-gray-600">Loading marketplace…</div>
            </div>
          }
        >
          <HeavyData queryObject={queryObject} />
        </Suspense>
      </Shell>
    </>
  );
}
