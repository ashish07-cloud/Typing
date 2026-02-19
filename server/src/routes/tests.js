import express from "express";
import { submitTest } from "../controllers/testController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { testLimiter } from "../config/ratelimit.js";

const router = express.Router();


router.post("/", testLimiter, authMiddleware, submitTest);

export default router;