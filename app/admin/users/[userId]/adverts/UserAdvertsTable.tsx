"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

function formatCurrency(value: number) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

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

export default function UserAdvertsTable({ data }: { data: any[] }) {
  const [previewItem, setPreviewItem] = useState<any>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <tbody>
            {data.map((ad: any) => {
              const img =
                ad?.data?.coverThumbUrl ||
                ad?.data?.imageUrls?.[0] ||
                ad?.data?.images?.[0] ||
                "";

              return (
                <tr key={ad._id}>
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
                          {ad?.data?.title || "Untitled advert"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          ID: {ad._id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="bg-slate-50 px-4 py-4 text-sm">
                    {ad?.data?.category || "-"}
                    <p className="text-xs text-slate-500">
                      {ad?.data?.subcategory || "-"}
                    </p>
                  </td>

                  <td className="bg-slate-50 px-4 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {ad?.adstatus || "-"}
                    </span>
                  </td>

                  <td className="bg-slate-50 px-4 py-4 text-sm font-semibold">
                    KES {Number(ad?.data?.price || 0).toLocaleString()}
                  </td>

                  <td className="bg-slate-50 px-4 py-4 text-sm">
                    {ad?.data?.region || "-"}
                    <p className="text-xs text-slate-500">
                      {ad?.data?.area || ad?.data?.town || ""}
                    </p>
                  </td>

                  <td className="bg-slate-50 px-4 py-4 text-sm">
                    {ad?.createdAt
                      ? new Date(ad.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="rounded-r-2xl bg-slate-50 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(ad)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-orange-500"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                  Advert Preview
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {previewItem?.data?.title || "Untitled Advert"}
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
                  {(previewItem?.data?.imageUrls || [])
                    .slice(0, 6)
                    .map((url: string) => (
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
                <InfoRow label="Price" value={formatCurrency(previewItem?.data?.price)} />
                <InfoRow
                  label="Location"
                  value={`${previewItem?.data?.region || "-"} ${previewItem?.data?.area || ""}`}
                />
                <InfoRow label="Phone" value={previewItem?.data?.phone || "-"} />

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    Description
                  </p>
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
    </>
  );
}