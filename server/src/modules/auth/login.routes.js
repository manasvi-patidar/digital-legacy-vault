import express from "express";
import { login } from "./auth.controller.js";

const router = express.Router();

router.post("/", login); //POST /api/v1/auth/login

export default router;
