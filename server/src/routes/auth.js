import express from "express";
import { 
  register, 
  login,
  getMe,
  updatePreferences
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// ✅ RESTORE THESE
router.get("/me", authMiddleware, getMe);
router.put("/preferences", authMiddleware, updatePreferences);

export default router;
