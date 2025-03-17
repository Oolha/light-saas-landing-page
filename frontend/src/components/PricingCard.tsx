"use client";
import { PricingTier } from "@/types";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface PricingCardProps {
  tier: PricingTier;
  isCurrentPlan?: boolean;
  onClick: (plan: PricingTier) => void;
}

export default function PricingCard({
  tier,
  isCurrentPlan,
  onClick,
}: PricingCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      key={tier._id}
      className={twMerge(
        "card",
        tier.inverse === true && "border-black bg-black text-white",
        isCurrentPlan && "ring-2 ring-indigo-500 relative"
      )}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Current Plan
        </div>
      )}

      <div className="flex justify-between">
        <h3
          className={twMerge(
            "text-lg font-bold text-black/50",
            tier.inverse === true && "text-white/60"
          )}
        >
          {tier.title}
        </h3>
        {tier.popular && (
          <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
            {isClient ? (
              <motion.span
                animate={{
                  backgroundPositionX: "100%",
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
                className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium"
              >
                Popular
              </motion.span>
            ) : (
              <span className="font-medium">Popular</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-[30px]">
        <span className="text-4xl font-bold tracking-tighter leading-none">
          ${tier.monthlyPrice}
        </span>
        <span className="tracking-tight font-bold text-black/50">/month </span>
      </div>

      <button
        onClick={() => onClick(tier)}
        className={twMerge(
          "btn btn-primary w-full mt-[30px]",
          tier.inverse === true &&
            "bg-white text-black hover:bg-white/90 transition-colors duration-200"
        )}
      >
        {tier.buttonText}
      </button>

      <ul className="flex flex-col gap-5 mt-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="text-sm flex items-center gap-4">
            <CheckIcon className="h-6 w-6" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
