"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/types";
import { api } from "@/services/api";
import { getErrorMessage } from "@/utils/errorHandling";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [isRefreshingUserData, setIsRefreshingUserData] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (isRefreshingUserData) return;

        setIsLoading(true);
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setUser(null);
          return;
        }

        try {
          const response = await fetch(`${api.defaults.baseURL}/auth/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUser(data.data.user || data.data);
        } catch (err: unknown) {
          console.error("Error loading user:", err);
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [isRefreshingUserData]);

  const refreshUserData = async () => {
    if (isRefreshingUserData) {
      console.log("Already refreshing user data, skipping duplicate call");
      return true;
    }

    try {
      setIsRefreshingUserData(true);
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        return false;
      }

      console.log("Refreshing user data...");
      const response = await fetch(`${api.defaults.baseURL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        localStorage.removeItem("accessToken");
        setUser(null);
        return false;
      }

      const data = await response.json();
      setUser(data.data.user || data.data);
      console.log("User data refreshed successfully");
      return true;
    } catch (err: unknown) {
      console.error("Error refreshing user data:", err);
      localStorage.removeItem("accessToken");
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
      setIsRefreshingUserData(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api.defaults.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.data.accessToken);
      setUser(data.data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "An error occurred during login"));
      console.error("Login error:", err);
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
      const response = await fetch(`${api.defaults.baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, plan }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      await login(email, password);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "An error occurred during registration"));
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    sessionStorage.setItem("loggingOut", "true");

    try {
      await fetch(`${api.defaults.baseURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("accessToken");
      setUser(null);
      window.location.href = "/";

      setTimeout(() => {
        sessionStorage.removeItem("loggingOut");
      }, 1000);
    } catch (err: unknown) {
      console.error("Logout error:", getErrorMessage(err, "Logout failed"));
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${api.defaults.baseURL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Token refresh failed:", response.status);
        return false;
      }

      const data = await response.json();
      const newToken = data.data.accessToken;

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        return true;
      }

      return false;
    } catch (err: unknown) {
      console.error(
        "Error refreshing token:",
        getErrorMessage(err, "Failed to refresh token")
      );
      return false;
    }
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
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
