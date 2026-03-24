"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IoStar, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useAuth } from "@/app/hooks/useAuth";
import { upsertSellerRating } from "@/lib/actions/sellerRating.actions";

type Props = {
    sellerId: string;
    sellerName: string;
    adId?: string;
    existingReview?: {
        rating?: number;
        review?: string;
    } | null;
};

function safeStr(v: any) {
    return String(v ?? "").trim();
}

export default function LeaveSellerReview({
    sellerId,
    sellerName,
    adId,
    existingReview,
}: Props) {
    const router = useRouter();
    const { user: currentUser, appUserId, authUser, loading } = useAuth();

    const [rating, setRating] = useState<number>(Number(existingReview?.rating || 0));
    const [review, setReview] = useState<string>(safeStr(existingReview?.review));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    const isOwnProfile = useMemo(() => {
        return String(appUserId || "") === String(sellerId);
    }, [appUserId, sellerId]);

    const canReview = !!authUser && !!appUserId && !isOwnProfile;

    const onSubmit = () => {
        setError("");
        setSuccess("");

        if (!canReview) {
            setError("You must be signed in with a buyer account to leave a review.");
            return;
        }

        if (rating < 1 || rating > 5) {
            setError("Please select a rating.");
            return;
        }

        if (review.trim().length > 500) {
            setError("Review must be 500 characters or less.");
            return;
        }

        startTransition(async () => {
            try {
                await upsertSellerRating({
                    sellerId,
                    reviewerId: String(appUserId),
                    adId,
                    rating,
                    review,
                    path: `/seller/${sellerId}`,
                });

                setSuccess(existingReview ? "Your review was updated." : "Review submitted successfully.");
                router.refresh();
            } catch (e) {
                console.error(e);
                setError("Failed to submit review. Please try again.");
            }
        });
    };

    if (loading) {
        return (
            <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-slate-500">Loading review form...</div>
            </div>
        );
    }

    if (isOwnProfile) {
        return null;
    }

    if (!authUser || !appUserId) {
        return (
            <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-black text-slate-900">Leave a review</h3>
                <p className="mt-1 text-xs text-slate-500">
                    Sign in to rate {sellerName}.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="rounded-xl bg-amber-50 p-2 text-amber-500">
                    <IoChatbubbleEllipsesOutline className="text-lg" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-900">
                        {existingReview ? "Update your review" : "Leave a review"}
                    </h3>
                    <p className="text-xs text-slate-500">
                        Share your experience with {sellerName}.
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Rating
                </div>

                <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => {
                        const active = value <= rating;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className="rounded-lg p-1 transition hover:scale-105"
                                aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                            >
                                <IoStar
                                    className={`text-2xl ${active ? "text-amber-400" : "text-slate-300"
                                        }`}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Review
                </label>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Describe your experience with this seller..."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-300"
                />
                <div className="mt-1 text-right text-[11px] text-slate-400">
                    {review.length}/500
                </div>
            </div>

            {error ? (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    {error}
                </div>
            ) : null}

            {success ? (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                    {success}
                </div>
            ) : null}

            <button
                type="button"
                onClick={onSubmit}
                disabled={isPending}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-orange-500 px-4 text-xs font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isPending
                    ? "Submitting..."
                    : existingReview
                        ? "Update Review"
                        : "Submit Review"}
            </button>
        </div>
    );
}