"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useContext";
import { loadStripe } from "@stripe/stripe-js";
import stripeService from "@/api/stripeServise";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function SubscriptionContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const canceled = searchParams.get("canceled") === "true";

  const { user } = useAuth();
  const router = useRouter();

  const intentionalRedirect = useRef(false);

  useEffect(() => {
    if (intentionalRedirect.current) return;

    // Перевірка авторизації
    if (!user) {
      const isLoggingOut = sessionStorage.getItem("loggingOut") === "true";
      router.push(isLoggingOut ? "/" : "/login");
      return;
    }

    // Для Free плану просто перенаправляємо на дашборд
    if (plan === "Free") {
      intentionalRedirect.current = true;
      router.push("/dashboard");
      return;
    }

    // Перевіряємо, чи користувач вже на цьому плані
    const isCurrentPlan = user?.subscription?.plan === plan;
    if (isCurrentPlan) {
      // Пропонуємо перейти на портал клієнта для управління підпискою
      return;
    }

    // Якщо це платний план, але не поточний план, ініціюємо Stripe Checkout
    if (plan && plan !== "Free") {
      handleStripeCheckout();
    }
  }, [user, plan, router]);

  // Функція для створення Stripe Checkout сесії
  const handleStripeCheckout = async () => {
    try {
      if (!plan || plan === "Free" || isLoading) return;

      setIsLoading(true);
      setError(null);

      // Отримуємо екземпляр Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Не вдалося завантажити Stripe");
      }

      // Створюємо checkout сесію
      const { sessionId } = await stripeService.createCheckoutSession(plan);

      // Перенаправляємо на Stripe Checkout
      intentionalRedirect.current = true;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error("Error redirecting to Stripe:", err);
      setError(err.message || "An error occurred while processing the payment");
      setIsLoading(false);
    }
  };

  // Функція для переходу на портал клієнта
  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { url } = await stripeService.createCustomerPortalSession();
      intentionalRedirect.current = true;
      window.location.href = url;
    } catch (err: any) {
      console.error("Error creating customer portal:", err);
      setError(err.message || "Unable to open subscription management portal");
      setIsLoading(false);
    }
  };

  if (!plan || !user) return null;

  // Якщо платіж був скасований
  if (canceled) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Payment Canceled
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your payment process was canceled. You can try again or continue
            with your current plan.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => router.push(`/subscription?plan=${plan}`)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Якщо користувач вже підписаний на цей план
  if (user.subscription?.plan === plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            You're Already Subscribed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You're already subscribed to the {plan} plan.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Manage Subscription"}
              </button>

              <Link
                href="/dashboard"
                className="text-center text-sm text-gray-600 hover:text-indigo-500"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Основна сторінка для підключення до плану
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Subscribe to {plan} Plan
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You will be redirected to Stripe to complete your payment
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center">
              {isLoading ? (
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <button
                  onClick={handleStripeCheckout}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Proceed to Payment
                </button>
              )}
            </div>

            <div className="mt-2 text-center">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-indigo-500"
              >
                Cancel and return to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
