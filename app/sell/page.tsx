import SellPageClient from "@/components/shared/SellPageClient";
import { getAllPackages } from "@/lib/actions/packages.actions";

type SellPageProps = {
    searchParams?: Promise<{
        category?: string;
        subcategory?: string;
        payStatus?: string;
        tx?: string;
    }>;
};

export default async function SellPage({ searchParams }: SellPageProps) {
    const params = (await searchParams) || {};

    const category = params.category || "";
    const subcategory = params.subcategory || "";
    const payStatus = params.payStatus || "";
    const tx = params.tx || "";

    const packagesList = (await getAllPackages()) || [];

    return (
        <SellPageClient
            category={category}
            subcategory={subcategory}
            packagesList={packagesList}
            payStatus={payStatus}
            tx={tx}
        />
    );
}