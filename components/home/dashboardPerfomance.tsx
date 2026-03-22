"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SplitscreenOutlinedIcon from "@mui/icons-material/SplitscreenOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AssistantDirectionOutlinedIcon from "@mui/icons-material/AssistantDirectionOutlined";
import LowPriorityOutlinedIcon from "@mui/icons-material/LowPriorityOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import { Toaster } from "../ui/toaster";
import { mode } from "@/constants";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import { Icon } from "@iconify/react";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1";
import TopBar from "./TopBar.client";
import { DeleteConfirmation } from "../shared/DeleteConfirmation";
import Footersub from "../shared/Footersub";
import { getAdByUser } from "@/lib/actions/dynamicAd.actions";
import SellerProfilePermonance from "../shared/SellerProfilePermonance";
import { BookmarkIcon, Crown, Eye, MessageCircle, Phone, Share2, TrendingUp, MapPin } from "lucide-react";

type CollectionProps = {
  userId: string;
  userName: string;
  userImage: string;
  loggedId: string;
  sortby: string;
  user: any;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  urlParamName?: string;
  isAdCreator: boolean;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdEdit: (ad: any) => void;
  handleAdView: (ad: any) => void;
  handleOpenReview: (value: any) => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
  handlePay: (id: string) => void;
};

const DashboardPerformance = ({
  userId,
  userName,
  userImage,
  sortby,
  emptyTitle,
  emptyStateSubtext,
  isAdCreator,
  user,
  handlePay,
  handleOpenSettings,
  handleOpenShop,
  handleOpenReview,
  handleAdEdit,
  handleAdView,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
  handleOpenPlan,
}: CollectionProps) => {
  const [isVertical, setisVertical] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [data, setAds] = useState<IdynamicAd[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [loadingSub, setLoadingSub] = useState<boolean>(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const sub = user?.subscription;

    let remaining = 0;
    let expiresAt: Date | null = null;

    if (sub && sub.planName && String(sub.planName).toLowerCase() !== "free") {
      remaining = sub.remainingAds ?? 0;
      expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;

      const expired =
        expiresAt instanceof Date && !isNaN(expiresAt.getTime())
          ? new Date() > expiresAt
          : false;

      if (expiresAt && !expired) {
        const diff =
          Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) || 0;
        setDaysRemaining(diff);
      } else {
        setDaysRemaining(0);
      }
    } else {
      remaining = Number(user?.subscription?.remainingAds ?? 0) || 999999;
      setDaysRemaining(0);
    }
  }, [user]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby,
        myshop: isAdCreator,
      });

      setAds((prevAds: IdynamicAd[]) => {
        const existingAdIds = new Set(prevAds.map((ad) => ad._id));
        const newAds = organizedAds?.data.filter(
          (ad: IdynamicAd) => !existingAdIds.has(ad._id)
        );
        return [...prevAds, ...newAds];
      });

      setTotalPages(organizedAds?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page]);

  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage((prevPage: any) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

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

  const totalViews = data.reduce((sum: number, ad: any) => sum + Number(ad.views || 0), 0);
  const totalInquiries = data.reduce((sum: number, ad: any) => sum + Number(ad.inquiries || 0), 0);
  const totalCalls = data.reduce((sum: number, ad: any) => sum + Number(ad.calls || 0), 0);
  const totalBookmarks = data.reduce((sum: number, ad: any) => sum + Number(ad.bookmarked || 0), 0);

  const metricCard =
    "rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]";
  const miniCard =
    "rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#1B2225]";

  return (
    <div className="min-h-screen bg-slate-50 text-black dark:bg-[#131B1E] dark:text-[#F1F3F3]">
      <TopBar />

      <div className="mx-auto max-w-6xl px-3 pb-10 pt-[calc(var(--topbar-h,64px)+14px)] md:px-4">
        {/* Header */}
        <section className="overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-r from-orange-500 to-orange-400 shadow-sm">
          <div className="px-5 py-7 text-white md:px-8 md:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4" />
                  Performance Dashboard
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
                  Ad Performance
                </h1>

                <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
                  Track how your listings are performing, monitor engagement, and manage active ads professionally.
                </p>
              </div>

              <div className="w-full max-w-sm">
                <SellerProfilePermonance
                  userId={userId}
                  userName={userName}
                  userImage={userImage}
                  user={user ?? []}
                  handleOpenReview={handleOpenReview}
                  handleOpenShop={handleOpenShop}
                  handlePay={handlePay}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Subscription status */}
        <section className="mt-5">
          {loadingSub ? (
            <div className="flex min-h-[100px] items-center justify-center rounded-[24px] border border-orange-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
              <Icon icon={Gooeyballs} className="h-10 w-10 text-orange-500" />
            </div>
          ) : (
            <div className="rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
              {isAdCreator && user?.subscription?.planName !== "Free" && daysRemaining > 0 ? (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Active {user?.subscription?.planName} Plan
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {daysRemaining} day{daysRemaining === 1 ? "" : "s"} left on your subscription
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenPlan()}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    Upgrade Plan
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Active {user?.subscription?.planName} Plan
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Promote your ads further with a higher package
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenPlan()}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-5 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                  >
                    Upgrade Plan
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Summary metrics */}
        <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className={metricCard}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Ads</span>
              <ClassOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{data.length}</p>
          </div>

          <div className={metricCard}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Views</span>
              <Eye className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{totalViews}</p>
          </div>

          <div className={metricCard}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Inquiries</span>
              <MessageCircle className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{totalInquiries}</p>
          </div>

          <div className={metricCard}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Calls</span>
              <Phone className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{totalCalls}</p>
          </div>

          <div className={metricCard}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Bookmarks</span>
              <BookmarkIcon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{totalBookmarks}</p>
          </div>
        </section>

        {/* Ads list */}
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white">
                Listing Performance
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review performance metrics and manage each ad individually.
              </p>
            </div>
          </div>

          {data.length > 0 ? (
            <div className="space-y-5">
              {data.map((ad: any, index: number) => {
                const isLast = data.length === index + 1;

                return (
                  <div
                    ref={isLast ? lastAdRef : null}
                    key={ad._id}
                    className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#2D3236]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
                      {/* image */}
                      <div className="relative h-56 w-full bg-slate-100 lg:h-full dark:bg-[#1B2225]">
                        <img
                          src={ad.data.imageUrls[0] || "/default-ad-image.jpg"}
                          alt={ad.data.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* content */}
                      <div className="p-4 md:p-5">
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate text-xl font-extrabold text-slate-900 dark:text-white">
                              {ad.data.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {ad.data.region} - {ad.data.area}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {ad.adstatus && (
                              <div
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold text-white ${ad.adstatus === "Pending"
                                  ? "bg-amber-500"
                                  : ad.adstatus === "Failed"
                                    ? "bg-red-500"
                                    : "bg-emerald-500"
                                  }`}
                              >
                                {ad.adstatus}
                              </div>
                            )}

                            <button
                              onClick={() => handleAdView(ad)}
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:bg-[#1B2225] dark:text-slate-200"
                            >
                              View Ad
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                          {/* Ad details */}
                          <section className={miniCard}>
                            <p className="mb-3 text-sm font-extrabold text-slate-900 dark:text-white">
                              Ad Details
                            </p>

                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                              <p className="flex items-center gap-2">
                                <SplitscreenOutlinedIcon sx={{ fontSize: 16 }} />
                                <span><strong>Title:</strong> {ad.data.title}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <ClassOutlinedIcon sx={{ fontSize: 16 }} />
                                <span><strong>Category:</strong> {ad.data.subcategory || "N/A"}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <AccessTimeIcon sx={{ fontSize: 16 }} />
                                <span>
                                  <strong>Created:</strong>{" "}
                                  {new Date(ad.createdAt).toLocaleDateString()}
                                </span>
                              </p>
                            </div>
                          </section>

                          {/* Engagement */}
                          <section className={miniCard}>
                            <p className="mb-3 text-sm font-extrabold text-slate-900 dark:text-white">
                              Engagement
                            </p>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="rounded-xl bg-white p-3 dark:bg-[#2D3236]">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                  <Eye className="h-4 w-4" />
                                  Views
                                </div>
                                <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                                  {ad.views || 0}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white p-3 dark:bg-[#2D3236]">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                  <MessageCircle className="h-4 w-4" />
                                  Inquiries
                                </div>
                                <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                                  {ad.inquiries || 0}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white p-3 dark:bg-[#2D3236]">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                  <Phone className="h-4 w-4" />
                                  Calls
                                </div>
                                <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                                  {ad.calls || 0}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white p-3 dark:bg-[#2D3236]">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                  <BookmarkIcon className="h-4 w-4" />
                                  Saved
                                </div>
                                <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                                  {ad.bookmarked || 0}
                                </p>
                              </div>
                            </div>
                          </section>

                          {/* extra info */}
                          <section className={miniCard}>
                            <p className="mb-3 text-sm font-extrabold text-slate-900 dark:text-white">
                              Insights & Actions
                            </p>

                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                              <p className="flex items-center gap-2">
                                <LowPriorityOutlinedIcon sx={{ fontSize: 16 }} />
                                <span><strong>Priority:</strong> {ad.priority || "N/A"}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <FlightTakeoffOutlinedIcon sx={{ fontSize: 16 }} />
                                <span><strong>Plan:</strong> {ad.plan?.name || "Free"}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <LocationOnIcon sx={{ fontSize: 16 }} />
                                <span><strong>Location:</strong> {ad.data.region} - {ad.data.area}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <ShieldOutlinedIcon sx={{ fontSize: 16 }} />
                                <span>
                                  <strong>Verification:</strong>{" "}
                                  {ad.organizer?.verified?.[0]?.accountverified === true
                                    ? "Verified"
                                    : "Not Verified"}
                                </span>
                              </p>
                              {ad.data["propertyarea"] && (
                                <p className="flex items-center gap-2">
                                  <AssistantDirectionOutlinedIcon sx={{ fontSize: 16 }} />
                                  <span><strong>Map Enabled:</strong> Yes</span>
                                </p>
                              )}
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                              <button
                                onClick={() => handleAdEdit(ad)}
                                className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                              >
                                Edit
                              </button>

                              <DeleteConfirmation
                                adId={ad._id}
                                imageUrls={ad.data.imageUrls}
                              />
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            loading === false && (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[28px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-[#2D3236]">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  0 Ads
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  No ads to display.
                </p>
              </div>
            )
          )}

          {loading && (
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="rounded-full bg-orange-50 p-4 dark:bg-orange-500/10">
                <Image
                  src="/assets/icons/loading.gif"
                  alt="loading"
                  width={60}
                  height={60}
                  unoptimized
                />
              </div>
            </div>
          )}
        </section>

        <Toaster />
      </div>

      <footer>
        <Footersub
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
        />
      </footer>
    </div>
  );
};

export default DashboardPerformance;