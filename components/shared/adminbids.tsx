import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
type Bid = {
    _id: string;
    username: string;
    amount: number;
    timestamp: string;
    isWinner?: boolean;
    isAbusive?: boolean;
};

type GroupedBids = {
    adId: string;
    title: string;
    thumbnail?: string;
    bids: Bid[];
};

export default function AdminBidsPage({
    bidsGrouped,
    loading,
    handleRemoveBid,
    handleMarkWinner,
}: {
    bidsGrouped: GroupedBids[];
    loading: boolean;
    handleRemoveBid: (bidId: string) => void;
    handleMarkWinner: (bidId: string) => void;
}) {
    const [expandedAdId, setExpandedAdId] = useState<string | null>(null);

    return (
        <>
            {loading ? (
                <div className="w-full mt-10 lg:min-h-[200px] flex flex-col items-center justify-center">
                    <Image src="/assets/icons/loading.gif" alt="loading" width={40} height={40} unoptimized />
                </div>
            ) : (
                <div className="p-3">
                    <h1 className="text-xl font-bold mb-6">Bids by Property</h1>

                    {bidsGrouped.length === 0 ? (
                        <p className="text-sm text-gray-500">No bids available.</p>
                    ) : (
                        bidsGrouped.map((group) => {
                            const hasWinner = group.bids.some((b) => b.isWinner);

                            return (
                                <div key={group.adId} className="border rounded-lg mb-4 shadow">
                                    {/* Header */}
                                    <div
                                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-t-lg"
                                        onClick={() => setExpandedAdId(expandedAdId === group.adId ? null : group.adId)}
                                    >
                                        <div className="flex flex-col">
                                            <h2 className="text-base font-semibold text-black">{group.title}</h2>
                                            <p className="text-xs text-gray-600">{group.bids.length} bidder{group.bids.length !== 1 ? "s" : ""}</p>
                                        </div>
                                        {group.thumbnail ? (
                                            <Image
                                                src={group.thumbnail}
                                                alt="Ad Thumbnail"
                                                width={60}
                                                height={40}
                                                className="rounded object-cover"
                                            />
                                        ) : (
                                            <div className="w-[60px] h-[40px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Bids List */}
                                    {expandedAdId === group.adId && (
                                        <div className="p-4 bg-white space-y-4">
                                            {group.bids
                                                .slice() // clone array
                                                .reverse() // newest first
                                                .map((bid: any) => (
                                                    <div
                                                        key={bid._id}
                                                        className="border border-gray-200 rounded-lg p-4 mb-3 shadow-sm bg-white hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex justify-between items-start flex-col md:flex-row md:items-center gap-3">
                                                            {/* Bidder Info */}
                                                            <div className="space-y-1 text-sm text-gray-700">
                                                                <div className="flex gap-1 items-center">
                                                                    <div className="relative">


                                                                        <img
                                                                            src={bid.userId.photo}
                                                                            alt="Organizer avatar"
                                                                            className="w-8 h-8 rounded-full object-cover"
                                                                        />

                                                                    </div> <span className="text-gray-900 font-semibold">{bid.username}</span>
                                                                </div>
                                                                <p className="flex items-center gap-2">
                                                                    <Mail className="w-4 h-4 text-gray-500" />
                                                                    <strong>Email:</strong> {bid.userId.email}
                                                                </p>
                                                                <p className="flex items-center gap-2">
                                                                    <Phone className="w-4 h-4 text-gray-500" />
                                                                    <strong>Phone:</strong> {bid.userId.phone}
                                                                </p>
                                                                <p>
                                                                    💰 <strong>Amount:</strong> Ksh {bid.amount.toLocaleString()}
                                                                </p>
                                                                <p>
                                                                    🕒 <strong>Date:</strong>{" "}
                                                                    {new Date(bid.timestamp).toLocaleString()}
                                                                </p>
                                                                {bid.isWinner && (
                                                                    <p className="text-green-600 font-semibold">🏆 Winner</p>
                                                                )}
                                                                {bid.isAbusive && (
                                                                    <p className="text-red-600 font-semibold">🚩 Marked Abusive</p>
                                                                )}
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex gap-2 mt-3 md:mt-0">
                                                                <Button
                                                                    variant="outline"
                                                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                                                    onClick={() => handleRemoveBid(bid._id)}
                                                                    size="sm"
                                                                >
                                                                    Remove
                                                                </Button>

                                                                {!bid.isWinner && (
                                                                    <Button
                                                                        size="sm"
                                                                        disabled={hasWinner}
                                                                        onClick={() => handleMarkWinner(bid._id)}
                                                                        className="bg-gradient-to-r from-orange-500 via-[#BD7A4F] to-orange-200 text-white hover:opacity-90"
                                                                    >
                                                                        Mark Winner
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </>
    );
}
