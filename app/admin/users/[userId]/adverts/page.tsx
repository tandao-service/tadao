import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";

import { getAdByUser } from "@/lib/actions/dynamicAd.actions";
import { getUserById } from "@/lib/actions/user.actions";

import {
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  formatCurrency,
} from "../../../_components/AdminShared";
import UserAdvertsTable from "./UserAdvertsTable";

export default async function AdminUserAdvertsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<{ page?: string; limit?: string }>;
}) {
  const { userId } = await params;
  const sp = await searchParams;

  const page = Number(sp?.page) || 1;
  const limit = Number(sp?.limit) || 50;

  const user = await getUserById(userId);
  if (!user) notFound();

  const adverts = await getAdByUser({
    userId,
    limit,
    page,
    sortby: "new",
    myshop: true,
  });

  const data = adverts?.data || [];
  const totalPages = adverts?.totalPages || 1;

  const displayName =
    user.businessname ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "User";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="User Adverts"
        title={`${displayName} Adverts`}
        subtitle="View all adverts posted by this user including Active, Pending, and Inactive."
      />

      <AdminCard>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              Total adverts: {data.length}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>

        {data.length === 0 ? (
          <AdminEmpty label="No adverts found for this user." />
        ) : (
          <UserAdvertsTable data={data} />
        )}

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/users/${userId}/adverts?page=${Math.max(
                1,
                page - 1
              )}&limit=${limit}`}
              className={`rounded-xl border border-slate-200 px-4 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-40" : ""
                }`}
            >
              Previous
            </Link>

            <Link
              href={`/admin/users/${userId}/adverts?page=${Math.min(
                totalPages,
                page + 1
              )}&limit=${limit}`}
              className={`rounded-xl border border-slate-200 px-4 py-2 text-sm ${page >= totalPages ? "pointer-events-none opacity-40" : ""
                }`}
            >
              Next
            </Link>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}