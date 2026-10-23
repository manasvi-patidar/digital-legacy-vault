import express from "express";

import { createAsset } from "./asset.controller.js";
import { createAssetValidation } from "./asset.validation.js";
import protect from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validation.middleware.js";

const router = express.Router();

router.post("/", protect, createAssetValidation, validateRequest, createAsset);

export default router;
