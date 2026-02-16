import TestResult from "../models/TestResult.js";
import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";
import GlobalStats from "../models/GlobalStats.js";

export const submitTest = async (req, res) => {
  try {
    const {
      rawLog,
      duration,
      mode,
      limit,
      deviceType = "desktop",
    } = req.body;

    const user = req.user || null;

    // ---- VALIDATION ----
    if (!Array.isArray(rawLog) || typeof duration !== "number") {
      return res.status(400).json({ error: "Invalid submission payload" });
    }

    const safeDuration = Math.max(duration, 1000);
    const minutes = safeDuration / 60000;

    // ---- SERVER AUTHORITATIVE CALCULATION ----
    const correct = rawLog.filter(e => e.c === true).length;
    const totalTyped = rawLog.filter(e => e.k !== "bksp").length;
    const incorrect = totalTyped - correct;

    const wpm = Math.max(0, Math.round((correct / 5) / minutes));
    const rawWpm = Math.max(0, Math.round((totalTyped / 5) / minutes));
    const accuracy =
      totalTyped > 0
        ? Math.round((correct / totalTyped) * 100)
        : 0;

    // ---- BASIC ANTI-CHEAT ----
    const flags = [];

    if (wpm > 300) flags.push("impossible_speed");
    if (accuracy > 100) flags.push("invalid_accuracy");
    if (correct > totalTyped) flags.push("invalid_counts");

    const isValid = flags.length === 0;

    // ---- GLOBAL STATS ----
    await GlobalStats.findOneAndUpdate(
      { singleton: "global" },
      {
        $inc: {
          totalTestsCompleted: 1,
          totalCharsTyped: totalTyped,
          totalTimeSeconds: Math.floor(safeDuration / 1000),
        },
      },
      { upsert: true }
    );

    // ---- GUEST SUBMISSION ----
    if (!user) {
      return res.status(200).json({
        success: true,
        data: { wpm, rawWpm, accuracy, isValid, flags, isGuest: true },
      });
    }

    const userId = user.id;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // ---- PERSONAL BEST CHECK ----
    const existingPB = await Leaderboard.findOne({
      user: userId,
      mode,
      limit,
    });

    const isNewPB =
      isValid &&
      (!existingPB || wpm > existingPB.wpm);

    if (isNewPB) {
      await Leaderboard.findOneAndUpdate(
        { user: userId, mode, limit },
        {
          user: userId,
          username: userData.username,
          wpm,
          accuracy,
          mode,
          limit,
          updatedAt: new Date(),
        },
        { upsert: true }
      );
    }

    // ---- SAVE TEST RESULT ----
    await TestResult.create({
      user: userId,
      mode,
      limit,
      wpm,
      rawWpm,
      accuracy,
      duration: safeDuration,
      correct,
      incorrect,
      totalTyped,
      deviceType,
      rawLog: isNewPB || !isValid ? rawLog : undefined,
      isValid,
      flags,
    });

    // ---- UPDATE USER AGGREGATES ----
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "stats.testsCompleted": 1,
        "stats.totalTimeTyped": safeDuration,
        "stats.totalCharacters": correct,
        "stats.totalWpmSum": wpm,
        "stats.totalAccuracySum": accuracy,
      },
      $max: { "stats.bestWpm": wpm },
    });

    return res.status(201).json({
      success: true,
      data: { wpm, rawWpm, accuracy, isNewPB, isValid, flags },
    });

  } catch (error) {
    console.error("Submission Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
