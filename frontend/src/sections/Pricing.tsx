"use client";
import { useEffect, useState } from "react";
import { pricingService } from "@/services/api";
import { PricingTier } from "@/types";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPricingTiers = async () => {
      try {
        const data = await pricingService.getAll();
        setPricingTiers(data);
      } catch (err) {
        console.error("Error fetching pricing tiers:", err);
      }
    };
    fetchPricingTiers();
  }, []);

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

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Pricing</h2>
          <p className="section-description mt-5">
            Free forever. Upgrade for unlimited tasks, better security, and
            exclusive features.
          </p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map((item) => (
            <div
              key={item._id}
              className={twMerge(
                "card",
                item.inverse === true && "border-black bg-black text-white"
              )}
            >
              <div className="flex justify-between">
                <h3
                  className={twMerge(
                    "text-lg font-bold text-black/50",
                    item.inverse === true && "text-white/60"
                  )}
                >
                  {item.title}
                </h3>
                {item.popular && (
                  <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
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
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-[30px]">
                <span className="text-4xl font-bold tracking-tighter leading-none">
                  ${item.monthlyPrice}
                </span>
                <span className="tracking-tight font-bold text-black/50">
                  /month{" "}
                </span>
              </div>
              <button
                onClick={() => handlePlanSelection(item)}
                className={twMerge(
                  "btn btn-primary w-full mt-[30px]",
                  item.inverse === true && "bg-white text-black"
                )}
              >
                {item.buttonText}
              </button>
              <ul className="flex flex-col gap-5 mt-8">
                {item.features.map((feature, index) => (
                  <li key={index} className="text-sm flex items-center gap-4">
                    <CheckIcon className="h-6 w-6" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
