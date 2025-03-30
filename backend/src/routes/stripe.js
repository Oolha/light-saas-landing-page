import express from "express";
import * as stripeController from "../controllers/stripeController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticate,
  stripeController.createCheckoutSession
);

router.post(
  "/create-customer-portal-session",
  authenticate,
  stripeController.createCustomerPortalSession
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeController.handleWebhook
);

export default router;
