"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import AddPackageWindow from "./AddPackageWindow";
import { DeleteThisPackage } from "./DeletePackage";

type Props = {
    packagesList: any[];
    onSaved: () => void;
};

export default function PackagesTable({ packagesList, onSaved }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPack, setSelectedPack] = useState<any>(null);

    function openEdit(pack: any) {
        setSelectedPack(pack);
        setEditOpen(true);
    }

    function closeEdit() {
        setEditOpen(false);
        setSelectedPack(null);
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr>
                            <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Package
                            </th>
                            <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Listings
                            </th>
                            <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Priority
                            </th>
                            <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Top Days
                            </th>
                            <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Featured
                            </th>
                            <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Auto Renew
                            </th>
                            {/** <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Prices
                            </th> */}
                            <th className="px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {packagesList.map((pack) => {
                            const ent = pack?.entitlements || {};

                            const listings =
                                Number(ent?.maxListings) > 0
                                    ? Number(ent.maxListings)
                                    : Number(pack?.list || 0);

                            const priority =
                                Number(ent?.priority) > 0
                                    ? Number(ent.priority)
                                    : Number(pack?.priority || 0);

                            return (
                                <tr key={String(pack._id)}>
                                    <td className="rounded-l-2xl bg-slate-50 px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-xl"
                                                style={{ backgroundColor: pack?.color || "#f97316" }}
                                            />

                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {pack?.name || "Unnamed package"}
                                                </p>
                                                <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500">
                                                    {pack?.description || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                        {listings}
                                    </td>

                                    <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                        {priority}
                                    </td>

                                    <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                        {Number(ent?.topDays || 0)}
                                    </td>

                                    <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                        {Number(ent?.featuredDays || 0)}
                                    </td>

                                    <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                        {ent?.autoRenewHours ? `${ent.autoRenewHours} hrs` : "-"}
                                    </td>

                                    {/**   <td className="bg-slate-50 px-4 py-4 text-sm text-slate-700">
                                        {(pack?.price || []).length > 0
                                            ? (pack.price || [])
                                                .map(
                                                    (p: any) =>
                                                        `${p.period}: KES ${Number(
                                                            p.amount || 0
                                                        ).toLocaleString()}`
                                                )
                                                .join(" | ")
                                            : "-"}
                                    </td>*/}

                                    <td className="rounded-r-2xl bg-slate-50 px-4 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(pack)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-orange-500"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </button>

                                            <DeleteThisPackage
                                                packageId={pack._id}
                                                packageIcon={pack.imageUrl}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {packagesList.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                        No packages found.
                    </div>
                )}
            </div>

            <AddPackageWindow
                type="Update"
                isOpen={editOpen}
                onClose={closeEdit}
                packageId={selectedPack?._id}
                pack={selectedPack}
                onSaved={() => {
                    closeEdit();
                    onSaved();
                }}
            />
        </>
    );
}