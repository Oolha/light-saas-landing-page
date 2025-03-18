import { User } from "@/types";

interface FeatureItemProps {
  children: React.ReactNode;
}

interface FeaturesListProps {
  plan: User["subscription"]["plan"] | undefined;
  onUpgradeClick: () => void;
}

const FeatureItem = ({ children }: FeatureItemProps) => (
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
    <span>{children}</span>
  </li>
);

export default function FeaturesList({
  plan,
  onUpgradeClick,
}: FeaturesListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900">
        Available Features
      </h2>

      {/* Basic features (all plans) */}
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-700">Basic Features</h3>
        <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FeatureItem>Task Management</FeatureItem>
          <FeatureItem>Basic Reports</FeatureItem>
          <FeatureItem>Single User</FeatureItem>
        </ul>
      </div>

      {/* Pro & Business features */}
      {plan && ["Pro", "Business"].includes(plan) && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700">Pro Features</h3>
          <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureItem>Advanced Analytics</FeatureItem>
            <FeatureItem>Unlimited Storage</FeatureItem>
            <FeatureItem>Priority Support</FeatureItem>
          </ul>
        </div>
      )}

      {/* Business-only features */}
      {plan === "Business" && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700">
            Business Features
          </h3>
          <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureItem>Team Collaboration</FeatureItem>
            <FeatureItem>Custom Branding</FeatureItem>
            <FeatureItem>API Access</FeatureItem>
          </ul>
        </div>
      )}

      {/* For free plan users */}
      {plan === "Free" && (
        <div className="mt-6 bg-indigo-50 p-4 rounded-lg text-center">
          <p className="text-indigo-700 mb-3">
            Upgrade your plan to unlock premium features like advanced
            analytics, unlimited storage, and more!
          </p>
          <button
            onClick={onUpgradeClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Pricing Plans
          </button>
        </div>
      )}
    </div>
  );
}
