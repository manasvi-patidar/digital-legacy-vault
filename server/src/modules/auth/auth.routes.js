import express from "express";
import {
  register,
  login,
  getMe,
  refreshAccessToken,
  logout,
} from "./auth.controller.js";
import protect from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register); //POST /api/v1/auth/register
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

router.get("/me", protect, getMe); //GET  /api/v1/auth/me

export default router;
