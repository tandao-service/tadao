// app/home/page.tsx

import HomeClient from "@/components/shared/HomeClient";
import {
  getAllCategories,
  getselectedCategories,
} from "@/lib/actions/category.actions";
import { getTotalProducts } from "@/lib/actions/dynamicAd.actions";
import { getallLaons } from "@/lib/actions/loan.actions";
import { getallPayments } from "@/lib/actions/payment.actions";
import { getallReported } from "@/lib/actions/report.actions";
import {
  getallcategories,
  getselectedsubcategories,
} from "@/lib/actions/subcategory.actions";
import {
  checkExpiredLatestSubscriptionsPerUser,
  getallTransactions,
  getStatusTrans,
} from "@/lib/actions/transactions.actions";
import {
  getAllContacts,
  getUserAgragate,
  getToAdvertiser,
} from "@/lib/actions/user.actions";
import { getVerifyfee } from "@/lib/actions/verifies.actions";
import { SearchParamProps } from "@/types";

export default async function Home({ searchParams }: SearchParamProps) {
  const transactionId = (searchParams?.transactionId as string) || "";
  const end = (searchParams?.end as string) || "";
  const start = (searchParams?.start as string) || "";
  const category = (searchParams?.category as string) || "";
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 50;

  // ✅ Fetch server-side data
  const [
    users,
    contacts,
    reported,
    fee,
    transactions,
    payments,
    adSum,
    transactionSum,
    categories,
    subcategories,
    catList,
    subscriptionsExpirely,
    topadvertiser,
    financeRequests,
  ] = await Promise.all([
    getUserAgragate(limit, page),
    getAllContacts(),
    getallReported(limit, page),
    getVerifyfee(),
    getallTransactions(transactionId, start, end, limit, page),
    getallPayments(transactionId, start, end, limit, page),
    getTotalProducts(),
    getStatusTrans(),
    getAllCategories(),
    getselectedsubcategories(category),
    getselectedCategories(),
    checkExpiredLatestSubscriptionsPerUser(),
    getToAdvertiser(),
    getallLaons(limit, page),
  ]);

  return (
    <HomeClient
      users={users}
      contacts={contacts}
      reported={reported}
      fee={fee}
      transactions={transactions}
      payments={payments}
      adSum={adSum}
      transactionSum={transactionSum}
      categories={categories}
      subcategories={subcategories}
      catList={catList}
      subscriptionsExpirely={subscriptionsExpirely}
      topadvertiser={topadvertiser}
      financeRequests={financeRequests}
      page={page}
      limit={limit}
    />
  );
}
