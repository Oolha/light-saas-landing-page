import { api } from "@/api/client";

interface CheckoutSessionResponse {
  sessionId: string;
}

interface CustomerPortalResponse {
  url: string;
}

class StripeService {
  async createCheckoutSession(
    planTitle: string
  ): Promise<CheckoutSessionResponse> {
    const response = await api.post("/stripe/create-checkout-session", {
      planTitle,
    });
    return response.data;
  }

  async createCustomerPortalSession(): Promise<CustomerPortalResponse> {
    const response = await api.post("/stripe/create-customer-portal-session");
    return response.data;
  }
}

const stripeService = new StripeService();
export default stripeService;
