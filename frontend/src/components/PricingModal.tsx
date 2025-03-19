"use client";
import {
  Dialog,
  DialogPanel,
  Transition,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { PricingTier } from "@/types";
import { pricingService, subscriptionService } from "@/services/api";
import PricingCard from "./PricingCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useContext";
import { Loader } from "./Loader";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { user, refreshUserData } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const fetchPricingTiers = async () => {
        setIsLoading(true);
        try {
          const data = await pricingService.getAll();
          setPricingTiers(data);
        } catch (err) {
          console.error("Error fetching pricing tiers:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPricingTiers();
    }
  }, [isOpen]);

  const handlePlanSelection = async (plan: PricingTier) => {
    if (user?.subscription?.plan === plan.title) {
      onClose();
      return;
    }

    try {
      setIsUpdating(true);

      if (plan.title === "Free") {
        await subscriptionService.updatePlan(
          plan.title as "Free" | "Pro" | "Business"
        );
        const success = await refreshUserData();

        if (success) {
          onClose();
          router.push("/dashboard?subscribed=true");
        } else {
          onClose();
        }
      } else {
        onClose();
        router.push(`/subscription?plan=${plan.title}`);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="section-title">
                  Choose Your Plan
                </DialogTitle>
                <p className="section-description mt-2 mb-6">
                  Get more features by upgrading your plan.
                </p>

                {isLoading ? (
                  <Loader />
                ) : (
                  <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-center gap-6">
                    {pricingTiers.map((item) => (
                      <div key={item._id} className="w-full max-w-xs lg:w-auto">
                        <PricingCard
                          tier={item}
                          onClick={handlePlanSelection}
                          isCurrentPlan={
                            user?.subscription?.plan === item.title
                          }
                          isDisabled={isUpdating}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={onClose}
                    className="btn btn-text"
                    disabled={isLoading || isUpdating}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
