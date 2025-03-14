"use client";
import logo from "@/assets/logo-saas.png";
import Image from "next/image";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedIn from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYouTube from "@/assets/social-youtube.svg";
import { Navigation } from "@/components/Navigation";
import { navigationItems } from "@/constants/navigation";

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-black text-[#BCBCBC] text-sm py-10 text-center"
    >
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:absolute before:top-2 before:left-0 before:bottom-0 before:w-full before:h-full before:blur-md before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:-z-10">
          <Image
            src={logo}
            alt="logo image"
            height={40}
            className="relative z-10"
          />
        </div>

        <Navigation
          className="flex-col md:flex-row md:justify-center mt-6"
          direction="horizontal"
          withButton={false}
          itemClassName="text-[#BCBCBC] hover:text-white transition-colors duration-200"
          items={navigationItems}
        />

        <div className="flex justify-center gap-6 mt-6">
          <SocialX />
          <SocialInsta />
          <SocialLinkedIn />
          <SocialPin />
          <SocialYouTube />
        </div>
        <p className="mt-6">&copy; Your Company, Inc. All rights reserved</p>
      </div>
    </footer>
  );
};
