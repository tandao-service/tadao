"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";
import { updateabused } from "@/lib/actions/dynamicAd.actions";
import { createReport } from "@/lib/actions/report.actions";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import { formatKsh } from "@/lib/help";

interface ReportAbuseProps {
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportAbuse: React.FC<ReportAbuseProps> = ({
  ad,
  isOpen,
  userId,
  onClose,
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { toast } = useToast();
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 768 });

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

  const resetForm = () => {
    setReason("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason required",
        description: "Please select a reason for reporting this listing.",
        duration: 4000,
      });
      return;
    }

    if (description.length > 200) {
      toast({
        variant: "destructive",
        title: "Description too long",
        description: "Description cannot exceed 200 characters.",
        duration: 4000,
      });
      return;
    }

    try {
      setIsSending(true);

      const newResponse = await createReport({
        report: {
          userId,
          adId: ad._id,
          reason,
          description,
        },
        path: pathname,
      });

      if (newResponse === "Ad Reported") {
        const abused = (Number(ad.abused ?? "0") + 1).toString();
        const _id = ad._id;

        await updateabused({
          _id,
          abused,
          path: `/ads/${ad._id}`,
        });

        toast({
          title: "Report sent",
          description: "Thank you. Your report has been submitted.",
          duration: 4000,
          className: "bg-orange-500 text-white border-0",
        });

        resetForm();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: String(newResponse || "Could not send report."),
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Report submit error:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not send your report. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200";

  const selectClass =
    "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-[#131B1E] dark:text-slate-100";

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
              <FlagOutlinedIcon sx={{ fontSize: 14 }} />
              Listing Report
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

      <div>
        <label className={labelClass}>
          <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
          Report Reason
        </label>

        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger className={selectClass}>
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-[#131B1E]">
            <SelectItem value="spam">Spam or misleading</SelectItem>
            <SelectItem value="fraud">Fraud or scam</SelectItem>
            <SelectItem value="wrong_category">Wrong category</SelectItem>
            <SelectItem value="it_is_sold">It is sold</SelectItem>
            <SelectItem value="wrong_price">The price is wrong</SelectItem>
            <SelectItem value="seller_asked_for_prepayment">
              Seller asked for prepayment
            </SelectItem>
            <SelectItem value="user_is_unreachable">
              User is unreachable
            </SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className={labelClass}>
          <NotesOutlinedIcon sx={{ fontSize: 18 }} />
          Additional Details
        </label>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe the issue briefly..."
          maxLength={200}
          className="min-h-[120px] rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-[#131B1E] dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <div className="mt-2 text-right text-xs text-slate-400">
          {description.length}/200
        </div>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-slate-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-slate-200">
        Reports help us review suspicious, misleading, or unsafe listings faster.
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSending}
        className="h-12 w-full rounded-2xl bg-red-600 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-70"
      >
        {isSending ? (
          <div className="flex items-center justify-center gap-2">
            <CircularProgress size={18} color="inherit" />
            Sending Report...
          </div>
        ) : (
          "Send Report"
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
                Report Listing
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help us review this listing
              </p>
            </div>
          </div>

          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
            <ReportGmailerrorredOutlinedIcon />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">{content}</div>
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
                <ReportGmailerrorredOutlinedIcon sx={{ fontSize: 14 }} />
                Safety Review
              </div>

              <DialogTitle className="mt-3 text-left text-2xl font-extrabold text-slate-900 dark:text-white">
                Report Listing
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Report suspicious, misleading, or inappropriate listing activity.
              </p>
            </div>


          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">{content}</div>
      </DialogContent>
    </Dialog>
  );
};