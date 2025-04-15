interface SubscriptionUpdateAlertProps {
  needsRefresh: boolean;
}

export default function SubscriptionUpdateAlert({
  needsRefresh,
}: SubscriptionUpdateAlertProps) {
  if (!needsRefresh) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
      <p className="text-sm text-yellow-700">
        Your payment was successful! Please click the "Refresh Subscription"
        button to update your subscription information.
      </p>
    </div>
  );
}
