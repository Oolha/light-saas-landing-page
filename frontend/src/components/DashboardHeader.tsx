"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/assets/logo-saas.png";

interface DashboardHeaderProps {
  onLogout: () => Promise<void>;
  onRefreshSubscription?: () => Promise<void>;
  isRefreshing?: boolean;
  showRefreshButton?: boolean;
}

export default function DashboardHeader({
  onLogout,
  onRefreshSubscription,
  isRefreshing = false,
  showRefreshButton = false,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={handleHome}
          >
            <Image
              src={Logo}
              alt="Saas Logo"
              width={40}
              height={40}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          </div>
          <div className="flex items-center gap-3">
            {showRefreshButton && onRefreshSubscription && (
              <button
                onClick={onRefreshSubscription}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
              >
                {isRefreshing ? "Updating..." : "Refresh Subscription"}
              </button>
            )}
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
