import express from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  getCurrentUserController,
} from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
router.post("/refresh", refreshUserSessionController);

router.get("/me", authenticate, getCurrentUserController);

export default router;
