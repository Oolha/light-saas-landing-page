import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не вибрано" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Файл успішно завантажено",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Помилка завантаження:", error);
    res
      .status(500)
      .json({ message: "Помилка завантаження файлу", error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({ message: "Не вказано ID зображення" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      message: "Зображення успішно видалено",
      result,
    });
  } catch (error) {
    console.error("Помилка видалення:", error);
    res
      .status(500)
      .json({ message: "Помилка видалення зображення", error: error.message });
  }
};
