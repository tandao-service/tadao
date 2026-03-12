import SellPageClient from "@/components/shared/SellPageClient";

type SellPageProps = {
    searchParams?: Promise<{
        category?: string;
        subcategory?: string;
    }>;
};

export default async function SellPage({ searchParams }: SellPageProps) {
    const params = (await searchParams) || {};

    const category = params.category || "";
    const subcategory = params.subcategory || "";

    return (
        <SellPageClient
            category={category}
            subcategory={subcategory}
        />
    );
}