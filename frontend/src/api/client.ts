import { API_URL } from "@/constants/api";
import axios, { AxiosInstance, AxiosError } from "axios";

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // add token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // for handling authentication errors
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const isAuthError =
        error.response?.status === 401 || error.response?.status === 403;

      if (
        isAuthError &&
        !sessionStorage.getItem("loggingOut") &&
        typeof window !== "undefined"
      ) {
        const isAuthPage =
          window.location.pathname.includes("/login") ||
          window.location.pathname.includes("/register") ||
          window.location.pathname === "/";

        if (!isAuthPage) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createApiClient();

export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return await response.json();
};
