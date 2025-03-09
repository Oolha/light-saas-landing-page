import express from "express";
const router = express.Router();
import PricingTier from "../models/PricingTier.js";

router.get("/", async (req, res) => {
  try {
    const pricingTiers = await PricingTier.find();
    res.json(pricingTiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const pricingTier = new PricingTier(req.body);
  try {
    const newPricingTier = await pricingTier.save();
    res.status(201).json(newPricingTier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
