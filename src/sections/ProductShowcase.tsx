import Image from "next/image";
import ProductImage from "@/assets/product-image.png";
import PyramidImage from "@/assets/pyramid.png";
import TorusImage from "@/assets/torus.png";

export const ProductShowcase = ({}) => {
  return (
    <section className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24 overflow-x-clip">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Boost your productivity</div>
          </div>
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            A more effective way to track progress
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5 ">
            Effortlessly turn your ideas into a fully functional, responsive,
            no-code SaaS website in just minutes with the set of free components
            for Framer.
          </p>
        </div>
        <div className="relative">
          <Image src={ProductImage} alt="Product image" className="mt-10" />
          <Image
            src={PyramidImage}
            alt="Pyramid image"
            className="hidden md:block absolute -right-26 -top-34"
            height={262}
            width={262}
          />
          <Image
            src={TorusImage}
            alt="Torus image"
            className="hidden md:block absolute bottom-24 -left-30"
            height={248}
            width={248}
          />
        </div>
      </div>
    </section>
  );
};
