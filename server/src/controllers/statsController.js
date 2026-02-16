import GlobalStats from "../models/GlobalStats.js";

export const getGlobalStats = async (req, res) => {
  try {
    const stats = await GlobalStats.findOne({ singleton: "global" }).lean();

    if (!stats) {
      return res.status(200).json({
        success: true,
        data: {
          totalTestsCompleted: 0,
          totalCharsTyped: 0,
          totalTimeSeconds: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        totalTestsCompleted: stats.totalTestsCompleted,
        totalCharsTyped: stats.totalCharsTyped,
        totalTimeSeconds: stats.totalTimeSeconds,
      },
    });
  } catch (error) {
    console.error("Stats Fetch Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
