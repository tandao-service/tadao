"use client";

import React, { useEffect, useMemo, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { usePathname } from "next/navigation";
import ProgressPopup from "./ProgressPopup";
import sanitizeHtml from "sanitize-html";
import {
  deleteAd,
  getAdByUser,
  updateBanAll,
  updateStatus,
} from "@/lib/actions/dynamicAd.actions";
import { updateUserStatus } from "@/lib/actions/user.actions";
import ContactSeller from "./ContactSeller";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  ad: any;
  handleOpenChatId: (value: string) => void;
}

const ReportActionWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  ad,
  onClose,
  handleOpenChatId,
}) => {
  const [status, setStatus] = useState(ad?.adstatus || "Inactive");
  const [userStatus, setUserStatus] = useState("User");
  const pathname = usePathname();
  const isAdCreator = true;
  const page = 1000;
  const sortby = "recommended";
  const [userId] = useState(ad?.organizer);
  const [organizerAds, setOrganizerAds] = useState<any[]>([]);
  const [selectAds, setSelectAds] = useState<any>([]);
  const [isOpenP, setIsOpenP] = useState(false);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingAd, setIsTogglingAd] = useState(false);
  const [isTogglingUser, setIsTogglingUser] = useState(false);
  const [isBanningAll, setIsBanningAll] = useState(false);

  const handleOpenContact = (value: any) => {
    setSelectAds(value);
    setIsOpenContact(true);
  };

  const handleCloseContact = () => setIsOpenContact(false);
  const handleCloseP = () => setIsOpenP(false);

  const adUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL}?Ad=${ad?._id}`;

  const imageUrls = Array.isArray(ad?.data?.imageUrls) ? ad.data.imageUrls : [];
  const coverImage = imageUrls[0] || "/placeholder.svg";
  const adTitle = ad?.data?.title || "Reported Ad";
  const price = Number(ad?.data?.price || 0);
  const condition = ad?.data?.condition || "—";
  const phone = ad?.data?.phone || "—";

  const safeDescription = useMemo(() => {
    const cleaned = sanitizeHtml(ad?.data?.description || "", {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    return cleaned.length > 180 ? `${cleaned.slice(0, 180)}...` : cleaned;
  }, [ad?.data?.description]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      setIsDeleting(true);
      await deleteAd({
        adId: ad._id,
        deleteImages: ad?.data?.imageUrls || [],
        path: pathname,
      });
      onClose();
    } catch (error) {
      console.error("Error deleting ad:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";
    try {
      setIsTogglingAd(true);
      await updateStatus({ _id: ad._id, adstatus: newStatus, path: pathname });
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsTogglingAd(false);
    }
  };

  const handleStatusChangeUser = async () => {
    const newStatus = userStatus === "User" ? "Banned" : "User";
    try {
      setIsTogglingUser(true);
      await updateUserStatus(userId, newStatus);
      setUserStatus(newStatus);
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsTogglingUser(false);
    }
  };

  const handleBanAll = async () => {
    if (!confirm("Are you sure you want to deactivate all creator ads?")) return;

    try {
      setIsBanningAll(true);
      const adPhone = ad?.data?.phone;
      await updateBanAll(adPhone, "Inactive");
    } catch (error) {
      console.error("Error banning all ads:", error);
    } finally {
      setIsBanningAll(false);
    }
  };

  const fetchAds = async () => {
    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby,
        myshop: isAdCreator,
      });
      setOrganizerAds(organizedAds || []);
    } catch (error) {
      console.error("Error fetching ads", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAds();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="flex h-[90vh] w-[95vw] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#11181C] dark:text-slate-100">
        <div className="flex items-start justify-between border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-5 py-4 dark:border-slate-700 dark:from-[#1B2327] dark:to-[#11181C]">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
              <WarningAmberRoundedIcon sx={{ fontSize: 14 }} />
              Admin Review
            </div>

            <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
              Reported Ad Actions
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review the listing, contact the seller, manage ad status, or take moderation action.
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <CloseOutlinedIcon />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-5 p-5">
            <div className="overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white shadow-sm dark:border-slate-700 dark:from-[#1B2327] dark:via-[#131B1E] dark:to-[#131B1E]">
              <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
                <div className="space-y-3">
                  <div className="relative h-[170px] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={coverImage}
                      alt={adTitle}
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                  </div>

                  {imageUrls.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {imageUrls.slice(0, 6).map((url: string, index: number) => (
                        <div
                          key={index}
                          className="relative h-[58px] w-[72px] flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
                        >
                          <Image
                            src={url}
                            alt={`${adTitle}-${index}`}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                      <Inventory2OutlinedIcon sx={{ fontSize: 14 }} />
                      Reported Listing
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                        }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-red-500"
                          }`}
                      />
                      {status}
                    </div>
                  </div>

                  <h2 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
                    {adTitle}
                  </h2>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#131B1E]">
                      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Price
                      </div>
                      <div className="mt-1 text-lg font-extrabold text-orange-600 dark:text-orange-400">
                        Ksh {price.toLocaleString()}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#131B1E]">
                      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Condition
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {condition}
                      </div>
                    </div>
                  </div>

                  {safeDescription ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#131B1E]">
                      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Description
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {safeDescription}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={adUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
                    >
                      <LinkOutlinedIcon sx={{ fontSize: 18 }} />
                      Open Ad
                    </a>

                    <button
                      onClick={() => handleOpenContact(ad)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                      <PhoneInTalkOutlinedIcon sx={{ fontSize: 18 }} />
                      Contact Seller
                    </button>

                    <button
                      onClick={handleStatusChange}
                      disabled={isTogglingAd}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-[#131B1E] dark:text-white dark:hover:bg-slate-800"
                    >
                      <ToggleOnOutlinedIcon sx={{ fontSize: 18 }} />
                      {isTogglingAd
                        ? "Updating..."
                        : status === "Active"
                          ? "Deactivate Ad"
                          : "Activate Ad"}
                    </button>

                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                      {isDeleting ? "Deleting..." : "Delete Ad"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {organizerAds.length > 0 && (
              <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#131B1E]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                      <PersonOffOutlinedIcon sx={{ fontSize: 14 }} />
                      Creator Review
                    </div>

                    <h3 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">
                      Ad Creator Information
                    </h3>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#11181C]">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Phone
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                          {phone}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#11181C]">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          Active Ads
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                          {organizerAds.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:min-w-[250px]">
                    <button
                      onClick={handleStatusChangeUser}
                      disabled={isTogglingUser}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-[#11181C] dark:text-white dark:hover:bg-slate-800"
                    >
                      <PersonOffOutlinedIcon sx={{ fontSize: 18 }} />
                      {isTogglingUser
                        ? "Updating..."
                        : userStatus === "User"
                          ? "Ban Creator"
                          : "Activate Creator"}
                    </button>

                    <button
                      onClick={handleBanAll}
                      disabled={isBanningAll}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
                      {isBanningAll ? "Deactivating..." : "Deactivate All Creator Ads"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      <ContactSeller
        isOpen={isOpenContact}
        ad={selectAds}
        handleOpenChatId={handleOpenChatId}
        onClose={handleCloseContact}
      />
    </div>
  );
};

export default ReportActionWindow;