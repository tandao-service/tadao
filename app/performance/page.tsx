import type { Metadata } from "next";
import PerformancePageClient from "./PerformancePageClient";

export const metadata: Metadata = {
    title: "Performance | Tadao Market",
    description: "Track ad performance, engagement, status, and subscription insights on Tadao Market.",
};

export default async function PerformancePage() {


    return <PerformancePageClient />;
}