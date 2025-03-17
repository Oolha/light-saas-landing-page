"use client";
import {
  Dialog,
  DialogPanel,
  Transition,
  DialogTitle,
} from "@headlessui/react";
import { Fragment } from "react";
import { PricingTier } from "@/types";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingTiers: PricingTier[];
}

export default function PricingModal({
  isOpen,
  onClose,
  pricingTiers,
}: PricingModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-4xl bg-white rounded-2xl p-8 shadow-xl">
            <DialogTitle className="text-2xl font-bold text-center">
              Choose Your Plan
            </DialogTitle>
            <p className="text-gray-600 text-center mt-2">
              Get more features by upgrading your plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {pricingTiers.map((tier) => (
                <div
                  key={tier._id}
                  className={twMerge(
                    "p-6 rounded-xl border shadow-sm",
                    tier.inverse
                      ? "bg-black text-white border-black"
                      : "bg-white border-gray-200"
                  )}
                >
                  <h3 className="text-lg font-semibold">{tier.title}</h3>
                  <p className="text-2xl font-bold mt-2">
                    ${tier.monthlyPrice}/month
                  </p>
                  <ul className="mt-4 space-y-2">
                    {tier.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                    {tier.buttonText}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-6 block w-full text-center text-gray-500"
            >
              Close
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
