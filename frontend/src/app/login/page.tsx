import LoginContent from "@/components/LoginContent";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginContent />
    </Suspense>
  );
}
