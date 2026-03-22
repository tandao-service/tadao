"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DiamondIcon from "@mui/icons-material/Diamond";
import { useAuth } from "@/app/hooks/useAuth";
import CollectionBookmark from "@/components/shared/CollectionBookmark";
import { BookmarkIcon } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import TopBar from "@/components/home/TopBar.client";

export default function BookmarksPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const userId = user?._id || user?.id || user?.userId || "";

    const handleAdView = (ad: any) => {
        const adId = ad?._id || ad?.adId?._id || ad?.adId || ad?.id;
        if (!adId) return;
        router.push(`/ads/${adId}`);
    };

    const handleAdEdit = (ad: any) => {
        const adId = ad?._id || ad?.adId?._id || ad?.adId || ad?.id;
        if (!adId) return;
        router.push(`/ads/${adId}/update`);
    };

    const handleOpenChatId = (value: any) => {
        const chatUserId = value?._id || value?.id || value?.userId || value;
        if (!chatUserId) return;
        router.push(`/profile-messages/${chatUserId}`);
    };

    const handleOpenPlan = () => {
        router.push("/plan");
    };

    if (loading) {
        return (
            <>
                <TopBar />
                <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 md:px-6">
                        <div className="flex min-h-[50vh] w-full items-center justify-center">
                            <div className="rounded-[28px] border border-orange-100 bg-white px-10 py-12 text-center shadow-sm">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                                    <DiamondIcon />
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-slate-900">
                                    Loading bookmarks
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Please wait while we fetch your saved ads.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!userId) {
        return (
            <>
                <TopBar />
                <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-12 md:px-6">
                        <div className="mx-auto w-full max-w-xl rounded-[28px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm md:px-10">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                                <DiamondIcon />
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-slate-900">
                                My Bookmarks
                            </h1>

                            <p className="mt-3 text-sm text-slate-500 md:text-base">
                                Sign in to view the ads you have saved and return to them any
                                time.
                            </p>

                            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    href="/sign-in"
                                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-600"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/"
                                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Browse Ads
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <TopBar />

            <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
                    {/* Hero / Page Header */}
                    <section className="overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-r from-orange-500 to-orange-400 shadow-sm">
                        <div className="px-6 py-8 text-white md:px-10 md:py-10">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                                        <BookmarkIcon className="h-4 w-4" />
                                        Saved ads
                                    </div>

                                    <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
                                        My Bookmarks
                                    </h1>

                                    <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
                                        Keep track of your favourite listings and quickly return to
                                        ads you want to compare, contact, or buy later.
                                    </p>
                                </div>

                                <div className="flex-shrink-0">
                                    <Link
                                        href="/"
                                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
                                    >
                                        Browse more ads
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content */}
                    <section className="mt-6 rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm md:p-6">
                        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                                    Saved listings
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Ads you bookmark will appear here for quick access.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
                                <BookmarkIcon className="h-4 w-4" />
                                Tadao Market favourites
                            </div>
                        </div>

                        <CollectionBookmark
                            userId={userId}
                            emptyTitle="No saved ads yet"
                            emptyStateSubtext="Ads you bookmark will appear here."
                            limit={12}
                            isAdCreator={false}
                            isVertical={true}
                            collectionType="All_Ads"
                            handleAdView={handleAdView}
                            handleAdEdit={handleAdEdit}
                            handleOpenChatId={handleOpenChatId}
                            handleOpenPlan={handleOpenPlan}
                        />
                    </section>
                </div>

                <Toaster />
            </main>
        </>
    );
}