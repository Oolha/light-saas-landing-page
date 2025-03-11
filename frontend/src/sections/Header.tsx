"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import Image from "next/image";
import Logo from "@/assets/logo-saas.png";
import MenuIcon from "@/assets/menu.svg";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { navigationItems } from "@/constants/navigation";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navContainer = document.getElementById("mobile-nav-container");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        isMenuOpen &&
        navContainer &&
        !navContainer.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          This page is included in a free SaaS Website Kit.
        </p>
        <div
          className="inline-flex gap-1 items-center cursor-pointer"
          onClick={() => scrollToSection("pricing")}
        >
          <p>Get started for free</p>
          <ArrowRight className="w-4 arrow-right" />
        </div>
      </div>
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Image
              src={Logo}
              alt="Saas Logo"
              width={40}
              height={40}
              className="cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
            <MenuIcon
              className="w-5 h-5 md:hidden cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            <div
              className={`${
                isMenuOpen
                  ? "absolute top-full left-0 right-0 bg-white py-6 px-4 shadow-lg"
                  : "hidden"
              } md:block`}
            >
              <Navigation
                className={isMenuOpen ? "flex-col items-center" : ""}
                direction={isMenuOpen ? "vertical" : "horizontal"}
                itemClassName="text-black/60"
                items={navigationItems}
                onButtonClick={() => {
                  scrollToSection("pricing");
                  setIsMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
