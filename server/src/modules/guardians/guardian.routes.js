import express from "express";

import {
  addGuardian,
  acceptGuardianInvitation,
  getGuardians,
  revokeGuardian,
  updateGuardianPermissions,
  cancelGuardianInvitation,
  resendGuardianInvitation,
  rejectGuardianInvitation,
  getIncomingGuardianInvitations,
  getOutgoingGuardianInvitations,
  getGuardianById,
} from "./guardian.controller.js";

import { addGuardianValidation } from "./guardian.validation.js";

import protect from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validation.middleware.js";

const router = express.Router();

router.post("/", protect, addGuardianValidation, validateRequest, addGuardian);

router.get("/", protect, getGuardians);

router.get("/invitations/incoming", protect, getIncomingGuardianInvitations);

router.get("/invitations/outgoing", protect, getOutgoingGuardianInvitations);

router.get("/:guardianId", protect, getGuardianById);

router.patch("/:guardianId/accept", protect, acceptGuardianInvitation);

router.patch("/:guardianId/revoke", protect, revokeGuardian);

router.patch("/:guardianId/permissions", protect, updateGuardianPermissions);

router.patch("/:guardianId/cancel", protect, cancelGuardianInvitation);

router.post("/:guardianId/resend", protect, resendGuardianInvitation);

router.patch("/:guardianId/reject", protect, rejectGuardianInvitation);

export default router;
