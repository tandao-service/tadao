// app/(root)/page.tsx

import HomePage from "@/components/home/HomePage";
import { getHomePageData } from "@/lib/home/home.data";

export const dynamic = "force-dynamic";
export const revalidate = 120;

export default async function Page() {
  const data = await getHomePageData();
  return <HomePage {...data} />;
}