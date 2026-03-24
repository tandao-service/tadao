"use client";

import Image from "next/image";
import { IoStar } from "react-icons/io5";

type Props = {
    reviews: any[];
};

function safeStr(v: any) {
    return String(v ?? "").trim();
}

function reviewerName(reviewer: any) {
    return (
        safeStr(reviewer?.businessname) ||
        `${safeStr(reviewer?.firstName)} ${safeStr(reviewer?.lastName)}`.trim() ||
        "Buyer"
    );
}

function formatDate(input: any) {
    if (!input) return "—";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
}

export default function SellerReviewsList({ reviews }: Props) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-900">Recent reviews</h3>

            {reviews.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">No reviews yet.</p>
            ) : (
                <div className="mt-4 space-y-3">
                    {reviews.map((item: any) => {
                        const photo =
                            safeStr(item?.reviewer?.photo) || safeStr(item?.reviewer?.imageUrl);

                        return (
                            <div
                                key={item._id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
                                        {photo ? (
                                            <Image
                                                src={photo}
                                                alt={reviewerName(item?.reviewer)}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs font-black text-slate-600">
                                                {reviewerName(item?.reviewer).slice(0, 1).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="text-xs font-black text-slate-900">
                                                {reviewerName(item?.reviewer)}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {formatDate(item?.createdAt)}
                                            </div>
                                        </div>

                                        <div className="mt-1 flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, idx) => {
                                                const value = idx + 1;
                                                return (
                                                    <IoStar
                                                        key={value}
                                                        className={`text-sm ${value <= Number(item?.rating || 0)
                                                            ? "text-amber-400"
                                                            : "text-slate-300"
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </div>

                                        {safeStr(item?.review) ? (
                                            <p className="mt-2 text-xs leading-relaxed text-slate-700">
                                                {safeStr(item?.review)}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}