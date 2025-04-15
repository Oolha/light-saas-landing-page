import { User } from "@/types";
import SubscriptionInfo from "@/components/SubscriptionInfo";
import UserProfile from "@/components/UserProfile";
import FeaturesList from "@/components/FeaturesList";

interface DashboardMainContentProps {
  user: User;
  onUpgradeClick: () => void;
}

export default function DashboardMainContent({
  user,
  onUpgradeClick,
}: DashboardMainContentProps) {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          Welcome to your private dashboard, {user.name}!
        </p>
      </div>

      <SubscriptionInfo
        subscription={user.subscription}
        onUpgradeClick={onUpgradeClick}
      />

      <UserProfile user={user} />

      <FeaturesList
        plan={user.subscription?.plan}
        onUpgradeClick={onUpgradeClick}
      />
    </div>
  );
}
