import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";
import TestResult from "../models/TestResult.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ error: "Username or Email taken" });

    // Model handles default preferences/stats automatically
    const user = await User.create({ username, email, password });
    const token = signToken(user._id);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Session failed" });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { preferences: req.body.preferences } },
      { new: true, runValidators: true }
    );

    res.json({ preferences: updatedUser.preferences });
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Delete leaderboard entries
    await Leaderboard.deleteMany({ user: userId });

    // 2. Delete test history
    await TestResult.deleteMany({ user: userId });

    // 3. Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

