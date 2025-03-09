import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Testimonial", testimonialSchema);
