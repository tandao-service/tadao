"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Search } from "lucide-react";

import {
    AdminCard,
    AdminEmpty,
    AdminPageHeader,
    AdminSectionLoader,
    formatCurrency,
} from "./AdminShared";

import { useToast } from "@/components/ui/use-toast";
import { deleteAdminProduct, getAdminProducts } from "@/lib/actions/admin.products.actions";
function InfoRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-right text-sm font-semibold text-slate-950">
                {value}
            </span>
        </div>
    );
}
export default function AdminProductsClient() {
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [previewItem, setPreviewItem] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");

    async function load() {
        try {
            setLoading(true);

            const res = await getAdminProducts({
                page,
                limit,
                search,
                status,
                category,
            });

            setItems(res?.data || []);
            setTotalPages(res?.totalPages || 1);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [page, limit, status, category]);

    async function handleSearch() {
        setPage(1);
        await load();
    }

    async function handleDelete(productId: string) {
        if (!confirm("Delete this product/listing?")) return;

        const res = await deleteAdminProduct(productId);

        if (res?.success) {
            toast({
                title: "Deleted",
                description: "Product deleted successfully.",
                className: "bg-[#30AF5B] text-white",
            });
            load();
        } else {
            toast({
                variant: "destructive",
                title: "Failed",
                description: res?.message || "Could not delete product.",
            });
        }
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Products"
                title="Products Management"
                subtitle="View, preview, filter, and delete posted marketplace listings."
            />

            <AdminCard>
                <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_180px_180px_140px]">
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search title, seller, phone, category..."
                            className="h-11 w-full bg-transparent text-sm outline-none"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="h-11 rounded-2xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Published">Published</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Expired">Expired</option>
                    </select>

                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                        className="h-11 rounded-2xl border border-slate-200 px-3 text-sm outline-none"
                    />

                    <button
                        onClick={handleSearch}
                        className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
                    >
                        Search
                    </button>
                </div>

                {loading ? (
                    <AdminSectionLoader label="Loading products..." />
                ) : items.length === 0 ? (
                    <AdminEmpty label="No products found." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr>
                                    {[
                                        "Product",
                                        "Category",
                                        "Seller",
                                        "Status",
                                        "Price",
                                        "Location",
                                        "Created",
                                        "Actions",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((item) => {
                                    const img =
                                        item?.data?.coverThumbUrl ||
                                        item?.data?.imageUrls?.[0] ||
                                        item?.data?.images?.[0] ||
                                        "";

                                    return (
                                        <tr key={item._id}>
                                            <td className="rounded-l-2xl bg-slate-50 px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 overflow-hidden rounded-2xl bg-white">
                                                        {img ? (
                                                            <img
                                                                src={img}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : null}
                                                    </div>

                                                    <div>
                                                        <p className="max-w-[260px] truncate text-sm font-semibold text-slate-950">
                                                            {item?.data?.title || "Untitled"}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            ID: {item._id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm">
                                                {item?.data?.category || "-"}
                                                <p className="text-xs text-slate-500">
                                                    {item?.data?.subcategory || "-"}
                                                </p>
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm">
                                                {item?.organizer?.businessname ||
                                                    `${item?.organizer?.firstName || ""} ${item?.organizer?.lastName || ""
                                                    }`}
                                                <p className="text-xs text-slate-500">
                                                    {item?.organizer?.email || item?.organizer?.phone}
                                                </p>
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4">
                                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                    {item?.adstatus || "-"}
                                                </span>
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm font-semibold">
                                                {formatCurrency(Number(item?.data?.price || 0))}
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm">
                                                {item?.data?.region || "-"}
                                                <p className="text-xs text-slate-500">
                                                    {item?.data?.area || item?.data?.town || ""}
                                                </p>
                                            </td>

                                            <td className="bg-slate-50 px-4 py-4 text-sm">
                                                {item?.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td className="rounded-r-2xl bg-slate-50 px-4 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewItem(item)}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-orange-500"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Preview
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-5 flex items-center justify-between">
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                        className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        {[20, 50, 100, 200].map((x) => (
                            <option key={x} value={x}>
                                {x} per page
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-slate-500">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </AdminCard>
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl">
                        <div className="mb-4 flex items-start justify-between border-b border-slate-200 pb-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                                    Product Preview
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                                    {previewItem?.data?.title || "Untitled Product"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setPreviewItem(null)}
                                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                            <div>
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                    {previewItem?.data?.imageUrls?.[0] ? (
                                        <img
                                            src={previewItem.data.imageUrls[0]}
                                            alt={previewItem?.data?.title || ""}
                                            className="h-72 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {(previewItem?.data?.imageUrls || []).slice(0, 6).map((url: string) => (
                                        <img
                                            key={url}
                                            src={url}
                                            alt=""
                                            className="h-20 w-full rounded-xl border border-slate-200 object-cover"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <InfoRow label="Status" value={previewItem?.adstatus || "-"} />
                                <InfoRow label="Category" value={previewItem?.data?.category || "-"} />
                                <InfoRow label="Subcategory" value={previewItem?.data?.subcategory || "-"} />
                                <InfoRow label="Price" value={`KES ${Number(previewItem?.data?.price || 0).toLocaleString()}`} />
                                <InfoRow label="Location" value={`${previewItem?.data?.region || "-"} ${previewItem?.data?.area || ""}`} />
                                <InfoRow label="Seller" value={previewItem?.organizer?.businessname || `${previewItem?.organizer?.firstName || ""} ${previewItem?.organizer?.lastName || ""}`} />
                                <InfoRow label="Phone" value={previewItem?.data?.phone || previewItem?.organizer?.phone || "-"} />

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm font-semibold text-slate-950">Description</p>
                                    <div
                                        className="mt-2 text-sm leading-6 text-slate-600"
                                        dangerouslySetInnerHTML={{
                                            __html: previewItem?.data?.description || "No description",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}