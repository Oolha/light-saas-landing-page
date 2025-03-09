import express from "express";
const router = express.Router();
import Testimonial from "../models/Testimonial.js";

// GET всі відгуки
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST новий відгук
router.post("/", async (req, res) => {
  const testimonial = new Testimonial(req.body);
  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
