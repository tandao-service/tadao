import { IAd } from "@/lib/database/models/ad.model";
import React, { useEffect, useRef, useState } from "react";
import VerticalCard from "./VerticalCard";
import HorizontalCard from "./HorizontalCard";
import Image from "next/image";
import {
  getAdByUser,
  getAllBidsGroupedByAd,
  markWinner,
  removeBid,
} from "@/lib/actions/dynamicAd.actions";
import Masonry from "react-masonry-css";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import CollectionMyLoans from "./CollectionMyLoans";
import AdminBidsPage from "./adminbids";
import { toast } from "@/components/ui/use-toast";

type CollectionProps = {
  userId: string;
  sortby: string;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  loans: any;
  urlParamName?: string;
  isAdCreator: boolean;
  isVertical: boolean;
  loadPopup: boolean;
  handleAdEdit: (ad: any) => void;
  handleAdView: (ad: any) => void;
  handleOpenPlan: () => void;
  handleOpenChatId: (value: any) => void;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

interface Bid {
  _id: string;
  adId: string;
  username: string;
  amount: number;
  timestamp: string;
  isWinner?: boolean;
  isAbusive?: boolean;
}

type GroupedBids = {
  adId: string;
  title: string;
  thumbnail?: string;
  bids: Bid[];
};

const CollectionMyads = ({
  loans,
  userId,
  emptyTitle,
  emptyStateSubtext,
  sortby,
  handleOpenChatId,
  isAdCreator,
  isVertical,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
}: CollectionProps) => {
  const [data, setAds] = useState<IAd[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchAds = async () => {
    setLoading(true);

    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby: sortby,
        myshop: isAdCreator,
      });

      setAds((prevAds: IAd[]) => {
        const existingAdIds = new Set(prevAds.map((ad) => ad._id));
        const newAds = organizedAds?.data.filter(
          (ad: IAd) => !existingAdIds.has(ad._id)
        );
        return [...prevAds, ...newAds];
      });

      setTotalPages(organizedAds?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAds();
    }
  }, [page, sortby]);

  const [bids, setBids] = useState<GroupedBids[]>([]);
  const [isBidLoading, setIsbidLoading] = useState(false);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setIsbidLoading(true);
        const res: any = await getAllBidsGroupedByAd();
        if (res.success) {
          setBids(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setIsbidLoading(false);
      }
    };

    fetchBids();
  }, []);

  const handleRemove = async (bidId: string) => {
    const res = await removeBid(bidId);
    if (res.success) {
      setBids((prev) =>
        prev.map((group) => ({
          ...group,
          bids: group.bids.filter((bid) => bid._id !== bidId),
        }))
      );
      toast({ title: "Bid removed", duration: 3000 });
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  const handleMarkWinner = async (bidId: string) => {
    const res: any = await markWinner(bidId);
    if (res.success) {
      toast({ title: "Winner marked!" });
      setBids((prev) =>
        prev.map((group) => ({
          ...group,
          bids: group.bids.map((bid) => ({
            ...bid,
            isWinner: bid._id === bidId,
          })),
        }))
      );
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    }
  };

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

  const breakpointColumns = {
    default: 4,
    1280: 3,
    900: 2,
    700: 2,
    520: 1,
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = Array.from(
    new Set(data.map((item: any) => item.data.category).filter(Boolean))
  );

  const filteredAds = selectedCategory
    ? data.filter((item: any) => item.data.category === selectedCategory)
    : data;

  const [inputMode, setInputMode] = useState<"Ads" | "Loans" | "Bids">("Ads");

  const tabBase =
    "h-12 rounded-2xl px-4 text-sm font-semibold transition flex items-center justify-center gap-2 border";
  const tabActive =
    "border-orange-200 bg-orange-50 text-orange-600 shadow-sm";
  const tabInactive =
    "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600";

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="rounded-[24px] border border-orange-100 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          <button
            title="Ads"
            onClick={() => setInputMode("Ads")}
            className={`${tabBase} ${inputMode === "Ads" ? tabActive : tabInactive
              }`}
          >
            <ListOutlinedIcon fontSize="small" />
            <span className="truncate">My Ads</span>
          </button>

          <button
            title="Bids"
            onClick={() => setInputMode("Bids")}
            className={`${tabBase} ${inputMode === "Bids" ? tabActive : tabInactive
              }`}
          >
            <ChecklistRtlOutlinedIcon fontSize="small" />
            <span className="truncate">Bids</span>
          </button>

          <button
            title="Loans"
            onClick={() => setInputMode("Loans")}
            className={`${tabBase} ${inputMode === "Loans" ? tabActive : tabInactive
              }`}
          >
            <ChecklistRtlOutlinedIcon fontSize="small" />
            <span className="truncate">Loan Requests</span>
          </button>
        </div>
      </div>

      {/* ADS */}
      {inputMode === "Ads" && (
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                My Ads
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Manage, review, and track all listings from this seller profile.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto">
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Filter by category
              </label>
              <select
                className="h-11 min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={String(category)} value={String(category)}>
                    {String(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredAds.length > 0 ? (
            isVertical ? (
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-3 md:-ml-4"
                columnClassName="pl-3 md:pl-4 bg-clip-padding"
              >
                {filteredAds.map((ad: any, index: number) => {
                  const isLast = filteredAds.length === index + 1;

                  return (
                    <div
                      ref={isLast ? lastAdRef : null}
                      key={ad._id}
                      className="mb-3 md:mb-4"
                    >
                      <VerticalCard
                        ad={ad}
                        userId={userId}
                        isAdCreator={isAdCreator}
                        handleAdView={handleAdView}
                        handleAdEdit={handleAdEdit}
                        handleOpenPlan={handleOpenPlan}
                        handleOpenChatId={handleOpenChatId}
                      />
                    </div>
                  );
                })}
              </Masonry>
            ) : (
              <div className="space-y-3">
                {filteredAds.map((ad: any, index: number) => {
                  const isLast = filteredAds.length === index + 1;

                  return (
                    <div ref={isLast ? lastAdRef : null} key={ad._id}>
                      <HorizontalCard
                        ad={ad}
                        userId={userId}
                        isAdCreator={isAdCreator}
                        handleAdView={handleAdView}
                        handleAdEdit={handleAdEdit}
                        handleOpenPlan={handleOpenPlan}
                        handleOpenChatId={handleOpenChatId}
                      />
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            !loading && (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-orange-200 bg-orange-50 px-6 py-12 text-center">
                <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                  <ListOutlinedIcon className="text-orange-500" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {emptyTitle}
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                  {emptyStateSubtext}
                </p>
              </div>
            )
          )}

          {loading && (
            <div className="flex min-h-[220px] w-full flex-col items-center justify-center">
              <div className="rounded-full bg-orange-50 p-4">
                <Image
                  src="/assets/icons/loading.gif"
                  alt="loading"
                  width={56}
                  height={56}
                  unoptimized
                />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">
                Loading ads...
              </p>
            </div>
          )}
        </section>
      )}

      {/* LOANS */}
      {inputMode === "Loans" && (
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm md:p-5">
          {loans && isAdCreator && (
            <>
              <div className="mb-5 border-b border-slate-100 pb-5">
                <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                  Loan Requests
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Review all incoming loan requests linked to this seller.
                </p>
              </div>

              <ScrollArea className="w-full">
                <CollectionMyLoans
                  data={loans.data}
                  emptyTitle="No request"
                  emptyStateSubtext="(0) Loan Request"
                  limit={200}
                  page={1}
                  userId={userId}
                  totalPages={loans.totalPages}
                  handleOpenChatId={handleOpenChatId}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </>
          )}
        </section>
      )}

      {/* BIDS */}
      {inputMode === "Bids" && (
        <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm md:p-5">
          {isAdCreator && (
            <>
              <div className="mb-5 border-b border-slate-100 pb-5">
                <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                  Bids
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Review bids, remove unwanted ones, or mark a winner.
                </p>
              </div>

              <AdminBidsPage
                bidsGrouped={bids}
                loading={isBidLoading}
                handleRemoveBid={handleRemove}
                handleMarkWinner={handleMarkWinner}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default CollectionMyads;