import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import pricingTiersRoutes from "./routes/pricingTiers.js";
import testimonialsRoutes from "./routes/testimonials.js";
import uploadsRoutes from "./routes/uploads.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));

app.use("/api/pricing-tiers", pricingTiersRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/uploads", uploadsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
