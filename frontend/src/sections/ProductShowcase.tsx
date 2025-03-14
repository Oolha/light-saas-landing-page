"use client";
import Image from "next/image";
import ProductImage from "@/assets/product-image.png";
import PyramidImage from "@/assets/pyramid.png";
import TorusImage from "@/assets/torus.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = ({}) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Boost your productivity</div>
          </div>
          <h2 className="section-title mt-5">
            A more effective way to track progress
          </h2>
          <p className="section-description mt-5 ">
            Effortlessly turn your ideas into a fully functional, responsive,
            no-code SaaS website in just minutes with the set of free components
            for Framer.
          </p>
        </div>
        <div className="relative">
          <Image src={ProductImage} alt="Product image" className="mt-10" />
          <motion.img
            src={PyramidImage.src}
            alt="Pyramid image"
            className="hidden md:block absolute -right-26 -top-34"
            style={{
              translateY,
            }}
            height={262}
            width={262}
          />
          <motion.img
            src={TorusImage.src}
            alt="Torus image"
            className="hidden md:block absolute bottom-24 -left-30"
            style={{
              translateY,
            }}
            height={248}
            width={248}
          />
        </div>
      </div>
    </section>
  );
};
