"use server";

import { handleError } from "../utils";

function formatResponseSpeed(score: number) {
    if (score >= 25) return "Very fast";
    if (score >= 10) return "Fast";
    if (score >= 3) return "Moderate";
    return "Standard";
}

export async function getSellerProfileStats({
    seller,
    ads,
}: {
    seller: any;
    ads: any[];
}) {
    try {
        const totalAds = ads.length;

        const totalViews = ads.reduce((acc, ad) => acc + Number(ad?.views || 0), 0);
        const totalCalls = ads.reduce((acc, ad) => acc + Number(ad?.calls || 0), 0);
        const totalWhatsapp = ads.reduce((acc, ad) => acc + Number(ad?.whatsapp || 0), 0);
        const totalInquiries = ads.reduce((acc, ad) => acc + Number(ad?.inquiries || 0), 0);

        const responseScore = totalCalls + totalWhatsapp + totalInquiries;
        const responseLabel = formatResponseSpeed(responseScore);

        return {
            joinedAt: seller?.createdAt || null,
            totalAds,
            totalViews,
            totalCalls,
            totalWhatsapp,
            totalInquiries,
            responseLabel,
        };
    } catch (error) {
        handleError(error);
        return {
            joinedAt: seller?.createdAt || null,
            totalAds: ads.length,
            totalViews: 0,
            totalCalls: 0,
            totalWhatsapp: 0,
            totalInquiries: 0,
            responseLabel: "Standard",
        };
    }
}