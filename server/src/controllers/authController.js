import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await User.create({
    username,
    email,
    password: hashed,
  });

  const token = signToken(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};


export const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
};

