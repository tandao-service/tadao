// app/property/[id]/page.tsx
import { Metadata } from "next";
import { getAdById } from "@/lib/actions/dynamicAd.actions";
import Seodiv from "@/components/shared/seodiv";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const ad: any = await getAdById(params.id).catch(() => null);

    if (!ad) {
        return {
            title: "Listing Not Found | tadaomarket.com",
            robots: { index: false, follow: false },
        };
    }

    const data = ad?.data || {};
    const title = data?.title ? `${data.title} | Tadao Market` : "Listing | Tadao Market";
    const description =
        (data?.description && String(data.description).replace(/<[^>]*>/g, "").slice(0, 160)) ||
        "Browse listings on Tadao Market.";

    const image = (data?.imageUrl?.[0] || data?.imageUrls?.[0]) ?? "https://tadaomarket.com/assets/og-image.png";
    const url = `https://tadaomarket.com/property/${ad._id}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, images: [image], type: "article", siteName: "Tadao Market" },
    };
}

export default async function PropertyPage({ params }: Props) {
    const ad: any = await getAdById(params.id).catch(() => null);

    if (!ad) {
        return (
            <main className="p-6 text-center">
                <h1 className="text-2xl font-bold">Listing not found</h1>
                <p>Please check the URL or search again.</p>
            </main>
        );
    }

    // Add JSON-LD (Product/Offer style)
    const data = ad?.data || {};
    const title = data?.title || "Listing";
    const image = (data?.imageUrl?.[0] || data?.imageUrls?.[0]) ?? "https://tadaomarket.com/assets/og-image.png";
    const price = data?.price;
    const url = `https://tadaomarket.com/property/${ad._id}`;

    const ld = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        image: [image],
        description: (data?.description && String(data.description).replace(/<[^>]*>/g, "")) || "",
        offers: {
            "@type": "Offer",
            priceCurrency: "KES",
            price: price ?? undefined,
            availability: "https://schema.org/InStock",
            url,
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
            <Seodiv ad={ad} />
        </>
    );
}