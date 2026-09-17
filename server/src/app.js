import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Legacy Vault API is running",
  });
});

app.use("/api/v1/auth", authRoutes);

export default app;
