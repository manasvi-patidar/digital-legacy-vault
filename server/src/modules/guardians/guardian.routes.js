import express from "express";

import {
  addGuardian,
  acceptGuardianInvitation,
  getGuardians,
  revokeGuardian,
  updateGuardianPermissions,
  cancelGuardianInvitation,
  resendGuardianInvitation,
} from "./guardian.controller.js";

import { addGuardianValidation } from "./guardian.validation.js";

import protect from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validation.middleware.js";

const router = express.Router();

router.post("/", protect, addGuardianValidation, validateRequest, addGuardian);

router.get("/", protect, getGuardians);

router.patch("/:guardianId/accept", protect, acceptGuardianInvitation);

router.patch("/:guardianId/revoke", protect, revokeGuardian);

router.patch("/:guardianId/permissions", protect, updateGuardianPermissions);

router.patch("/:guardianId/cancel", protect, cancelGuardianInvitation);

router.post("/:guardianId/resend", protect, resendGuardianInvitation);

export default router;
