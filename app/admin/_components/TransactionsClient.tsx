"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
    formUrlQuery,
    formUrlQuerymultiple,
    removeKeysFromQuery,
} from "@/lib/utils";
import { getallTransactions } from "@/lib/actions/transactions.actions";
import CollectionTransactions from "@/components/shared/CollectionTransactions";
import {
    AdminCard,
    AdminPageHeader,
    AdminSectionLoader,
} from "./AdminShared";

export default function TransactionsClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 50;
    const transactionId = searchParams.get("transactionId") || "";
    const start = searchParams.get("start") || "";
    const end = searchParams.get("end") || "";

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any>(null);
    const [search, setSearch] = useState(transactionId);
    const [startDate, setStartDate] = useState<string | null>(start || null);
    const [endDate, setEndDate] = useState<string | null>(end || null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res = await getallTransactions(transactionId, start, end, limit, page);
                if (!cancelled) setTransactions(res);
            } catch (error) {
                console.error("Failed to load transactions:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [transactionId, start, end, limit, page]);

    const handleSearchDates = () => {
        let newUrl = "";

        if (startDate || endDate) {
            newUrl = formUrlQuerymultiple({
                params: searchParams.toString(),
                updates: {
                    start: startDate ?? "",
                    end: endDate ?? "",
                },
            });
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ["start", "end"],
            });
        }

        router.push(newUrl, { scroll: false });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        let newUrl = "";
        if (search) {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "transactionId",
                value: search,
            });
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ["transactionId"],
            });
        }

        router.push(newUrl, { scroll: false });
    };

    const handleClear = () => {
        setSearch("");
        setStartDate(null);
        setEndDate(null);

        const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["transactionId", "start", "end"],
        });

        router.push(newUrl, { scroll: false });
    };

    if (loading) {
        return <AdminSectionLoader label="Loading transactions..." />;
    }

    return (
        <>
            <AdminPageHeader
                eyebrow="Transactions"
                title="Transactions"
                subtitle="Track orders, subscriptions, and transaction status."
            />

            <AdminCard className="mb-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate || ""}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate || ""}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                            />
                        </div>

                        <button
                            onClick={handleSearchDates}
                            className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white hover:bg-orange-500"
                        >
                            Search Dates
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Search by Order ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 min-w-[260px] rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                        />
                        <button
                            type="submit"
                            className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white hover:bg-orange-500"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Clear
                        </button>
                    </form>
                </div>
            </AdminCard>

            <AdminCard>
                <CollectionTransactions
                    data={transactions?.data || []}
                    emptyTitle="No Order Found"
                    emptyStateSubtext="Come back later"
                    limit={limit}
                    page={page}
                    totalPages={transactions?.totalPages || 1}
                    handleOpenChatId={() => { }}
                />
            </AdminCard>
        </>
    );
}