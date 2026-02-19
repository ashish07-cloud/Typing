import express from "express";
import { 
  register, 
  login,
  getMe,
  updatePreferences,
  deleteAccount,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// ✅ RESTORE THESE
router.get("/me", authMiddleware, getMe);
router.put("/preferences", authMiddleware, updatePreferences);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
