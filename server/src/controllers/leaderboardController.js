import TestResult from "../models/TestResult.js";

export const getLeaderboard = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);

  const results = await TestResult.find({ isValid: true })
    .sort({ wpm: -1, accuracy: -1, createdAt: 1 })
    .limit(limit)
    .select("wpm accuracy duration createdAt");

  res.status(200).json({
    success: true,
    count: results.length,
    results,
  });
};
