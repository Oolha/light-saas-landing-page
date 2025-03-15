"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { subscriptionService } from "@/services/api";
import Link from "next/link";

export default function SubscriptionPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const { user } = useAuth();
  const router = useRouter();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const intentionalRedirect = useRef(false);

  useEffect(() => {
    if (intentionalRedirect.current) {
      return;
    }

    const isLoggingOut = sessionStorage.getItem("loggingOut") === "true";

    if (!user && !isLoggingOut) {
      router.push("/login");
    }

    if (selectedPlan === "Free") {
      intentionalRedirect.current = true;
      router.push("/dashboard");
    }
  }, [user, selectedPlan, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await subscriptionService.updatePlan(selectedPlan as "Pro" | "Business");
      router.push("/dashboard?subscribed=true");
    } catch (err: any) {
      setError(err.message || "Failed to process subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Complete Your Subscription
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You're subscribing to the {selectedPlan} plan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="MM/YY"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Complete Subscription"}
            </button>

            <div className="mt-2 text-center">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-indigo-500"
              >
                Cancel and return to dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
