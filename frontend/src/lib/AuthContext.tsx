"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/types";
import { api } from "@/services/api";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("temp_token");

        if (token) {
          if (
            !localStorage.getItem("accessToken") &&
            sessionStorage.getItem("temp_token")
          ) {
            localStorage.setItem(
              "accessToken",
              sessionStorage.getItem("temp_token")!
            );
            sessionStorage.removeItem("temp_token");
          }
          const response = await api.get("/auth/me");
          setUser(response.data.data.user);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("temp_token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auth/me");
      setUser(response.data.data.user);
      return true;
    } catch (error: any) {
      console.error("Error refreshing user data:", error);
      setError("Failed to refresh user data");

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("accessToken");
        setUser(null);
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", response.data.data.accessToken);
      setUser(response.data.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during login"
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    plan: "Free" | "Pro" | "Business" = "Free"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        plan,
      });
      await login(email, password);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during registration"
      );
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    sessionStorage.setItem("loggingOut", "true");

    try {
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
      router.push("/");

      setTimeout(() => {
        sessionStorage.removeItem("loggingOut");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
