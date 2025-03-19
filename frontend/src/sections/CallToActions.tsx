"use client";
import springImage from "@/assets/spring.png";
import starImage from "@/assets/star.png";
import ArrowRight from "@/assets/arrow-right.svg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const CallToActions = () => {
  const router = useRouter();

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const handleUserRegister = () => {
    router.push("/register");
  };
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      id="updates"
      ref={ref}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Sign up for free today</h2>
          <p className="section-description mt-5">
            Celebrate the joy of accomplishment with an app designed to track
            your progress and motivate your efforts.
          </p>
          <motion.img
            src={starImage.src}
            alt="star image"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={springImage.src}
            alt="spring image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{
              translateY,
            }}
          />
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-primary" onClick={handleUserRegister}>
            Get for free
          </button>
          <Link href="/#pricing" className="btn btn-text gap-1">
            <span>Learn more</span>
            <ArrowRight className="w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
