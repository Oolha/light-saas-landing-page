import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  async createCheckoutSession({
    planId,
    customerId,
    userId,
    userEmail,
    successUrl,
    cancelUrl,
  }) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customerId,
        customer_email: !customerId ? userEmail : undefined,
        client_reference_id: userId,
        line_items: [
          {
            price: planId, // Stripe Price ID
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
        },
      });

      return session;
    } catch (error) {
      console.error("Stripe checkout session error:", error);
      throw error;
    }
  }

  //Create a Stripe customer
  async createCustomer({ email, name, userId }) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });
      return customer;
    } catch (error) {
      console.error("Stripe create customer error:", error);
      throw error;
    }
  }

  //Create a customer portal session

  async createCustomerPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      console.error("Stripe customer portal session error:", error);
      throw error;
    }
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId) {
    try {
      return await stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error("Stripe cancel subscription error:", error);
      throw error;
    }
  }

  // Retrieve Stripe subscription details

  async getSubscription(subscriptionId) {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error("Stripe get subscription error:", error);
      throw error;
    }
  }
}

module.exports = new StripeService();
