import {
  updateUserSubscription,
  processSubscriptionPayment,
  checkFeatureAccess,
} from "../services/subscription.js";

export const getSubscriptionStatusController = async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Subscription status retrieved successfully",
      data: {
        subscription: req.user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Failed to retrieve subscription status",
    });
  }
};

export const updateSubscriptionController = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        status: 400,
        message: "Subscription plan is required",
      });
    }

    if (plan === "Free") {
      const user = await updateUserSubscription(req.user._id, { plan });

      return res.json({
        status: 200,
        message: "Subscription updated to Free plan",
        data: {
          subscription: user.subscription,
        },
      });
    }

    // For paid plans, I typically need payment processing
    // For now, just update the plan directly
    // In a real implementation, redirect to payment page

    const user = await updateUserSubscription(req.user._id, { plan });

    res.json({
      status: 200,
      message: `Subscription updated to ${plan} plan`,
      data: {
        subscription: user.subscription,
        // payment details or instructions here
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Failed to update subscription",
    });
  }
};

// Process payment for subscription
// Uncomment if you implement payment processing
/*
export const processPaymentController = async (req, res) => {
  try {
    const { plan, paymentDetails } = req.body;
    
    if (!plan || !paymentDetails) {
      return res.status(400).json({
        status: 400,
        message: "Plan and payment details are required",
      });
    }
    
    const user = await processSubscriptionPayment(
      req.user._id, 
      { plan }, 
      paymentDetails
    );
    
    res.json({
      status: 200,
      message: "Payment processed and subscription updated",
      data: {
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Failed to process payment",
    });
  }
};
*/
