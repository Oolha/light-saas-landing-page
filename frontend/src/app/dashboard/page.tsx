import DashboardContent from "@/components/DashboardContent";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardContent />
    </Suspense>
  );
}
