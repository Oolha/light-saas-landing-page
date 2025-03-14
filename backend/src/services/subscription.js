import User from "../models/User.js";

// Update user subscription
export const updateUserSubscription = async (userId, planData) => {
  const { plan } = planData;

  if (!["Free", "Pro", "Business"].includes(plan)) {
    throw new Error("Invalid subscription plan");
  }

  // (30 days from now)
  const endDate =
    plan !== "Free" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      "subscription.plan": plan,
      "subscription.startDate": new Date(),
      "subscription.endDate": endDate,
      "subscription.isActive": true,
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// simulation of process payment for subscription
export const processSubscriptionPayment = async (
  userId,
  planData,
  paymentDetails
) => {
  return await updateUserSubscription(userId, planData);
};

export const checkFeatureAccess = (userSubscription, featureLevel) => {
  const planLevels = {
    Free: 1,
    Pro: 2,
    Business: 3,
  };

  const userPlanLevel = planLevels[userSubscription.plan] || 0;
  const requiredLevel = planLevels[featureLevel] || 999;

  return userPlanLevel >= requiredLevel;
};
