import { CallToActions } from "@/sections/CallToActions";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import Pricing from "@/sections/Pricing";
import { ProductShowcase } from "@/sections/ProductShowcase";
import Testimonails from "@/sections/Testimonails";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Pricing />
      <Testimonails />
      <CallToActions />
      <Footer />
    </>
  );
}
