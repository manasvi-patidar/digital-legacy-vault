import express from "express";
import {
  register,
  login,
  getMe,
  refreshAccessToken,
  logout,
} from "./auth.controller.js";

import protect from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validation.middleware.js";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  logoutValidation,
} from "./auth.validation.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register); //POST /api/v1/auth/register
router.post("/login", loginValidation, validateRequest, login);
router.post(
  "/refresh",
  refreshTokenValidation,
  validateRequest,
  refreshAccessToken,
);
router.post("/logout", logoutValidation, validateRequest, logout);

router.get("/me", protect, getMe); //GET  /api/v1/auth/me

export default router;
