import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", testimonialSchema, "users");
