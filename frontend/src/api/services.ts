import {
  PricingTier,
  Subscription,
  SubscriptionResponse,
  Testimonial,
} from "@/types";
import { api, fetchData } from "@/api/client";

export const pricingService = {
  getAll: async (): Promise<PricingTier[]> => {
    const { data } = await api.get<PricingTier[]>("/pricing-tiers");
    return data.sort((a, b) => a.order - b.order);
  },

  getAllForSSG: async (): Promise<PricingTier[]> => {
    try {
      const data = await fetchData<PricingTier[]>("/pricing-tiers");
      return data.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error("Error fetching pricing data:", error);
      return [];
    }
  },
};

export const testimonialService = {
  getAll: async (): Promise<Testimonial[]> => {
    const { data } = await api.get<Testimonial[]>("/testimonials");
    return data;
  },

  getAllForSSG: async (): Promise<Testimonial[]> => {
    try {
      return await fetchData<Testimonial[]>("/testimonials");
    } catch (error) {
      console.error("Error fetching testimonials data:", error);
      return [];
    }
  },
};

export const subscriptionService = {
  getStatus: async (): Promise<Subscription> => {
    const { data } = await api.get<SubscriptionResponse>(
      "/subscription/status"
    );
    return data.data.subscription;
  },

  updatePlan: async (
    plan: "Free" | "Pro" | "Business"
  ): Promise<Subscription> => {
    const { data } = await api.post<SubscriptionResponse>(
      "/subscription/update",
      { plan }
    );
    return data.data.subscription;
  },
};
