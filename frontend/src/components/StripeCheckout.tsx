"use client";

import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import stripeService from "@/api/stripeServise";
import { useRouter } from "next/navigation";
import { Loader } from "./Loader";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutProps {
  planTitle: string;
}

export default function StripeCheckout({ planTitle }: StripeCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create a checkout session and redirect to Stripe Checkout
    const redirectToCheckout = async () => {
      try {
        setLoading(true);

        // Get an instance of Stripe
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Failed to load Stripe");
        }

        // Create a checkout session
        const { sessionId } =
          await stripeService.createCheckoutSession(planTitle);

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } catch (err: any) {
        console.error("Error redirecting to Stripe:", err);
        setError(
          err.message || "An error occurred while processing the payment."
        );
      } finally {
        setLoading(false);
      }
    };

    redirectToCheckout();
  }, [planTitle]);

  // If an error occurs, display a message with the option to return
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Payment error
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/dashboard")}
        >
          Return
        </button>
      </div>
    );
  }
  // Show the loader while we wait
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
      <Loader />
      <p className="text-gray-600">Redirecting to the payment page...</p>
    </div>
  );
}
