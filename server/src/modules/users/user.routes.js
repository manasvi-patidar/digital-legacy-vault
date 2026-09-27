import express from "express";
import { getMyProfile, updateMyProfile } from "./user.controller.js";
import { updateProfileValidation } from "./user.validation.js";
import protect from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validation.middleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.patch(
  "/me",
  protect,
  updateProfileValidation,
  validateRequest,
  updateMyProfile,
);

export default router;
