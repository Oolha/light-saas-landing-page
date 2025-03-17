import { Testimonial } from "@/types";
import Image from "next/image";

export const TestimonialCard = ({ item }: { item: Testimonial }) => (
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
