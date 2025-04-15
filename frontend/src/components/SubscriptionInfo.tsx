"use client";

import stripeService from "@/api/stripeServise";
import { User } from "@/types";
import { useState } from "react";

interface SubscriptionInfoProps {
  subscription: User["subscription"] | null;
  onUpgradeClick: () => void;
}
interface SubscriptionInfoProps {
  subscription: User["subscription"] | null;
  onUpgradeClick: () => void;
}

export default function SubscriptionInfo({
  subscription,
  onUpgradeClick,
}: SubscriptionInfoProps) {
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  if (!subscription) return null;

  // Функція для отримання стилізованої дати
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Функція для керування підпискою через Stripe
  const handleManageSubscription = async () => {
    if (isManagingSubscription) return;

    try {
      setIsManagingSubscription(true);
      const { url } = await stripeService.createCustomerPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error("Error creating customer portal:", error);
      setIsManagingSubscription(false);
    }
  };

  // Визначаємо, яку дату показувати (Stripe currentPeriodEnd або звичайну endDate)
  const displayDate = subscription.currentPeriodEnd || subscription.endDate;
  const dateLabel = subscription.plan !== "Free" ? "Renewal Date" : "End Date";

  return (
    <div className="mt-6">
      <div className="bg-indigo-50 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-indigo-900">
              Subscription
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-indigo-700">
              Your current plan and subscription details.
            </p>
          </div>
          <button
            onClick={onUpgradeClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {subscription.plan === "Free" ? "Upgrade Plan" : "Change Plan"}
          </button>
        </div>

        <div className="border-t border-indigo-200">
          <dl>
            <div className="bg-indigo-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-indigo-800">
                Current Plan
              </dt>
              <dd className="mt-1 text-sm font-semibold text-indigo-900 sm:mt-0 sm:col-span-2">
                {subscription.plan}
                {subscription.plan === "Pro" && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-200 text-indigo-800">
                    Popular
                  </span>
                )}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {subscription.isActive ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </dd>
            </div>

            {displayDate && (
              <div className="bg-indigo-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-indigo-800">
                  {dateLabel}
                </dt>
                <dd className="mt-1 text-sm text-indigo-900 sm:mt-0 sm:col-span-2">
                  {formatDate(displayDate)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Показуємо кнопку управління підпискою тільки для платних планів зі Stripe */}
        {subscription.plan !== "Free" && subscription.stripeSubscriptionId && (
          <div className="border-t border-indigo-200 px-4 py-4">
            <button
              onClick={handleManageSubscription}
              disabled={isManagingSubscription}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isManagingSubscription ? "Processing..." : "Manage Subscription"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
