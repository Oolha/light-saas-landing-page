import { ApiError } from "@/types/index";

interface StripeError {
  type?: string;
  message?: string;
  code?: string;
  error?: {
    message?: string;
  };
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
): string {
  const apiError = error as ApiError;
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }

  const stripeError = error as StripeError;
  if (stripeError.type && stripeError.type.startsWith("stripe_")) {
    return stripeError.message || "Payment processing error";
  }

  if (stripeError.error?.message) {
    return stripeError.error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return apiError.message || fallbackMessage;
}
