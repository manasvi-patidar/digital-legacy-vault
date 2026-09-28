import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  deactivateMyAccount,
} from "./user.controller.js";

import {
  updateProfileValidation,
  changePasswordValidation,
  deactivateAccountValidation,
} from "./user.validation.js";

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

router.patch(
  "/me/password",
  protect,
  changePasswordValidation,
  validateRequest,
  changeMyPassword,
);

router.patch(
  "/me/deactivate",
  protect,
  deactivateAccountValidation,
  validateRequest,
  deactivateMyAccount,
);

export default router;
