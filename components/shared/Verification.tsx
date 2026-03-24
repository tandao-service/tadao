"use client";

import React from "react";
import ShowPopup from "./ShowPopup";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { format, isToday, isYesterday } from "date-fns";
import { useRouter } from "next/navigation";

interface SettingsProp {
  user: any;
  userId: string;
  fee?: string;
  isAdCreator: boolean;
  handlePayNow: (id: string) => void;
}

const Verification: React.FC<SettingsProp> = ({
  user,
  userId,
  fee,
  isAdCreator,
  handlePayNow,
}: SettingsProp) => {
  const router = useRouter();

  let formattedCreatedAt = "";
  try {
    const createdAtDate = new Date(user?.verified?.[0]?.verifieddate);
    if (isToday(createdAtDate)) {
      formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm");
    } else if (isYesterday(createdAtDate)) {
      formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm");
    } else {
      formattedCreatedAt =
        format(createdAtDate, "dd-MM-yyyy") + " " + format(createdAtDate, "HH:mm");
    }
  } catch {
    formattedCreatedAt = "";
  }

  const goToVerify = () => {
    router.replace(`/verify?redirect_url=/profile&reason=verification-required`);
  };

  const verifiedContent = (
    <div className="w-full max-w-sm rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 p-4 shadow-[0_14px_40px_rgba(16,185,129,0.12)] dark:border-emerald-900/40 dark:from-[#1b2d2a] dark:via-[#233338] dark:to-[#1b2d2a] dark:text-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <VerifiedUserOutlinedIcon sx={{ fontSize: 24 }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
              Verified Seller
            </h4>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Trusted
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-gray-300">
            This seller account has been verified and marked as genuine on Tadao
            Market.
          </p>

          {formattedCreatedAt ? (
            <div className="mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-white/5 dark:text-emerald-300">
              Verified since {formattedCreatedAt}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  const unverifiedContentAdCreator = (
    <div className="w-full max-w-xl rounded-2xl border border-orange-200 bg-gradient-to-br from-white via-orange-50 to-orange-100/60 p-4 shadow-[0_14px_40px_rgba(249,115,22,0.12)] dark:border-orange-900/30 dark:from-[#1a1d20] dark:via-[#233338] dark:to-[#1e2a2f] dark:text-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <ShieldOutlinedIcon sx={{ fontSize: 24 }} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold tracking-tight text-orange-700 dark:text-orange-400">
              Unverified Seller
            </h4>

          </div>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-gray-300">
            This seller account is currently unverified. Get verified to boost buyer
            confidence and improve trust on your profile.
          </p>

          <button
            onClick={goToVerify}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#30AF5B] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(48,175,91,0.28)] transition hover:-translate-y-0.5 hover:bg-[#27924b]"
          >
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );

  const unverifiedContent = (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#233338] dark:text-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-gray-300">
          <ShieldOutlinedIcon sx={{ fontSize: 24 }} />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
            Unverified Seller
          </h4>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-gray-300">
            This seller account has not been verified yet.
          </p>
        </div>
      </div>
    </div>
  );

  const verifiedTrigger = (
    <button
      type="button"
      className="group inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-500/10 dark:text-emerald-400"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
        <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
      </span>
      Verified Seller
    </button>
  );

  const unverifiedTrigger = (
    <button
      type="button"
      className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#131B1E] dark:text-gray-300"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
        <ShieldOutlinedIcon sx={{ fontSize: 16 }} />
      </span>
      Unverified Seller
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {user?.verified?.[0]?.accountverified === true ? (
        <ShowPopup trigger={verifiedTrigger} content={verifiedContent} />
      ) : isAdCreator ? (
        <>
          <ShowPopup trigger={unverifiedTrigger} content={unverifiedContentAdCreator} />

          <button
            onClick={goToVerify}
            className="inline-flex items-center gap-2 rounded-full bg-[#30AF5B] px-4 py-2 text-sm font-bold text-white shadow-[0_12px_30px_rgba(48,175,91,0.28)] transition hover:-translate-y-0.5 hover:bg-[#27924b]"
          >
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            Verify Now
          </button>
        </>
      ) : (
        <ShowPopup trigger={unverifiedTrigger} content={unverifiedContent} />
      )}
    </div>
  );
};

export default Verification;