import mongoose from "mongoose";

const pricingTierSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  monthlyPrice: {
    type: Number,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  features: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("PricingTier", pricingTierSchema, "tariffs");
