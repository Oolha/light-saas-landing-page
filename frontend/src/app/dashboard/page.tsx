"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useContext";
import Image from "next/image";
import Logo from "@/assets/logo-saas.png";
import PricingModal from "@/components/PricingModal";
import SubscriptionInfo from "@/components/SubscriptionInfo";
import UserProfile from "@/components/UserProfile";
import FeaturesList from "@/components/FeaturesList";

export default function DashboardPage() {
  const { user, isLoading, logout, refreshUserData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSubscribed = searchParams.get("subscribed") === "true";
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    const planUpdated = sessionStorage.getItem("plan_updated") === "true";

    if ((justSubscribed || planUpdated) && user) {
      sessionStorage.removeItem("plan_updated");
      refreshUserData();

      setShowSubscriptionAlert(true);
      const timer = setTimeout(() => {
        setShowSubscriptionAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router, justSubscribed, refreshUserData]);

  const handleLogout = async () => {
    await logout();
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
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
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Subscription Alert */}
      {showSubscriptionAlert && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">
            Your subscription has been updated.
          </span>
          <button
            onClick={() => setShowSubscriptionAlert(false)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Close</span>
            <svg
              className="fill-current h-6 w-6 text-green-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}

      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome to your private dashboard, {user.name}!
            </p>
          </div>

          <SubscriptionInfo
            subscription={user.subscription}
            onUpgradeClick={() => setIsModalOpen(true)}
          />

          <UserProfile user={user} />

          <FeaturesList
            plan={user.subscription?.plan}
            onUpgradeClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <PricingModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
