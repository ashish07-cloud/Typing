import TestResult from "../models/TestResult.js";
import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";
import GlobalStats from "../models/GlobalStats.js";
import { analyzeTest } from "../utils/textAnalysis.js";

export const submitTest = async (req, res) => {
  try {
    const { rawLog, mode, limit, deviceType = "desktop" } = req.body;
    const user = req.user || null;

    if (!Array.isArray(rawLog)) {
      return res.status(400).json({ error: "Invalid submission payload" });
    }

    // 🔥 SERVER AUTHORITATIVE ANALYSIS
    const analysis = analyzeTest({ rawLog });

    if (analysis.error) {
      return res.status(400).json({ error: analysis.error });
    }

    const {
      correct,
      incorrect,
      totalTyped,
      durationSeconds,
      netWpm,
      rawWpm,
      accuracy,
      flags,
      isValid,
    } = analysis;

    // ---- GLOBAL STATS ----
    await GlobalStats.findOneAndUpdate(
      { singleton: "global" },
      {
        $inc: {
          totalTestsCompleted: 1,
          totalCharsTyped: totalTyped,
          totalTimeSeconds: Math.floor(durationSeconds),
        },
      },
      { upsert: true }
    );

    // ---- GUEST ----
    if (!user) {
      return res.status(200).json({
        success: true,
        data: { wpm: netWpm, rawWpm, accuracy, isValid, flags, isGuest: true },
      });
    }

    const userId = user.id;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // ---- PERSONAL BEST ----
    const existingPB = await Leaderboard.findOne({
      user: userId,
      mode,
      limit,
    });

    const isNewPB =
      isValid && (!existingPB || netWpm > existingPB.wpm);

    if (isNewPB) {
      await Leaderboard.findOneAndUpdate(
        { user: userId, mode, limit },
        {
          user: userId,
          username: userData.username,
          wpm: netWpm,
          accuracy,
          mode,
          limit,
          updatedAt: new Date(),
        },
        { upsert: true }
      );
    }

    // ---- SAVE TEST ----
    await TestResult.create({
      user: userId,
      mode,
      limit,
      wpm: netWpm,
      rawWpm,
      accuracy,
      duration: durationSeconds * 1000,
      correct,
      incorrect,
      totalTyped,
      deviceType,
      rawLog: isNewPB || !isValid ? rawLog : undefined,
      isValid,
      flags,
    });

    // ---- USER STATS ----
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "stats.testsCompleted": 1,
        "stats.totalTimeTyped": durationSeconds * 1000,
        "stats.totalCharacters": correct,
        "stats.totalWpmSum": netWpm,
        "stats.totalAccuracySum": accuracy,
      },
      $max: { "stats.bestWpm": netWpm },
    });

    return res.status(201).json({
      success: true,
      data: { wpm: netWpm, rawWpm, accuracy, isNewPB, isValid, flags },
    });

  } catch (error) {
    console.error("Submission Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
