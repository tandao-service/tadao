import { getActiveAuctionAds } from "@/lib/actions/auction.actions";

type Props = {
    searchParams?: {
        subcategory?: string;
    };
};

export default async function AuctionPage({ searchParams }: Props) {
    const subcategoryId = searchParams?.subcategory || "";
    const ads = await getActiveAuctionAds(subcategoryId);

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Auction Items</h1>
                <p className="text-sm text-gray-500">
                    Browse active items with bidding enabled.
                </p>
            </div>

            {ads.length === 0 ? (
                <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
                    No active auction items found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ads.map((ad: any) => {
                        const highestBid =
                            ad.bids?.length > 0
                                ? Math.max(...ad.bids.map((b: any) => Number(b.amount || 0)))
                                : 0;

                        return (
                            <div key={ad._id} className="rounded-2xl border bg-white p-4 shadow-sm">
                                <h2 className="font-semibold">
                                    {ad.data?.title || ad.data?.name || "Auction Item"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {ad.subcategory?.name || "Auction"}
                                </p>

                                <p className="mt-3 text-sm">
                                    Current highest bid:{" "}
                                    <span className="font-bold">
                                        KSh {highestBid.toLocaleString()}
                                    </span>
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Ends: {ad.biddingEndsAt ? new Date(ad.biddingEndsAt).toLocaleString() : "-"}
                                </p>

                                <a
                                    href={`/ads/${ad._id}`}
                                    className="mt-4 inline-flex rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
                                >
                                    View Item
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}