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
import { usePlanSelection } from "@/hooks/usePlanSelection";
import { pricingService } from "@/services/api";
import PricingCard from "./PricingCard";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handlePlanSelection, currentPlan } = usePlanSelection();

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

  const handleModalPlanSelection = (plan: PricingTier) => {
    onClose();
    handlePlanSelection(plan);
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
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 place-items-center">
                    {pricingTiers.map((item) => (
                      <div key={item._id} className="w-full max-w-xs lg:w-auto">
                        <PricingCard
                          tier={item}
                          onClick={handleModalPlanSelection}
                          isCurrentPlan={currentPlan === item.title}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={onClose}
                    className="btn btn-text"
                    disabled={isLoading}
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
