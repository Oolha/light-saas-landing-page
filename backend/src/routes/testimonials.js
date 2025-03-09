import express from "express";
import upload from "../middlewares/upload.js";
import User from "../models/Testimonial.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const testimonials = await User.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    let testimonialData = {
      text: req.body.text,
      name: req.body.name,
      username: req.body.username,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });

      testimonialData.imageSrc = result.secure_url;
      testimonialData.imagePublicId = result.public_id;

      fs.unlinkSync(req.file.path);
    } else if (req.body.imageSrc) {
      testimonialData.imageSrc = req.body.imageSrc;
    } else {
      return res.status(400).json({ message: "Зображення обов'язкове" });
    }

    const user = new User(testimonialData);
    const newTestimonial = await user.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await User.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    if (testimonial.imagePublicId) {
      await cloudinary.uploader.destroy(testimonial.imagePublicId);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Відгук успішно видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
