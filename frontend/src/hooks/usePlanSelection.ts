"use client";
import { useRouter } from "next/navigation";
import { PricingTier } from "@/types";
import { useAuth } from "./useContext";

export function usePlanSelection() {
  const router = useRouter();
  const { user } = useAuth();

  const handlePlanSelection = (plan: PricingTier) => {
    if (!user) {
      router.push(`/register?next=subscription&plan=${plan.title}`);
    } else {
      if (plan.title === "Free") {
        router.push("/dashboard");
      } else {
        router.push(`/subscription?plan=${plan.title}`);
      }
    }
  };

  return {
    handlePlanSelection,
    currentPlan: user?.subscription?.plan,
  };
}
