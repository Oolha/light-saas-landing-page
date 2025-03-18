import axios, { AxiosResponse } from "axios";
import {
  PricingTier,
  Subscription,
  Testimonial,
  UploadResponse,
  User,
} from "@/types";

const API_URL = "https://saas-website-tlj3.onrender.com/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for automatic token refresh on authorization errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/refresh") &&
      !error.config._retry
    ) {
      error.config._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const newToken = response.data.data.accessToken;

        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          error.config.headers["Authorization"] = `Bearer ${newToken}`;

          return api(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const pricingService = {
  getAll: async (): Promise<PricingTier[]> => {
    const response: AxiosResponse<PricingTier[]> =
      await api.get("/pricing-tiers");
    return response.data.sort((a, b) => a.order - b.order);
  },

  //SSG (getStaticProps)
  getAllForSSG: async (): Promise<PricingTier[]> => {
    try {
      const response = await fetch(`${API_URL}/pricing-tiers`);

      if (!response.ok) {
        throw new Error("Failed to fetch pricing data");
      }

      const data = await response.json();
      return data.sort((a: PricingTier, b: PricingTier) => a.order - b.order);
    } catch (error) {
      console.error("Error fetching pricing data:", error);
      return [];
    }
  },
};

export const testimonialService = {
  getAll: async (): Promise<Testimonial[]> => {
    const response: AxiosResponse<Testimonial[]> =
      await api.get("/testimonials");
    return response.data;
  },
  //SSG (getStaticProps)
  getAllForSSG: async (): Promise<Testimonial[]> => {
    try {
      const response = await fetch(`${API_URL}/testimonials`);

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching testimonials data:", error);
      return [];
    }
  },
};

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response: AxiosResponse<UploadResponse> = await axios.post(
      `${API_URL}/uploads/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export const subscriptionService = {
  getStatus: async (): Promise<Subscription> => {
    const response: AxiosResponse<{
      status: number;
      message: string;
      data: { subscription: Subscription };
    }> = await api.get("/subscription/status");
    return response.data.data.subscription;
  },

  updatePlan: async (
    plan: "Free" | "Pro" | "Business"
  ): Promise<Subscription> => {
    const response: AxiosResponse<{
      status: number;
      message: string;
      data: { subscription: Subscription };
    }> = await api.post("/subscription/update", { plan });
    return response.data.data.subscription;
  },
};
