"use client";

import { useEffect, useState } from "react";
import "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Footersub from "@/components/shared/Footersub";
import { mode } from "@/constants";
import SidebarmainReviews from "./SidebarmainReviews";
import StarIcon from "@mui/icons-material/Star";
import { Send, X, MessageSquareText, Star } from "lucide-react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Ratingsmobile from "./ratingsmobile";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import SellerProfileSidebar from "./SellerProfileSidebar";
import TopBar from "../home/TopBar.client";
import SellerProfileReviews from "./SellerProfileReviews";

interface AdsProps {
  displayName: string;
  uid: string;
  photoURL: string;
  user: any;
  recipient: any;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenSettings: () => void;
  handleOpenChatId: (value: string) => void;
  handleOpenReview: (value: string) => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id: string) => void;
}

const ReviewsComponent = ({
  displayName,
  uid,
  photoURL,
  user,
  recipient,
  handlePay,
  handleOpenSettings,
  handleOpenReview,
  handleOpenChatId,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
}: AdsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 0,
  });

  const [starClicked, setStarClicked] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleStarClick = (index: number) => {
    const updatedStarClicked = [0, 1, 2, 3, 4].map((i) => i <= index);
    setStarClicked(updatedStarClicked);
    setNewReview((prev) => ({
      ...prev,
      rating: index + 1,
    }));
  };

  const handleReviewSubmit = async () => {
    if (!newReview.comment || !newReview.rating) {
      return;
    }

    try {
      setIsSending(true);

      const reviewQuery = query(
        collection(db, "reviews"),
        where("uid", "==", uid),
        where("recipientUid", "==", recipient._id)
      );

      const reviewSnapshot = await getDocs(reviewQuery);

      await addDoc(collection(db, "reviews"), {
        text: newReview.comment,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid: uid,
        recipientUid: recipient._id,
        starClicked,
        rating: newReview.rating,
      });

      if (reviewSnapshot.empty) {
        console.log("Review submitted successfully.");
      }
    } catch (error) {
      console.error("Error sending review: ", error);
    } finally {
      setIsSending(false);
    }

    setNewReview({ comment: "", rating: 0 });
    setShowForm(false);
    setStarClicked([false, false, false, false, false]);
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode;
    const isDark = savedTheme === mode;

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;

    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-black dark:bg-[#131B1E] dark:text-[#F1F3F3]">
      <TopBar />

      <div className="mx-auto flex w-full max-w-6xl gap-4 px-2 pb-8 pt-[calc(var(--topbar-h,64px)+12px)] md:px-4">
        <div className="hidden lg:block lg:w-[350px]">
          <SellerProfileReviews
            user={recipient}
            loggedId={uid}
            userId={recipient._id}
            handleOpenReview={handleOpenReview}
            handleOpenChatId={handleOpenChatId}
            handleOpenSettings={handleOpenSettings}
            handlePay={handlePay}
          //daysRemaining={0}
          //pack={""}
          //color={""}
          //handleOpenPlan={function (): void { }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
            <div className="border-b border-slate-100 bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-5 text-white dark:border-slate-700 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
                    <MessageSquareText className="h-4 w-4" />
                    Seller Reviews
                  </div>

                  <div className="mt-3 text-sm md:text-base">
                    <Ratingsmobile
                      recipientUid={recipient._id}
                      user={recipient}
                      handleOpenReview={handleOpenReview}
                    />
                  </div>
                </div>

                {currentUser ? (
                  <button
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
                    onClick={() => setShowForm(true)}
                  >
                    Leave a Review
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
                    onClick={() => {
                      router.push("/sign-in");
                    }}
                  >
                    Leave a Review
                  </button>
                )}
              </div>
            </div>

            {showForm && (
              <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/50 px-4">
                <div className="w-full max-w-lg rounded-[28px] border border-orange-100 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#1B2225] dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Leave a Review
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Share your experience with this seller.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowForm(false)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-[#2D3236] dark:text-slate-300"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Your review
                    </label>

                    <textarea
                      placeholder="Write a review..."
                      className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white dark:border-slate-600 dark:bg-[#2D3236] dark:text-gray-100"
                      value={newReview.comment}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReviewSubmit();
                        }
                      }}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                    />
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Rating
                    </div>

                    <div className="flex items-center gap-1">
                      {starClicked.map((clicked, index) => (
                        <StarIcon
                          key={index}
                          sx={{
                            fontSize: 34,
                            color: clicked ? "#f59e0b" : "#cbd5e1",
                          }}
                          onClick={() => handleStarClick(index)}
                          className="cursor-pointer transition hover:scale-105"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={isSending}
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-70"
                    onClick={() => handleReviewSubmit()}
                  >
                    {isSending && (
                      <CircularProgress sx={{ color: "white" }} size={24} />
                    )}
                    {isSending ? "Submitting..." : "Submit Review"}
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            <ScrollArea className="h-[72vh] bg-white dark:bg-[#2D3236]">
              <div className="p-3 md:p-4">
                <SidebarmainReviews recipientUid={recipient._id} uid={uid} />
              </div>
            </ScrollArea>
          </div>

          <div className="mt-6 lg:hidden">
            <SellerProfileReviews
              user={recipient}
              loggedId={uid}
              userId={recipient._id}
              handleOpenReview={handleOpenReview}
              handleOpenChatId={handleOpenChatId}
              handleOpenSettings={handleOpenSettings}
              handlePay={handlePay}
            // daysRemaining={0}
            // pack={""}
            // color={""}
            // handleOpenPlan={function (): void { }}
            />
          </div>
        </div>
      </div>

      <footer className="hidden lg:block">
        <Footersub
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
        />
      </footer>

      <Toaster />
    </div>
  );
};

export default ReviewsComponent;