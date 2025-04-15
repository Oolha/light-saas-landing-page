import User from "../models/User.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const STRIPE_PRICE_IDS = {
  Pro: process.env.STRIPE_PRO_PRICE_ID,
  Business: process.env.STRIPE_BUSINESS_PRICE_ID,
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { planTitle } = req.body;
    const userId = req.user._id;

    // Отримуємо користувача з БД
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Отримуємо Stripe Price ID для обраного плану
    const priceId = STRIPE_PRICE_IDS[planTitle];
    if (!priceId) {
      return res.status(400).json({ message: "Вибрано недійсний план" });
    }

    // Створюємо або отримуємо Stripe клієнта
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;

      // Зберігаємо Stripe customer ID для користувача
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Створюємо checkout сесію
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription?canceled=true`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Помилка створення checkout сесії:", error);
    res.status(500).json({ message: "Не вдалося створити checkout сесію" });
  }
};

/**
 * Створює сесію порталу клієнта для управління підпискою
 */
export const createCustomerPortalSession = async (req, res) => {
  try {
    const userId = req.user._id;

    // Отримуємо користувача з БД
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return res
        .status(404)
        .json({ message: "Користувача або Stripe клієнта не знайдено" });
    }

    // Створюємо сесію порталу клієнта
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Помилка створення сесії порталу клієнта:", error);
    res
      .status(500)
      .json({ message: "Не вдалося створити сесію порталу клієнта" });
  }
};

/**
 * Обробляє webhook події від Stripe
 */
export const handleWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Помилка верифікації webhook підпису:", error);
    return res.status(400).send(`Webhook помилка: ${error.message}`);
  }

  // Обробляємо тільки найважливіші події
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Отримуємо інформацію про користувача з метаданих
      const userId = session.metadata.userId;
      const user = await User.findById(userId);

      if (user) {
        // Якщо це підписка, отримуємо інформацію про підписку
        if (session.mode === "subscription") {
          const subscriptionId = session.subscription;
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          // Визначаємо план на основі price ID
          let planName = "Free";
          const priceId = subscription.items.data[0].price.id;

          if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
            planName = "Pro";
          } else if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) {
            planName = "Business";
          }

          // Оновлюємо інформацію користувача
          user.subscription.plan = planName;
          user.subscription.isActive = true;
          user.subscription.stripeSubscriptionId = subscriptionId;
          user.subscription.startDate = new Date();
          user.subscription.currentPeriodEnd = new Date(
            subscription.current_period_end * 1000
          );

          await user.save();
        }
      }
    } catch (error) {
      console.error("Помилка обробки webhook:", error);
    }
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    try {
      // Знаходимо користувача з цією підпискою
      const user = await User.findOne({
        "subscription.stripeSubscriptionId": subscription.id,
      });

      if (user) {
        // Повертаємо користувача на безкоштовний план
        user.subscription.plan = "Free";
        user.subscription.isActive = false;
        user.subscription.stripeSubscriptionId = null;
        user.subscription.currentPeriodEnd = null;

        await user.save();
      }
    } catch (error) {
      console.error("Помилка обробки скасування підписки:", error);
    }
  }

  res.status(200).json({ received: true });
};
