import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import testRoutes from "./routes/tests.js";
import statsRoutes from "./routes/stats.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

   const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(null, false);
  },
  credentials: true
}));

// Express 5 compatible
app.options(/.*/, cors());

app.use(express.json());

    // 3. MOUNT ROUTES
    app.use("/api/auth", authRoutes);
    app.use("/api/tests", testRoutes);
    app.use("/api/stats", statsRoutes);
    app.use("/api/leaderboard", leaderboardRoutes);
    app.use("/api/users", userRoutes);

    app.use((err, req, res, next) => {
      console.error("🚨 Global Error:", err.stack);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
