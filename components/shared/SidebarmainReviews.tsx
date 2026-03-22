"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Star, MessageSquareText } from "lucide-react";
import { db } from "@/lib/firebase";

type Props = {
  recipientUid: string;
  uid?: string;
};

type ReviewItem = {
  id: string;
  text?: string;
  name?: string;
  avatar?: string;
  createdAt?: any;
  uid?: string;
  recipientUid?: string;
  rating?: number;
  starClicked?: boolean[];
};

function getInitials(name?: string) {
  const safe = String(name || "").trim();
  if (!safe) return "U";
  const parts = safe.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => {
    const active = i < rating;
    return (
      <Star
        key={i}
        className={`h-4 w-4 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }`}
      />
    );
  });
}

function formatReviewTime(value: any) {
  try {
    if (!value) return "";
    const date =
      value?.seconds != null
        ? new Date(value.seconds * 1000)
        : new Date(value);

    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

export default function SidebarmainReviews({ recipientUid }: Props) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipientUid) return;

    const q = query(
      collection(db, "reviews"),
      where("recipientUid", "==", recipientUid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ReviewItem[];

        setReviews(items);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load reviews:", error);
        setReviews([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [recipientUid]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );
    return total / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const rating = Math.max(1, Math.min(5, Number(r.rating || 0)));
      if (rating > 0) counts[rating - 1] += 1;
    });
    return counts.reverse();
  }, [reviews]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
          <div className="animate-pulse">
            <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]"
          >
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1">
                  <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="mt-2 h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
              <div className="mt-4 h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
        <div className="rounded-full bg-orange-50 p-4 dark:bg-orange-500/10">
          <MessageSquareText className="h-8 w-8 text-orange-500" />
        </div>

        <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">
          No reviews yet
        </h3>

        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          This seller has not received any public reviews yet. Be the first to
          share your experience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-500">
              Review Summary
            </p>

            <div className="mt-2 flex items-end gap-3">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
              <div className="pb-1">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:min-w-[260px]">
            {[5, 4, 3, 2, 1].map((star, index) => {
              const count = ratingCounts[index] || 0;
              const percent = reviews.length
                ? Math.round((count / reviews.length) * 100)
                : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex w-10 items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <span>{star}</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </div>

                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="w-10 text-right text-xs font-medium text-slate-500 dark:text-slate-400">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const rating = Number(review.rating || 0);
          const reviewerName = review.name || "Anonymous user";
          const avatar = review.avatar || "";
          const timeText = formatReviewTime(review.createdAt);

          return (
            <article
              key={review.id}
              className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-slate-700 dark:bg-[#2D3236]"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-orange-100 bg-orange-50">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={reviewerName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-extrabold text-orange-600">
                      {getInitials(reviewerName)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                        {reviewerName}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(rating)}
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {rating}/5
                        </span>
                      </div>
                    </div>

                    {timeText ? (
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        {timeText}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-[#1B2225]">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {review.text || "No written feedback."}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}