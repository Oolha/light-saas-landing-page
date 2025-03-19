import RegisterContent from "@/components/RegisterContent";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterContent />
    </Suspense>
  );
}
