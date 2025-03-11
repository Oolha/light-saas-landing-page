"use client";
import { testimonialService } from "@/services/api";
import { Testimonial } from "@/types/index";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const TestimonialCard = ({ item }: { item: Testimonial }) => (
  <div className="card h-full">
    <div className="flex flex-col justify-between h-full">
      <div className="mb-4">{item.text}</div>
      <div className="flex items-center gap-2 mt-auto">
        <Image
          src={item.imageSrc}
          alt={item.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex flex-col">
          <div className="font-medium tracking-tight leading-5">
            {item.name}
          </div>
          <div className="leading-5 tracking-tight">{item.username}</div>
        </div>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await testimonialService.getAll();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const firstColumn = reviews.slice(0, 3);
  const secondColumn = reviews.slice(3, 6);
  const thirdColumn = reviews.slice(6, 9);

  const TestimonialsColumn = ({
    reviews,
    className = "",
  }: {
    reviews: Testimonial[];
    className?: string;
  }) => (
    <div
      className={`flex flex-col gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] ${className}`}
    >
      {reviews.map((item) => (
        <div key={item._id}>
          <TestimonialCard item={item} />
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>
          <h2 className="section-title mt-5">What our users say</h2>
          <p className="section-description mt-5 max-w-2xl mx-auto text-center">
            From intuitive design to powerful features, our app has become an
            essential tool for users around the world.
          </p>
        </div>
        <div className="flex flex-col items-center md:flex-row justify-center gap-6 mt-10">
          <TestimonialsColumn reviews={firstColumn} />

          <TestimonialsColumn
            reviews={secondColumn}
            className="hidden md:flex"
          />

          <TestimonialsColumn
            reviews={thirdColumn}
            className="hidden lg:flex"
          />
        </div>
      </div>
    </section>
  );
}
