"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DiamondIcon from "@mui/icons-material/Diamond";
import TopBar from "@/components/home/TopBar.client";
import Listpackages from "@/components/shared/listpackages";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { useAuth } from "@/app/hooks/useAuth";

function getDaysRemaining(expiresAt?: string | Date | null) {
    if (!expiresAt) return 0;

    const now = new Date();
    const exp = new Date(expiresAt);
    const diff = exp.getTime() - now.getTime();

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function PackagesPageClient() {
    const router = useRouter();

    const {
        user,
        appUserId,
        loading,
        profileLoading,
    } = useAuth();

    const [packagesList, setPackagesList] = useState<any[]>([]);
    const [packagesLoading, setPackagesLoading] = useState(true);

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (!loading && !profileLoading && !appUserId) {
            router.replace("/auth");
        }
    }, [loading, profileLoading, appUserId, router]);

    /*
    |--------------------------------------------------------------------------
    | Load packages
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        let mounted = true;

        const loadPackages = async () => {
            try {
                setPackagesLoading(true);

                const data = await getAllPackages();

                if (mounted) {
                    setPackagesList(
                        Array.isArray(data)
                            ? data
                            : []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load packages:",
                    error
                );

                if (mounted) {
                    setPackagesList([]);
                }
            } finally {
                if (mounted) {
                    setPackagesLoading(false);
                }
            }
        };

        loadPackages();

        return () => {
            mounted = false;
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Subscription
    |--------------------------------------------------------------------------
    */
    const subscription = user?.subscription || {};

    const isActive = Boolean(
        subscription?.active
    );

    const packname = isActive
        ? String(
            subscription?.planName || "Free"
        )
        : "Free";

    const daysRemaining =
        isActive && subscription?.expiresAt
            ? getDaysRemaining(
                subscription.expiresAt
            )
            : 0;

    const isBusy =
        loading ||
        profileLoading ||
        packagesLoading;

    /*
    |--------------------------------------------------------------------------
    | Loading state
    |--------------------------------------------------------------------------
    */
    if (isBusy) {
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
                                    <DiamondIcon fontSize="small" />

                                    Packages
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
                                    Choose Your Package
                                </h1>

                                <p
                                    className="
                                        mt-4
                                        max-w-3xl
                                        text-sm
                                        leading-6
                                        text-orange-50
                                        sm:text-base
                                        sm:leading-7
                                        lg:text-lg
                                    "
                                >
                                    Loading packages and
                                    preparing your subscription
                                    options.
                                </p>
                            </div>
                        </section>

                        {/* Content */}
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
                            <div className="mb-6">
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
                                    Available packages
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-6
                                        text-slate-500
                                        sm:text-base
                                    "
                                >
                                    Choose the best package for
                                    your ads.
                                </p>
                            </div>

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                "
                            >
                                {Array.from({
                                    length: 4,
                                }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="
                                            h-[320px]
                                            animate-pulse
                                            rounded-[22px]
                                            border
                                            border-orange-100
                                            bg-gradient-to-b
                                            from-orange-50
                                            to-white
                                            sm:h-[340px]
                                            lg:h-[360px]
                                        "
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Redirecting
    |--------------------------------------------------------------------------
    */
    if (!user || !appUserId) {
        return null;
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
                                    lg:gap-12
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
                                        <DiamondIcon fontSize="small" />

                                        <span>
                                            Subscription plans
                                        </span>
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
                                        Choose Your Package
                                    </h1>

                                    <p
                                        className="
                                            mt-4
                                            max-w-3xl
                                            text-sm
                                            leading-6
                                            text-orange-50
                                            sm:text-base
                                            sm:leading-7
                                            lg:text-lg
                                            lg:leading-8
                                        "
                                    >
                                        Select the package that
                                        fits your posting needs
                                        and continue to payment.
                                    </p>
                                </div>

                                {/* Current plan */}
                                <div
                                    className="
                                        w-full
                                        rounded-[20px]
                                        border
                                        border-white/10
                                        bg-white/10
                                        px-5
                                        py-4
                                        backdrop-blur-sm
                                        sm:px-6
                                        sm:py-5
                                        lg:w-auto
                                        lg:min-w-[280px]
                                        xl:min-w-[320px]
                                    "
                                >
                                    <p
                                        className="
                                            text-[11px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.18em]
                                            text-orange-100
                                            sm:text-xs
                                        "
                                    >
                                        Current plan
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            break-words
                                            text-2xl
                                            font-extrabold
                                            text-white
                                            sm:text-3xl
                                        "
                                    >
                                        {packname}
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-orange-50
                                        "
                                    >
                                        {isActive
                                            ? `${daysRemaining} day${daysRemaining ===
                                                1
                                                ? ""
                                                : "s"
                                            } remaining`
                                            : "You are currently on the free plan"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Packages */}
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
                        {/* Section header */}
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
                                    Available packages
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        max-w-3xl
                                        text-sm
                                        leading-6
                                        text-slate-500
                                        sm:text-base
                                    "
                                >
                                    Upgrade your visibility and
                                    promote your ads more
                                    effectively.
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
                                "
                            >
                                <DiamondIcon fontSize="small" />

                                <span>
                                    Tadao Market plans
                                </span>
                            </div>
                        </div>

                        {/* Package cards */}
                        <div className="min-w-0 overflow-hidden">
                            <Listpackages
                                packagesList={packagesList}
                                userId={String(user._id)}
                                daysRemaining={
                                    daysRemaining
                                }
                                packname={packname}
                                user={user}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}