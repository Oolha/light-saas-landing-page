import SubscriptionContent from "@/components/SubscriptionContent";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SubscriptionContent />
    </Suspense>
  );
}
