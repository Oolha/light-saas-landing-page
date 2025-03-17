import Tariffs from "@/components/Tariffs";
import { PricingTier } from "@/types";

export default function Pricing({
  pricingTiers,
}: {
  pricingTiers: PricingTier[];
}) {
  return (
    <section id="pricing" className="py-24 bg-white">
      <Tariffs pricingTiers={pricingTiers} />
    </section>
  );
}
