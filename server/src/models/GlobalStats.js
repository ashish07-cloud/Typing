import mongoose from "mongoose";

const globalStatsSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: "global",
      unique: true,
      index: true,
    },
    totalTestsCompleted: {
      type: Number,
      default: 0,
    },
    totalCharsTyped: {
      type: Number,
      default: 0,
    },
    totalTimeSeconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

globalStatsSchema.index({ singleton: 1 });

export default mongoose.model("GlobalStats", globalStatsSchema);
