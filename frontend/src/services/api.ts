import axios, { AxiosResponse } from "axios";
import { PricingTier, Testimonial, UploadResponse } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://saas-website-tlj3.onrender.com/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const pricingService = {
  getAll: async (): Promise<PricingTier[]> => {
    const response: AxiosResponse<PricingTier[]> =
      await api.get("/pricing-tiers");
    return response.data;
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
