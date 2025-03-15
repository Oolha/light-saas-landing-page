import axios, { AxiosResponse } from "axios";
import {
  PricingTier,
  Subscription,
  Testimonial,
  UploadResponse,
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

export const pricingService = {
  getAll: async (): Promise<PricingTier[]> => {
    const response: AxiosResponse<PricingTier[]> =
      await api.get("/pricing-tiers");
    return response.data.sort((a, b) => a.order - b.order);
  },
};

export const testimonialService = {
  getAll: async (): Promise<Testimonial[]> => {
    const response: AxiosResponse<Testimonial[]> =
      await api.get("/testimonials");
    return response.data;
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
