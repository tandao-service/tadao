import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/home/TopBar.client";
import { getActiveAuctionAds } from "@/lib/actions/auction.actions";

type Props = {
    searchParams?: {
        subcategory?: string;
        q?: string;
        sort?: string;
    };
};

function formatMoney(value: any) {
    const n = Number(value || 0);
    if (!Number.isFinite(n)) return "KSh 0";
    return `KSh ${n.toLocaleString()}`;
}

function timeLeftLabel(dateValue: any) {
    if (!dateValue) return "No end date";

    const end = new Date(dateValue);
    const now = new Date();

    if (Number.isNaN(end.getTime())) return "No end date";

    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Ended";

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return `${minutes} min left`;
}

function getHighestBid(ad: any) {
    if (!Array.isArray(ad?.bids) || ad.bids.length === 0) return 0;
    return Math.max(...ad.bids.map((b: any) => Number(b?.amount || 0)));
}

function getStartPrice(ad: any) {
    return Number(ad?.data?.price || 0);
}

function getCoverImage(ad: any) {
    return ad?.data?.coverThumbUrl || ad?.data?.imageUrls?.[0] || "/placeholder.svg";
}

function getTitle(ad: any) {
    return ad?.data?.title || ad?.data?.name || "Auction Item";
}

function getDescription(ad: any) {
    return String(ad?.data?.description || "").replace(/<[^>]*>/g, "").trim();
}

export default async function AuctionPage({ searchParams }: Props) {
    const subcategoryId = searchParams?.subcategory || "";
    const q = (searchParams?.q || "").trim().toLowerCase();
    const sort = searchParams?.sort || "ending-soon";

    const adsRaw = await getActiveAuctionAds(subcategoryId);

    const subcategoryOptions = Array.from(
        new Map(
            (adsRaw || [])
                .filter((ad: any) => ad?.subcategory?._id && ad?.subcategory?.name)
                .map((ad: any) => [
                    String(ad.subcategory._id),
                    {
                        id: String(ad.subcategory._id),
                        name: String(ad.subcategory.name),
                    },
                ])
        ).values()
    );

    let ads = (adsRaw || []).filter((ad: any) => {
        if (!q) return true;

        const haystack = [
            ad?.data?.title,
            ad?.data?.name,
            ad?.data?.description,
            ad?.subcategory?.name,
            ad?.data?.region,
            ad?.data?.area,
            ad?.data?.brand,
            ad?.data?.model,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(q);
    });

    ads = ads.sort((a: any, b: any) => {
        if (sort === "highest-bid") {
            return getHighestBid(b) - getHighestBid(a);
        }

        if (sort === "newest") {
            return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
        }

        if (sort === "price-low") {
            return getStartPrice(a) - getStartPrice(b);
        }

        if (sort === "price-high") {
            return getStartPrice(b) - getStartPrice(a);
        }

        return new Date(a?.biddingEndsAt || 0).getTime() - new Date(b?.biddingEndsAt || 0).getTime();
    });

    const topBids = ads
        .slice()
        .sort((a: any, b: any) => getHighestBid(b) - getHighestBid(a))
        .slice(0, 3);

    return (
        <>
            <TopBar />

            <main className="mx-auto max-w-7xl px-4 pt-[calc(var(--topbar-h,64px)+16px)] pb-8">
                <section className="overflow-hidden rounded-[32px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
                    <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1.25fr_.75fr] lg:px-8 lg:py-8">
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-700">
                                    Live Auctions
                                </div>

                                <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                                    Bid on active auction items
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                                    Browse items with bidding enabled, compare current bids, and open any item to place your offer before time runs out.
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div className="rounded-2xl border border-orange-100 bg-white px-4 py-4 shadow-sm">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Active items
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                                            {ads.length}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-orange-100 bg-white px-4 py-4 shadow-sm">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Categories
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                                            {subcategoryOptions.length}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-orange-100 bg-white px-4 py-4 shadow-sm">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Top bid
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                                            {ads.length ? formatMoney(Math.max(...ads.map((x: any) => getHighestBid(x) || getStartPrice(x)))) : "KSh 0"}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-orange-100 bg-white px-4 py-4 shadow-sm">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Status
                                        </div>
                                        <div className="mt-2 text-sm font-extrabold text-orange-600">
                                            Live now
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[28px] border border-orange-100 bg-white/90 p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-extrabold text-slate-900">
                                            Live highlights
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Highest bidding items right now.
                                        </p>
                                    </div>

                                    <Link
                                        href="/auctions"
                                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600"
                                    >
                                        Explore
                                    </Link>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                    {topBids.length > 0 ? (
                                        topBids.map((ad: any) => (
                                            <Link
                                                key={String(ad._id)}
                                                href={`/ads/${ad._id}`}
                                                className="group rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-orange-200 hover:bg-orange-50"
                                            >
                                                <div className="line-clamp-1 text-sm font-bold text-slate-900">
                                                    {getTitle(ad)}
                                                </div>
                                                <div className="mt-2 text-xs text-slate-500">
                                                    {ad?.subcategory?.name || "Auction"}
                                                </div>
                                                <div className="mt-3 text-sm font-extrabold text-orange-600">
                                                    {formatMoney(getHighestBid(ad) || getStartPrice(ad))}
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="sm:col-span-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-6 text-center text-sm text-slate-500">
                                            No live highlights yet. New auction items will appear here.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-gradient-to-br from-white via-orange-50/70 to-orange-100/60 p-6 shadow-[0_20px_60px_rgba(249,115,22,0.10)]">
                            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-200/40 blur-2xl" />
                            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-amber-200/40 blur-2xl" />

                            <div className="relative">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-700 shadow-sm ring-1 ring-orange-100">
                                    <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                                    Bid Smarter
                                </div>

                                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">
                                    Auction tips
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Stay ahead with a few simple checks before you place your next bid.
                                </p>

                                <div className="mt-5 space-y-3">
                                    <div className="flex items-start gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                                        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-extrabold text-orange-700">
                                            1
                                        </div>
                                        <p className="text-sm leading-6 text-slate-700">
                                            Check the <span className="font-bold text-slate-900">current highest bid</span> before placing your offer.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                                        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-extrabold text-orange-700">
                                            2
                                        </div>
                                        <p className="text-sm leading-6 text-slate-700">
                                            Watch the <span className="font-bold text-slate-900">remaining time</span> so you don’t miss the closing window.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                                        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-extrabold text-orange-700">
                                            3
                                        </div>
                                        <p className="text-sm leading-6 text-slate-700">
                                            Open the item page to view <span className="font-bold text-slate-900">full details and bid history</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                    <form method="GET" className="grid gap-3 lg:grid-cols-4">
                        <div className="lg:col-span-2">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Search
                            </label>
                            <input
                                type="text"
                                name="q"
                                defaultValue={searchParams?.q || ""}
                                placeholder="Search auction items..."
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Subcategory
                            </label>
                            <select
                                name="subcategory"
                                defaultValue={subcategoryId}
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            >
                                <option value="">All subcategories</option>
                                {subcategoryOptions.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Sort
                            </label>
                            <select
                                name="sort"
                                defaultValue={sort}
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            >
                                <option value="ending-soon">Ending soon</option>
                                <option value="highest-bid">Highest bid</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Start price: low to high</option>
                                <option value="price-high">Start price: high to low</option>
                            </select>
                        </div>

                        <div className="lg:col-span-4 flex flex-wrap gap-3 pt-1">
                            <button
                                type="submit"
                                className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600"
                            >
                                Apply Filters
                            </button>

                            <Link
                                href="/auctions"
                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 transition hover:bg-white"
                            >
                                Reset
                            </Link>
                        </div>
                    </form>
                </section>

                <section className="mt-6">
                    {ads.length === 0 ? (
                        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                            <div className="grid gap-0 lg:grid-cols-[1.1fr_.9fr]">
                                <div className="flex items-center px-8 py-12">
                                    <div className="max-w-lg">
                                        <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-700">
                                            No results
                                        </div>

                                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                                            No active auction items found
                                        </h2>

                                        <p className="mt-3 text-sm leading-6 text-slate-500">
                                            Try changing your filters, broadening your search, or check back later for fresh auction listings.
                                        </p>

                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <Link
                                                href="/auctions"
                                                className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white hover:bg-orange-600"
                                            >
                                                View all auctions
                                            </Link>

                                            <Link
                                                href="/"
                                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 hover:bg-white"
                                            >
                                                Go Home
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100/70 px-8 py-12">
                                    <div className="rounded-[28px] border border-orange-100 bg-white/80 p-6 shadow-sm">
                                        <div className="text-sm font-extrabold text-slate-900">
                                            Suggestions
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                                Remove the search keyword to see all live items.
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                                Switch subcategory back to <span className="font-bold text-slate-900">All subcategories</span>.
                                            </div>
                                            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                                Use <span className="font-bold text-slate-900">Ending soon</span> to find active closing bids faster.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    Available auction items
                                </h2>
                                <p className="text-sm text-slate-500">{ads.length} result(s)</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {ads.map((ad: any) => {
                                    const highestBid = getHighestBid(ad);
                                    const startPrice = getStartPrice(ad);
                                    const displayBid = highestBid > 0 ? highestBid : startPrice;
                                    const title = getTitle(ad);
                                    const desc = getDescription(ad);
                                    const image = getCoverImage(ad);
                                    const subcategoryName = ad?.subcategory?.name || "Auction";
                                    const timeLeft = timeLeftLabel(ad?.biddingEndsAt);

                                    return (
                                        <article
                                            key={String(ad._id)}
                                            className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
                                        >
                                            <Link href={`/ads/${ad._id}`} className="block">
                                                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                                    <Image
                                                        src={image}
                                                        alt={title}
                                                        fill
                                                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                        unoptimized
                                                    />

                                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />

                                                    <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-700 shadow-sm">
                                                        {subcategoryName}
                                                    </div>

                                                    <div className="absolute bottom-3 right-3 inline-flex items-center rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white">
                                                        {timeLeft}
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="line-clamp-2 text-base font-extrabold text-slate-900">
                                                        {title}
                                                    </h3>
                                                </div>

                                                {desc ? (
                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                                                        {desc}
                                                    </p>
                                                ) : null}

                                                <div className="mt-4 grid grid-cols-2 gap-3">
                                                    <div className="rounded-2xl bg-orange-50 px-3 py-3">
                                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-600">
                                                            Current bid
                                                        </div>
                                                        <div className="mt-1 text-sm font-extrabold text-slate-900">
                                                            {formatMoney(displayBid)}
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                                                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                            Ends
                                                        </div>
                                                        <div className="mt-1 text-sm font-extrabold text-slate-900">
                                                            {ad?.biddingEndsAt
                                                                ? new Date(ad.biddingEndsAt).toLocaleDateString()
                                                                : "-"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="text-xs text-slate-500">
                                                        {Array.isArray(ad?.bids) ? ad.bids.length : 0} bid(s)
                                                    </div>

                                                    <Link
                                                        href={`/ads/${ad._id}`}
                                                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600"
                                                    >
                                                        View Item
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </>
    );
}