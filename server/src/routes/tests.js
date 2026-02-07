import express from "express";
import { submitTest } from "../controllers/testController.js";
import validateReplay from "../middleware/validateReplay.js";
import { testLimiter } from "../config/ratelimit.js";

const router = express.Router();

router.post("/", testLimiter, validateReplay, submitTest);

export default router;
