"use client";
import { Testimonial } from "@/types/index";
import { motion } from "framer-motion";
import { TestimonialCard } from "@/components/TestimonialCard";
import { useEffect, useState } from "react";

export default function Testimonials({ reviews }: { reviews: Testimonial[] }) {
  const [isClient, setIsClient] = useState(false);
    const [shuffledReviews, setShuffledReviews] = useState<Testimonial[]>([]);

  const duplicatedReviews = [...reviews, ...reviews];

  useEffect(() => {
    setIsClient(true);

    const shuffled = [...duplicatedReviews].sort(() => Math.random() - 0.5);
    setShuffledReviews(shuffled);
  }, []);

  const AnimatedTestimonialsColumn = ({
    reviews,
    duration,
  }: {
    reviews: Testimonial[];
    duration?: number;
  }) => (
    <div className="h-[500px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] [webkit-mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
      {isClient ? (
        <motion.div
          className="flex flex-col gap-6"
          animate={{ translateY: "-50%" }}
          transition={{
            duration: duration || 15,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {reviews.map((item, index) => (
            <div key={`${item._id}-${index}`} className="flex-none">
              <TestimonialCard item={item} />
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((item, index) => (
            <div key={`${item._id}-${index}`} className="flex-none">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section id="customers" className="bg-white py-16">
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
          {reviews.length > 0 && (
            <>
              <AnimatedTestimonialsColumn
                reviews={duplicatedReviews}
                duration={25}
              />

              <div className="hidden md:block">
                <AnimatedTestimonialsColumn
                  reviews={[...duplicatedReviews].reverse()}
                  duration={17}
                />
              </div>

              <div className="hidden lg:block">
                <AnimatedTestimonialsColumn
                  duration={21}
                  reviews={isClient ? shuffledReviews : duplicatedReviews}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
