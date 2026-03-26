import SubscriptionClient from "../_components/SubscriptionClient";

export const metadata = {
  title: "Subscriptions | Tadao Market Admin",
  description: "Subscription overview, renewals, expiry, and package usage",
};

export default function AdminSubscriptionPage() {
  return <SubscriptionClient />;
}