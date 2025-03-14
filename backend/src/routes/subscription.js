import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  updateSubscriptionController,
  getSubscriptionStatusController,
} from "../controllers/subscription.js";

const router = express.Router();

router.use(authenticate);

router.get("/status", getSubscriptionStatusController);

router.post("/update", updateSubscriptionController);

// don't forget to add this route if  implement payment processing
// router.post("/process-payment", processPaymentController);

export default router;
