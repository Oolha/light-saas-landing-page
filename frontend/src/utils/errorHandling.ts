import { ApiError } from "@/types/index";

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
): string {
  const apiError = error as ApiError;

  return (
    apiError.response?.data?.message || apiError.message || fallbackMessage
  );
}
