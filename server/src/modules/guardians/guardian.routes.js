import express from "express";

import { addGuardian } from "./guardian.controller.js";
import { addGuardianValidation } from "./guardian.validation.js";

import protect from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validation.middleware.js";

const router = express.Router();

router.post("/", protect, addGuardianValidation, validateRequest, addGuardian);

export default router;
