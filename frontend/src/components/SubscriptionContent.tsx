"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useContext";
import { subscriptionService } from "@/api/services";
import Link from "next/link";
import InputField from "@/components/InputField";
import { getErrorMessage } from "@/utils/errorHandling";

export default function SubscriptionContent() {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const { user, refreshUserData } = useAuth();
  const router = useRouter();

  const intentionalRedirect = useRef(false);

  useEffect(() => {
    if (intentionalRedirect.current) return;

    if (!user) {
      const isLoggingOut = sessionStorage.getItem("loggingOut") === "true";
      router.push(isLoggingOut ? "/" : "/login");
      return;
    }

    if (selectedPlan === "Free") {
      intentionalRedirect.current = true;
      router.push("/dashboard");
    }
  }, [user, selectedPlan, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isProcessing || isRedirecting) return;

    setIsProcessing(true);
    setError(null);

    try {
      await subscriptionService.updatePlan(selectedPlan as "Pro" | "Business");
      sessionStorage.setItem("plan_updated", "true");

      setIsRedirecting(true);
      intentionalRedirect.current = true;
      refreshUserData();

      setTimeout(() => {
        router.push("/dashboard?subscribed=true");
      }, 500);
    } catch (err: unknown) {
      console.error("Subscription error:", err);
      setError(getErrorMessage(err, "Subscription processing failed"));
      setIsRedirecting(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Complete Your Subscription
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You&apos;re subscribing to the {selectedPlan} plan
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
            <InputField
              label="Card Number"
              name="cardNumber"
              type="text"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Expiry Date"
                name="expiryDate"
                type="text"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
              <InputField
                label="CVV"
                name="cvv"
                type="text"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || isRedirecting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isProcessing
                ? "Processing..."
                : isRedirecting
                  ? "Redirecting..."
                  : "Complete Subscription"}
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
