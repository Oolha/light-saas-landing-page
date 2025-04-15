"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useContext";
import Image from "next/image";
import Logo from "@/assets/logo-saas.png";
import PricingModal from "@/components/PricingModal";
import SubscriptionInfo from "@/components/SubscriptionInfo";
import UserProfile from "@/components/UserProfile";
import FeaturesList from "@/components/FeaturesList";
import { Loader } from "@/components/Loader";
import SubscriptionAlert from "./SubscriptionAlert";

export default function DashboardContent() {
  const { user, isLoading, logout, refreshUserData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSubscribed = searchParams.get("subscribed") === "true";
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "Your subscription has been updated."
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasRefreshedData = useRef(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const planUpdated = sessionStorage.getItem("plan_updated") === "true";

    if ((justSubscribed || planUpdated) && user) {
      // Якщо це перше завантаження зі статусом "subscribed=true"
      if (!hasRefreshedData.current) {
        console.log("Subscription detected, refreshing user data...");

        // Спочатку запускаємо оновлення користувача з сервера
        refreshUserData()
          .then(() => {
            console.log("User data refreshed successfully");
            hasRefreshedData.current = true;
            sessionStorage.removeItem("plan_updated");

            if (justSubscribed) {
              setAlertMessage(
                "Thank you for your subscription! Your payment was successful."
              );
            } else {
              setAlertMessage("Your subscription has been updated.");
            }

            setShowSubscriptionAlert(true);

            // Після показу алерту та оновлення даних, замінюємо URL без параметрів
            if (justSubscribed) {
              setTimeout(() => router.replace("/dashboard"), 300);
            }
          })
          .catch((err) => {
            console.error("Failed to refresh user data:", err);
          });
      }

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

  if (isLoading && !user) {
    return <Loader />;
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

      <SubscriptionAlert
        message={alertMessage}
        isVisible={showSubscriptionAlert}
        onClose={() => setShowSubscriptionAlert(false)}
      />

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
