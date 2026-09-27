import express from "express";
import { getMyProfile } from "./user.controller.js";
import protect from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

export default router;
