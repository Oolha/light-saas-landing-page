import { useAuth } from "@/hooks/useContext";
import { NavigationProps } from "@/types";
import { useRouter } from "next/navigation";

export const Navigation = ({
  className = "",
  itemClassName = "text-black/60",
  withButton = true,
  direction = "horizontal",
  onLinkClick,
  onButtonClick,
  items = [
    { label: "About", sectionId: "about" },
    { label: "Pricing", sectionId: "pricing" },
    { label: "Customers", sectionId: "customers" },
    { label: "Updates", sectionId: "updates" },
    { label: "Help", sectionId: "footer" },
  ],
}: NavigationProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${sectionId}`);

      if (onLinkClick) {
        onLinkClick();
      }
    }
  };

  const handleButtonClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      scrollToSection("pricing");
    }

    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <nav
      className={`${direction === "vertical" ? "flex-col" : "flex-row"} flex ${direction === "horizontal" ? "items-center" : ""} gap-6 ${className}`}
    >
      {items.map((item) => (
        <a
          key={item.sectionId}
          href={`#${item.sectionId}`}
          className={`${itemClassName} hover:opacity-80 transition-opacity duration-200`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(item.sectionId);
          }}
        >
          {item.label}
        </a>
      ))}
      {withButton && (
        <button
          className="bg-black text-white py-2 px-4 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-black/90 transition-colors duration-200 cursor-pointer"
          onClick={handleButtonClick}
        >
          {user ? "Go to Dashboard" : "Get for Free"}
        </button>
      )}
    </nav>
  );
};
