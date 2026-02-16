import Leaderboard from "../models/Leaderboard.js";

const ALLOWED_MODES = ["time", "words"];
const ALLOWED_LIMITS = [15, 30, 60, 120, 10, 25, 50, 100];

export const getLeaderboard = async (req, res) => {
  try {
    const mode = req.query.mode;
    const limit = Number(req.query.limit);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Number(req.query.pageSize) || 10, 50);

    if (!ALLOWED_MODES.includes(mode)) {
      return res.status(400).json({ error: "Invalid mode" });
    }

    if (!ALLOWED_LIMITS.includes(limit)) {
      return res.status(400).json({ error: "Invalid limit value" });
    }

    const skip = (page - 1) * pageSize;

    const rankings = await Leaderboard.find({ mode, limit })
      .sort({ wpm: -1, accuracy: -1 })
      .skip(skip)
      .limit(pageSize)
      .select("username wpm accuracy createdAt")
      .lean();

    res.set("Cache-Control", "public, max-age=30");

    return res.status(200).json({
      success: true,
      page,
      pageSize,
      results: rankings,
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
