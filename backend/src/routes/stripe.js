import express from "express";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  handleWebhook,
} from "../controllers/stripe.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-checkout-session", authenticate, createCheckoutSession);

router.post(
  "/create-customer-portal-session",
  authenticate,
  createCustomerPortalSession
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
