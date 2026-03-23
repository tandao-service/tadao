// app/search/page.tsx
import type { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";
type Props = {
    searchParams: {
        query?: string;
        region?: string;
        category?: string;
        page?: string;
        min?: string;
        max?: string;
        sort?: string;
    };
};

export const metadata: Metadata = {
    title: "Search | Tadao Market",
    description: "Search listings on Tadao Market",
};

export default function SearchPage({ searchParams }: Props) {
    return (
        <SearchPageClient
            initialQuery={String(searchParams.query || "").trim()}
            initialRegion={String(searchParams.region || "").trim()}
            initialCategory={String(searchParams.category || "").trim()}
            initialPage={Number(searchParams.page || 1)}
            initialMin={String(searchParams.min || "").trim()}
            initialMax={String(searchParams.max || "").trim()}
            initialSort={String(searchParams.sort || "recommended").trim()}
        />
    );
}