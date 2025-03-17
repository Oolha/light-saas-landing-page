import { CallToActions } from "@/sections/CallToActions";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import Pricing from "@/sections/Pricing";
import { ProductShowcase } from "@/sections/ProductShowcase";
import Testimonials from "@/sections/Testimonials";
import { pricingService, testimonialService } from "@/services/api";

export default async function Home() {
  const pricingTiers = await pricingService.getAllForSSG();
  const testimonials = await testimonialService.getAllForSSG();
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Pricing pricingTiers={pricingTiers} />
      <Testimonials reviews={testimonials} />
      <CallToActions />
      <Footer />
    </>
  );
}

export const revalidate = 3600;
