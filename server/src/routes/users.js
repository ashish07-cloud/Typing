import express from "express";
import User from "../models/User.js";
import TestResult from "../models/TestResult.js";

const router = express.Router();


router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-email -preferences.soundEnabled"); 

    if (!user) return res.status(404).json({ error: "User not found" });
   const recentTests = await TestResult.find({ user: user._id, isValid: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("wpm accuracy mode limit createdAt");

    res.json({ 
      success: true, 
      user: {
        ...user.toJSON(),
        recentTests 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;