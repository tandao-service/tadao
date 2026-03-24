"use client";

import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  where,
  limit,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import { useRouter } from "next/navigation";

type Ratingsprop = {
  recipientUid: string;
  user: any;
  handleOpenReview: (value: any) => void;
};

interface Review {
  id: string;
  text: string;
  name: string;
  avatar: string;
  createdAt: Timestamp;
  uid: string;
  recipientUid: string;
  starClicked: boolean[];
}

const Ratingsmobile = ({
  recipientUid,
  user,
  handleOpenReview,
}: Ratingsprop) => {
  const [clickedStarsCount, setClickedStarsCount] = useState<number>(0);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [averageStar, setAverageStar] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (!recipientUid) return;

    const messagesQuery = query(
      collection(db, "reviews"),
      where("recipientUid", "==", recipientUid),
      limit(100)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      let totalClickedStars = 0;
      const totalMessages = snapshot.size;

      snapshot.forEach((doc) => {
        const reviewData = doc.data() as Review;
        totalClickedStars += Array.isArray(reviewData.starClicked)
          ? reviewData.starClicked.filter(Boolean).length
          : 0;
      });

      setClickedStarsCount(totalClickedStars);
      setMessagesCount(totalMessages);
      setAverageStar(totalMessages === 0 ? 0 : totalClickedStars / totalMessages);
    });

    return () => unsubscribe();
  }, [recipientUid]);

  const stars = useMemo(() => {
    const full = Math.floor(averageStar);
    const hasHalf = averageStar - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    return { full, hasHalf, empty };
  }, [averageStar]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#131B1E]/95">
        <button
          type="button"
          onClick={() => handleOpenReview(user)}
          className="group flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <GradeOutlinedIcon sx={{ fontSize: 20 }} />
          </div>

          <div className="min-w-0">
            <div className="flex items-end gap-2">
              <span className="text-base font-black tracking-tight text-slate-950 dark:text-white">
                {averageStar.toFixed(1)}
              </span>
              <span className="pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-gray-500">
                Rating
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-[2px]">
              {Array.from({ length: stars.full }).map((_, i) => (
                <StarIcon
                  key={`full-${i}`}
                  sx={{ fontSize: 14 }}
                  className="text-amber-600"
                />
              ))}

              {stars.hasHalf ? (
                <StarHalfIcon sx={{ fontSize: 14 }} className="text-amber-600" />
              ) : null}

              {Array.from({ length: stars.empty }).map((_, i) => (
                <StarIcon
                  key={`empty-${i}`}
                  sx={{ fontSize: 14 }}
                  className="text-slate-300 dark:text-gray-600"
                />
              ))}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            router.push(`/profile/${user._id}?tab=reviews`);
          }}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
        >
          <ReviewsOutlinedIcon sx={{ fontSize: 16 }} />
          <span>{messagesCount} reviews</span>
        </button>
      </div>
    </div>
  );
};

export default Ratingsmobile;