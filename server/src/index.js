import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import testRoutes from "./routes/tests.js";
import authRoutes from "./routes/auth.js";
import leaderboardRoutes from "./routes/leaderboard.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tests", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
