"use client";

import HomeDashboard from "@/components/shared/HomeDashboard";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
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
import { getAllContacts, getAllUsers, getToAdvertiser, getUserAgragate, getUserByClerkId } from "@/lib/actions/user.actions";
import { getVerifyfee } from "@/lib/actions/verifies.actions";
import { SearchParamProps } from "@/types";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

const Home = ({ searchParams }: SearchParamProps) => {

  const transactionId = (searchParams?.transactionId as string) || "";
  const end = (searchParams?.end as string) || "";
  const start = (searchParams?.start as string) || "";
  const category = (searchParams?.category as string) || "";
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 50;

  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true); // Loading for all data
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  // Global dashboard data
  const [users, setUsers] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);
  const [reported, setReported] = useState<any>([]);
  const [fee, setFee] = useState<number>(0);
  const [transactions, setTransactions] = useState<any>([]);
  const [payments, setPayments] = useState<any>([]);
  const [adSum, setAdSum] = useState<any>(0);
  const [transactionSum, setTransactionSum] = useState<any>(0);
  const [categories, setCategories] = useState<any>([]);
  const [subcategories, setSubcategories] = useState<any>([]);
  const [catList, setCatList] = useState<any>([]);
  const [subscriptionsExpirely, setSubscriptionsExpirely] = useState<any[]>([]);
  const [topadvertiser, setTopadvertiser] = useState<any>([]);
  const [financeRequests, setFinanceRequests] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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
          financeRequests
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
          getallLaons(limit, page)
        ]);

        // set state
        setUsers(users);
        setContacts(contacts);
        setReported(reported);
        setFee(fee);
        setTransactions(transactions);
        setPayments(payments);
        setAdSum(adSum);
        setTransactionSum(transactionSum);
        setCategories(categories);
        setSubcategories(subcategories);
        setCatList(catList);
        setSubscriptionsExpirely(subscriptionsExpirely);
        setTopadvertiser(topadvertiser);
        setFinanceRequests(financeRequests);
        // 2️⃣ User data
        if (user) {
          const fetchedUser: any = await getUserByClerkId(user.uid);
          setUserId(fetchedUser._id);
          setUserName(fetchedUser.firstName + " " + fetchedUser.lastName);
          setUserImage(fetchedUser.photo || "");
        }
      } catch (err) {
        console.error("Data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  if (authLoading || loading) {
    // Wait for both Firebase auth & all data fetch
    return (
      <div>Loading...</div>
    );
  }

  // console.log(topadvertiser);
  return (

    <HomeDashboard
      userId={userId}
      userName={userName}
      userImage={userImage}
      users={users}
      limit={limit}
      page={page}
      transactions={transactions}
      adSum={adSum}
      transactionSum={transactionSum}
      categories={categories}
      subcategories={subcategories}
      catList={catList}
      reported={reported}
      payments={payments}
      vfee={fee}
      contacts={contacts}
      subscriptionsExpirely={subscriptionsExpirely}
      topadvertiser={topadvertiser}
      financeRequests={financeRequests}
    />

  );
};

export default Home;
