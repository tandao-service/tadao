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
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import { createLoan } from "@/lib/actions/loan.actions";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { formatKsh } from "@/lib/help";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import CircularProgress from "@mui/material/CircularProgress";

interface LoanProps {
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestFinancing: React.FC<LoanProps> = ({
  ad,
  isOpen,
  userId,
  onClose,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [loanAmount] = useState(Number(ad?.data?.price || 0));
  const [loanterm, setLoanterm] = useState("");
  const [loanType] = useState("Property Financing");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [messageComments, setMessageComments] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { toast } = useToast();
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const imageUrl =
    ad?.data?.imageUrls?.[0] ||
    ad?.data?.coverThumbUrl ||
    "/placeholder.svg";

  const adTitle = ad?.data?.title || "Property Listing";
  const adPrice = Number(ad?.data?.price || 0);
  const safeDescription = useMemo(() => {
    const clean = sanitizeHtml(ad?.data?.description || "", {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    return clean.length > 120 ? `${clean.slice(0, 120)}...` : clean;
  }, [ad?.data?.description]);

  const formatToCurrency = (value: string | number) => {
    if (!value) return "";
    const numberValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

    if (!Number.isFinite(numberValue)) return "";

    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  const parseCurrencyToNumber = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : 0;
  };

  const resetForm = () => {
    setDeposit(0);
    setMonthlyIncome(0);
    setEmploymentStatus("");
    setMessageComments("");
    setLoanterm("");
  };

  const handleSubmit = async () => {
    if (!monthlyIncome || !deposit || !loanterm || !employmentStatus) {
      toast({
        variant: "destructive",
        title: "Please complete the form",
        description:
          !monthlyIncome
            ? "Enter your monthly income."
            : !deposit
              ? "Enter your deposit amount."
              : !loanterm
                ? "Select your preferred loan term."
                : "Select your employment status.",
        duration: 4000,
      });
      return;
    }

    try {
      setIsSending(true);

      const response = await createLoan({
        loan: {
          userId,
          adId: ad?._id,
          loanType,
          LoanAmount: loanAmount,
          monthlyIncome,
          deposit,
          loanterm,
          employmentStatus,
          messageComments,
          status: "Pending",
        },
        path: pathname,
      });

      if (response === "Property Financing Requested submitted") {
        toast({
          title: "Request submitted",
          description: "Your financing request has been sent successfully.",
          duration: 4000,
          className: "bg-orange-500 text-white border-0",
        });
        resetForm();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: String(response || "Something went wrong."),
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error submitting loan:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not submit your financing request.",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200";
  const inputClass =
    "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-[#131B1E] dark:text-slate-100 dark:placeholder:text-slate-500";
  const selectClass =
    "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-[#131B1E] dark:text-slate-100";

  const FormContent = (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white shadow-sm dark:border-slate-700 dark:from-[#1B2327] dark:via-[#131B1E] dark:to-[#131B1E]">
        <div className="flex gap-4 p-4">
          <div className="relative h-[96px] w-[126px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={imageUrl}
              alt={adTitle}
              fill
              className="object-cover"
              sizes="126px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
              <HomeWorkOutlinedIcon sx={{ fontSize: 14 }} />
              Financing Request
            </div>

            <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-900 dark:text-white">
              {adTitle}
            </h3>

            {safeDescription ? (
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                {safeDescription}
              </p>
            ) : null}

            <div className="mt-3 text-lg font-extrabold text-orange-600 dark:text-orange-400">
              {formatKsh(adPrice)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            <PaymentsOutlinedIcon sx={{ fontSize: 18 }} />
            Monthly Income (KES)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatToCurrency(monthlyIncome)}
            onChange={(e) => setMonthlyIncome(parseCurrencyToNumber(e.target.value))}
            placeholder="e.g. 80,000"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            <AccountBalanceOutlinedIcon sx={{ fontSize: 18 }} />
            Deposit Amount (KES)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatToCurrency(deposit)}
            onChange={(e) => setDeposit(parseCurrencyToNumber(e.target.value))}
            placeholder="e.g. 500,000"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            <WorkOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            Employment Status
          </label>
          <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-[#131B1E]">
              <SelectItem value="Employed">Employed</SelectItem>
              <SelectItem value="Self-employed">Self-employed</SelectItem>
              <SelectItem value="Business Owner">Business Owner</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className={labelClass}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />
            Preferred Loan Term
          </label>
          <Select value={loanterm} onValueChange={setLoanterm}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select loan term" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-[#131B1E]">
              {["6", "12", "24", "36", "48", "60", "72", "84", "96", "108", "120", "+120"].map(
                (m) => (
                  <SelectItem key={m} value={`${m} months`}>
                    {m} months
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          <NotesOutlinedIcon sx={{ fontSize: 18 }} />
          Additional Comments
        </label>
        <Textarea
          value={messageComments}
          onChange={(e) => setMessageComments(e.target.value)}
          placeholder="Add any useful details for your financing request..."
          maxLength={300}
          className="min-h-[120px] rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-[#131B1E] dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <div className="mt-2 text-right text-xs text-slate-400">
          {messageComments.length}/300
        </div>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-slate-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-slate-200">
        <span className="font-semibold text-orange-700 dark:text-orange-300">
          Loan Amount:
        </span>{" "}
        {formatKsh(loanAmount)}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSending}
        className="h-12 w-full rounded-2xl bg-orange-500 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-70"
      >
        {isSending ? (
          <div className="flex items-center justify-center gap-2">
            <CircularProgress size={18} color="inherit" />
            Submitting Request...
          </div>
        ) : (
          "Submit Financing Request"
        )}
      </Button>
    </div>
  );

  if (isMobile && isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0F1417]">
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
                Financing Request
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete the form below
              </p>
            </div>
          </div>

          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
            <AccountBalanceOutlinedIcon />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {FormContent}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="z-[200] h-[90vh] max-h-[90vh] w-[95vw] max-w-2xl overflow-hidden rounded-[28px] border border-orange-100 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-[#11181C] dark:text-slate-100">
        <DialogHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-6 py-5 dark:border-slate-700 dark:from-[#1B2327] dark:to-[#11181C]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                <AccountBalanceOutlinedIcon sx={{ fontSize: 14 }} />
                Theme Financing
              </div>

              <DialogTitle className="mt-3 text-left text-2xl font-extrabold text-slate-900 dark:text-white">
                Request Financing
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Submit your request and our team will review your financing details.
              </p>
            </div>


          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {FormContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};