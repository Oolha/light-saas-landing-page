import express from "express";
import upload from "../middlewares/upload.js";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

router.delete("/delete/:public_id", deleteImage);

export default router;
