import express from "express";
import { submitTest } from "../controllers/testController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { testLimiter } from "../config/ratelimit.js";

const router = express.Router();

// The order matters:
// 1. Rate Limit (prevent DDOS/Bot spam)
// 2. Auth (identify Guest vs User)
// 3. Controller (validate log and save)
router.post("/", testLimiter, authMiddleware, submitTest);

export default router;