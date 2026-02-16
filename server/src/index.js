import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import testRoutes from "./routes/tests.js";
import statsRoutes from "./routes/stats.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import userRoutes from "./routes/users.js"

dotenv.config();

const app = express();

// 1. DATABASE CONNECTION
// We wrap this to ensure we don't start the server if the DB is dead
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    // 2. MIDDLEWARE
    app.use(cors({ 
      origin: "http://localhost:5173", 
      credentials: true 
    })); 
    app.use(express.json());

    // 3. MOUNT ROUTES
    app.use("/api/auth", authRoutes);
    app.use("/api/tests", testRoutes);
    app.use("/api/stats", statsRoutes);
    app.use("/api/leaderboard", leaderboardRoutes);
    app.use("/api/users", userRoutes);

    // 4. GLOBAL ERROR HANDLER (Production Essential)
    // This catches any unhandled errors in your controllers
    app.use((err, req, res, next) => {
      console.error("🚨 Global Error:", err.stack);
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server screaming on port ${PORT}`));

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Kill the process if DB connection fails
  }
};

startServer();