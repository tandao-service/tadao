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
import { usePathname, useRouter } from "next/navigation";

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

const RatingsCard = ({ recipientUid, user, handleOpenReview }: Ratingsprop) => {
  const [clickedStarsCount, setClickedStarsCount] = useState<number>(0);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [averageStar, setAverageStar] = useState<number>(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
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
        totalClickedStars += reviewData.starClicked
          ? reviewData.starClicked.filter((clicked: boolean) => clicked).length
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

    return {
      full,
      hasHalf,
      empty,
    };
  }, [averageStar]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            handleOpenReview(user);
          }}
          className="group rounded-2xl border border-orange-100 bg-gradient-to-br from-white via-orange-50/70 to-orange-100/60 p-4 text-left shadow-[0_10px_30px_rgba(249,115,22,0.08)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_16px_38px_rgba(249,115,22,0.14)] dark:border-white/10 dark:from-[#1a2327] dark:via-[#233338] dark:to-[#1c2a2f]"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <GradeOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 shadow-sm dark:bg-white/5 dark:text-gray-300">
              Rating
            </span>
          </div>

          <div className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {averageStar.toFixed(1)}
          </div>

          <div className="mt-2 flex items-center gap-[2px]">
            {Array.from({ length: stars.full }).map((_, i) => (
              <StarIcon key={`full-${i}`} sx={{ fontSize: 16 }} className="text-amber-200" />
            ))}

            {stars.hasHalf ? (
              <StarHalfIcon sx={{ fontSize: 16 }} className="text-amber-200" />
            ) : null}

            {Array.from({ length: stars.empty }).map((_, i) => (
              <StarIcon key={`empty-${i}`} sx={{ fontSize: 16 }} className="text-gray-300 dark:text-gray-600" />
            ))}
          </div>

          <p className="mt-2 text-xs font-medium text-slate-500 transition group-hover:text-slate-700 dark:text-gray-300 dark:group-hover:text-white">
            Tap to view seller ratings
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            router.push(`/profile/${user._id}?tab=reviews`);
          }}
          className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_38px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-[#1a2327]"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-gray-200">
              <ReviewsOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-white/5 dark:text-gray-300">
              Reviews
            </span>
          </div>

          <div className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {messagesCount}
          </div>

          <p className="mt-2 text-xs font-medium text-slate-500 transition group-hover:text-slate-700 dark:text-gray-300 dark:group-hover:text-white">
            Open all seller reviews
          </p>
        </button>
      </div>
    </div>
  );
};

export default RatingsCard;