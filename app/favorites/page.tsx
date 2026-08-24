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
        const chatUserId =
            value?._id ||
            value?.id ||
            value?.userId ||
            value;

        if (!chatUserId) return;

        router.push(`/profile-messages/${chatUserId}`);
    };

    const handleOpenPlan = () => {
        router.push("/plan");
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */
    if (loading) {
        return (
            <>
                <TopBar />

                <main className="min-h-screen bg-slate-50">
                    <div className="mx-auto flex w-full max-w-[1600px] items-center justify-center px-4 py-10 sm:px-6 md:py-14 lg:px-8">
                        <div className="flex min-h-[55vh] w-full items-center justify-center">
                            <div className="w-full max-w-md rounded-[24px] border border-orange-100 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 sm:h-16 sm:w-16">
                                    <DiamondIcon />
                                </div>

                                <h2 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                                    Loading favorites
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                                    Please wait while we fetch your saved ads.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Not signed in
    |--------------------------------------------------------------------------
    */
    if (!userId) {
        return (
            <>
                <TopBar />

                <main className="min-h-screen bg-slate-50">
                    <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1600px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                        <div className="w-full max-w-xl rounded-[24px] border border-orange-100 bg-white px-5 py-9 text-center shadow-sm sm:rounded-[28px] sm:px-10 sm:py-12">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 sm:h-16 sm:w-16">
                                <DiamondIcon />
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                                My Favorites
                            </h1>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                                Sign in to view the ads you have saved and return
                                to them any time.
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Link
                                    href="/sign-in"
                                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-600 sm:w-auto"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/"
                                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
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

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */
    return (
        <>
            <TopBar />

            <main className="min-h-screen bg-slate-50">
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1800px]
                        px-3
                        py-3
                        sm:px-4
                        sm:py-5
                        md:px-6
                        md:py-6
                        lg:px-8
                        xl:px-9
                    "
                >
                    {/* Hero */}
                    <section
                        className="
                            overflow-hidden
                            rounded-[24px]
                            border
                            border-orange-100
                            bg-gradient-to-r
                            from-orange-500
                            to-orange-400
                            shadow-sm
                            sm:rounded-[28px]
                            lg:rounded-[36px]
                        "
                    >
                        <div
                            className="
                                px-5
                                py-6
                                text-white
                                sm:px-7
                                sm:py-8
                                md:px-9
                                md:py-9
                                lg:px-12
                                lg:py-12
                                xl:px-14
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-6
                                    lg:flex-row
                                    lg:items-center
                                    lg:justify-between
                                    lg:gap-10
                                "
                            >
                                {/* Hero text */}
                                <div className="min-w-0 flex-1">
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-white/15
                                            px-3
                                            py-2
                                            text-xs
                                            font-semibold
                                            backdrop-blur-sm
                                            sm:px-4
                                            sm:text-sm
                                        "
                                    >
                                        <BookmarkIcon className="h-4 w-4 shrink-0" />
                                        <span>Saved ads</span>
                                    </div>

                                    <h1
                                        className="
                                            mt-5
                                            text-[34px]
                                            font-extrabold
                                            leading-[1.05]
                                            tracking-[-0.04em]
                                            sm:text-4xl
                                            md:text-5xl
                                            lg:text-[58px]
                                            xl:text-[64px]
                                        "
                                    >
                                        My Favorites
                                    </h1>

                                    <p
                                        className="
                                            mt-4
                                            max-w-4xl
                                            text-sm
                                            leading-6
                                            text-orange-50
                                            sm:text-base
                                            sm:leading-7
                                            lg:text-lg
                                            lg:leading-8
                                        "
                                    >
                                        Keep track of your favorite listings and
                                        quickly return to ads you want to compare,
                                        contact, or buy later.
                                    </p>
                                </div>

                                {/* Hero button */}
                                <div className="w-full shrink-0 lg:w-auto">
                                    <Link
                                        href="/"
                                        className="
                                            inline-flex
                                            h-12
                                            w-full
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-white
                                            px-6
                                            text-sm
                                            font-bold
                                            text-orange-600
                                            shadow-sm
                                            transition
                                            hover:bg-orange-50
                                            sm:w-auto
                                            lg:h-14
                                            lg:px-8
                                            lg:text-base
                                        "
                                    >
                                        Browse more ads
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Saved listings section */}
                    <section
                        className="
                            mt-4
                            rounded-[24px]
                            border
                            border-orange-100
                            bg-white
                            p-4
                            shadow-sm
                            sm:mt-5
                            sm:rounded-[28px]
                            sm:p-5
                            md:mt-6
                            md:p-6
                            lg:rounded-[36px]
                            lg:p-8
                            xl:p-9
                        "
                    >
                        {/* Header */}
                        <div
                            className="
                                mb-5
                                flex
                                flex-col
                                gap-4
                                border-b
                                border-slate-100
                                pb-5
                                md:flex-row
                                md:items-center
                                md:justify-between
                                md:gap-6
                                lg:mb-7
                                lg:pb-7
                            "
                        >
                            <div className="min-w-0">
                                <h2
                                    className="
                                        text-2xl
                                        font-extrabold
                                        tracking-[-0.03em]
                                        text-slate-900
                                        sm:text-[28px]
                                        lg:text-3xl
                                    "
                                >
                                    Saved listings
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-slate-500
                                        sm:text-base
                                    "
                                >
                                    Ads you favorite will appear here for quick
                                    access.
                                </p>
                            </div>

                            <div
                                className="
                                    inline-flex
                                    w-fit
                                    shrink-0
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-orange-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-orange-600
                                    sm:px-5
                                    md:self-center
                                "
                            >
                                <BookmarkIcon className="h-4 w-4 shrink-0" />
                                <span>Tadao Market favorites</span>
                            </div>
                        </div>

                        {/* Collection */}
                        <div className="min-w-0">
                            <CollectionBookmark
                                userId={userId}
                                emptyTitle="No saved ads yet"
                                emptyStateSubtext="Ads you favorite will appear here."
                                limit={12}
                                isAdCreator={false}
                                isVertical={true}
                                collectionType="All_Ads"
                                handleAdView={handleAdView}
                                handleAdEdit={handleAdEdit}
                                handleOpenChatId={handleOpenChatId}
                                handleOpenPlan={handleOpenPlan}
                            />
                        </div>
                    </section>
                </div>

                <Toaster />
            </main>
        </>
    );
}