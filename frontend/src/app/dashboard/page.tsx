"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo-saas.png";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSubscribed = searchParams.get("subscribed") === "true";
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }

    if (justSubscribed) {
      setShowSubscriptionAlert(true);
      const timer = setTimeout(() => {
        setShowSubscriptionAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router, justSubscribed]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleHome = () => {
    router.push("/");
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center gap-2" onClick={handleHome}>
              <Image
                src={Logo}
                alt="Saas Logo"
                width={40}
                height={40}
                className="cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSubscriptionAlert && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">
            Your subscription has been updated.
          </span>
          <button
            onClick={() => setShowSubscriptionAlert(false)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Close</span>
            <svg
              className="fill-current h-6 w-6 text-green-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}

      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome to your private dashboard, {user.name}!
            </p>
          </div>

          {/* Subscription Information */}
          {user.subscription && (
            <div className="mt-6">
              <div className="bg-indigo-50 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-indigo-900">
                      Subscription
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-indigo-700">
                      Your current plan and subscription details.
                    </p>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {user.subscription.plan === "Free"
                      ? "Upgrade Plan"
                      : "Change Plan"}
                  </Link>
                </div>
                <div className="border-t border-indigo-200">
                  <dl>
                    <div className="bg-indigo-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-indigo-800">
                        Current Plan
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-indigo-900 sm:mt-0 sm:col-span-2">
                        {user.subscription.plan}
                        {user.subscription.plan === "Pro" && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-200 text-indigo-800">
                            Popular
                          </span>
                        )}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user.subscription.isActive ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </dd>
                    </div>
                    {user.subscription.plan !== "Free" &&
                      user.subscription.endDate && (
                        <div className="bg-indigo-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-indigo-800">
                            Renewal Date
                          </dt>
                          <dd className="mt-1 text-sm text-indigo-900 sm:mt-0 sm:col-span-2">
                            {new Date(
                              user.subscription.endDate
                            ).toLocaleDateString()}
                          </dd>
                        </div>
                      )}
                  </dl>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and account information.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.email}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      User ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user._id}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.role}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Features section based on subscription plan */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Available Features
            </h2>

            {/* Basic features (all plans) */}
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700">
                Basic Features
              </h3>
              <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Task Management</span>
                </li>
                <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Basic Reports</span>
                </li>
                <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Single User</span>
                </li>
              </ul>
            </div>

            {/* Pro & Business features */}
            {user.subscription &&
              ["Pro", "Business"].includes(user.subscription.plan) && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-700">
                    Pro Features
                  </h3>
                  <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Advanced Analytics</span>
                    </li>
                    <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Unlimited Storage</span>
                    </li>
                    <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Priority Support</span>
                    </li>
                  </ul>
                </div>
              )}

            {/* Business-only features */}
            {user.subscription && user.subscription.plan === "Business" && (
              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-700">
                  Business Features
                </h3>
                <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Team Collaboration</span>
                  </li>
                  <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Custom Branding</span>
                  </li>
                  <li className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>API Access</span>
                  </li>
                </ul>
              </div>
            )}

            {/* For free plan users */}
            {user.subscription && user.subscription.plan === "Free" && (
              <div className="mt-6 bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-indigo-700 mb-3">
                  Upgrade your plan to unlock premium features like advanced
                  analytics, unlimited storage, and more!
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Pricing Plans
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
