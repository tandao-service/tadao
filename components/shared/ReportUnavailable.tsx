"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { updateabused } from "@/lib/actions/dynamicAd.actions";
import { useMediaQuery } from "react-responsive";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import { formatKsh } from "@/lib/help";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminId } from "@/constants";

interface ReportUnavailableProps {
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportUnavailable: React.FC<ReportUnavailableProps> = ({
  ad,
  isOpen,
  userId,
  userImage,
  userName,
  onClose,
}) => {
  const { toast } = useToast();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isSending, setIsSending] = useState(false);

  const adTitle = ad?.data?.title || "This listing";
  const adPrice = Number(ad?.data?.price || 0);
  const imageUrl =
    ad?.data?.imageUrls?.[0] ||
    ad?.data?.coverThumbUrl ||
    "/placeholder.svg";

  const cleanDescription = useMemo(() => {
    const txt = sanitizeHtml(ad?.data?.description || "", {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    return txt.length > 110 ? `${txt.slice(0, 110)}...` : txt;
  }, [ad?.data?.description]);

  const handleSubmit = async () => {
    try {
      setIsSending(true);

      const read = "1";
      const image = "";

      const messageText = `Listing reported unavailable. AD_ID:${ad._id}`;

      const q = query(
        collection(db, "messages"),
        where("text", "==", messageText),
        where("uid", "==", userId),
        where("recipientUid", "==", AdminId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "messages"), {
          text: messageText,
          name: userName,
          avatar: userImage,
          createdAt: serverTimestamp(),
          uid: userId,
          recipientUid: AdminId,
          imageUrl: image,
          read,
        });

        const abused = (Number(ad.abused ?? "0") + 1).toString();

        await updateabused({
          _id: ad._id,
          abused,
          path: `/ads/${ad._id}`,
        });

        toast({
          title: "Report submitted",
          description: "The listing has been reported as unavailable.",
          duration: 4000,
          className: "bg-orange-500 text-white border-0",
        });

        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Already reported",
          description: "You already submitted this unavailable report.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Unavailable report error:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not submit your report. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const content = (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white shadow-sm dark:border-slate-700 dark:from-[#1B2327] dark:via-[#131B1E] dark:to-[#131B1E]">
        <div className="flex gap-4 p-4">
          <div className="relative h-[92px] w-[120px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={imageUrl}
              alt={adTitle}
              fill
              className="object-cover"
              sizes="120px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
              <Inventory2OutlinedIcon sx={{ fontSize: 14 }} />
              Availability Update
            </div>

            <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-900 dark:text-white">
              {adTitle}
            </h3>

            {cleanDescription ? (
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                {cleanDescription}
              </p>
            ) : null}

            {adPrice > 0 ? (
              <div className="mt-3 text-lg font-extrabold text-orange-600 dark:text-orange-400">
                {formatKsh(adPrice)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm text-slate-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-slate-200">
        <div className="flex items-start gap-3">
          <WarningAmberRoundedIcon className="mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Confirm listing unavailable
            </p>
            <p className="mt-1">
              Use this when the item is no longer available, sold, rented out, or no longer valid.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSending}
        className="h-12 w-full rounded-2xl bg-orange-500 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-70"
      >
        {isSending ? (
          <div className="flex items-center justify-center gap-2">
            <CircularProgress size={18} color="inherit" />
            Submitting...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <RemoveShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
            Confirm Unavailable
          </div>
        )}
      </Button>
    </div>
  );

  if (isMobile && isOpen) {
    return (
      <div className="fixed inset-0 z-[220] flex flex-col bg-white dark:bg-[#0F1417]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-[#0F1417]">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowBackOutlinedIcon />
            </button>

            <div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                Report Unavailable
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help keep listings accurate
              </p>
            </div>
          </div>

          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
            <Inventory2OutlinedIcon />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {content}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="z-[220] h-[90vh] max-h-[90vh] w-[95vw] max-w-2xl overflow-hidden rounded-[28px] border border-orange-100 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-[#11181C] dark:text-slate-100">
        <DialogHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-6 py-5 dark:border-slate-700 dark:from-[#1B2327] dark:to-[#11181C]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                <Inventory2OutlinedIcon sx={{ fontSize: 14 }} />
                Listing Status
              </div>

              <DialogTitle className="mt-3 text-left text-2xl font-extrabold text-slate-900 dark:text-white">
                Report Unavailable
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Let us know if this listing is no longer available.
              </p>
            </div>


          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};