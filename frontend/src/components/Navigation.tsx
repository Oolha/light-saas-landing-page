interface NavigationItem {
  label: string;
  sectionId: string;
}

interface NavigationProps {
  className?: string;
  itemClassName?: string;
  withButton?: boolean;
  direction?: "horizontal" | "vertical";
  buttonText?: string;
  onButtonClick?: () => void;
  items?: NavigationItem[];
  onLinkClick?: () => void;
}

export const Navigation = ({
  className = "",
  itemClassName = "text-black/60",
  withButton = true,
  direction = "horizontal",
  buttonText = "Get for free",
  onButtonClick,
  onLinkClick,
  items = [
    { label: "About", sectionId: "about" },
    { label: "Pricing", sectionId: "pricing" },
    { label: "Customers", sectionId: "customers" },
    { label: "Updates", sectionId: "updates" },
    { label: "Help", sectionId: "footer" },
  ],
}: NavigationProps) => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });

      if (onLinkClick) {
        onLinkClick();
      }
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
          className="bg-black text-white py-2 px-4 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-black/90 transition-colors duration-200"
          onClick={() => {
            if (onButtonClick) {
              onButtonClick();
            } else {
              scrollToSection("cta");
              if (onLinkClick) {
                onLinkClick();
              }
            }
          }}
        >
          {buttonText}
        </button>
      )}
    </nav>
  );
};
