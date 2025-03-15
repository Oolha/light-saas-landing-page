"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/types";

const API_URL = "https://saas-website-tlj3.onrender.com/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            try {
              await refreshToken();
            } catch (error) {
              localStorage.removeItem("accessToken");
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Auth check error:", error);
        }
      }
    };

    checkAuth();
  }, []);

  // Оновлення токена
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.data.accessToken);

        // Отримуємо дані користувача
        const userResponse = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${data.data.accessToken}`,
          },
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.data);
        }
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  };

  // Функція логіну
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      setUser(data.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функція реєстрації
  const register = async (
    name: string,
    email: string,
    password: string,
    plan: "Free" | "Pro" | "Business" = "Free"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      await login(email, password);
    } catch (error: any) {
      setError(error.message || "An error occurred during registration");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функція виходу
  const logout = async () => {
    setIsLoading(true);

    sessionStorage.setItem("loggingOut", "true");

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

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

  // Очищення помилок
  const clearError = () => {
    setError(null);
  };

  // Значення контексту
  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
