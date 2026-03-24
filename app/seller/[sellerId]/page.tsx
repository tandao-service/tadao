import type { Metadata } from "next";
import TopBar from "@/components/home/TopBar.client";
import MobileBackPill from "@/components/home/MobileBackPill.client";
import { getAdByUser } from "@/lib/actions/dynamicAd.actions";
import {
    getSellerRatingSummary,
    getSellerReviews,
} from "@/lib/actions/sellerRating.actions";
import { getSellerProfileStats } from "@/lib/actions/sellerProfile.actions";
import SellerProfileClient from "./SellerProfileClient";

type Props = {
    params: { sellerId: string };
};

function safeStr(v: any) {
    return String(v ?? "").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const adsResult = await getAdByUser({
        userId: params.sellerId,
        page: 1,
        limit: 1,
        sortby: "new",
        myshop: false,
    }).catch(() => null);

    const seller = adsResult?.data?.[0]?.organizer;

    const sellerName =
        safeStr(seller?.businessname) ||
        `${safeStr(seller?.firstName)} ${safeStr(seller?.lastName)}`.trim() ||
        "Seller";

    const title = `${sellerName} | Seller Profile | Tadao Market`;
    const description = `Browse active ads from ${sellerName} on Tadao Market.`;

    return {
        title,
        description,
        alternates: { canonical: `https://tadaomarket.com/seller/${params.sellerId}` },
        openGraph: {
            title,
            description,
            url: `https://tadaomarket.com/seller/${params.sellerId}`,
            siteName: "Tadao Market",
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function SellerProfilePage({ params }: Props) {
    const result = await getAdByUser({
        userId: params.sellerId,
        page: 1,
        limit: 100,
        sortby: "new",
        myshop: false,
    }).catch(() => null);

    const ads = result?.data || [];
    const seller = ads?.[0]?.organizer || null;

    const ratingSummary = await getSellerRatingSummary(params.sellerId);
    const profileStats = await getSellerProfileStats({ seller, ads });
    const reviews = await getSellerReviews({ sellerId: params.sellerId, limit: 8 });

    return (
        <>
            <TopBar />
            <MobileBackPill label="Back" />

            <main className="mx-auto max-w-7xl px-3 pt-[calc(var(--topbar-h,64px)+10px)] pb-8 md:px-4">
                <SellerProfileClient
                    seller={seller}
                    ads={ads}
                    sellerId={params.sellerId}
                    ratingSummary={ratingSummary}
                    profileStats={profileStats}
                    reviews={reviews}
                />
            </main>
        </>
    );
}