import mongoose from "mongoose";

const keystrokeSchema = new mongoose.Schema(
  {
    k: String,
    t: Number,
    i: Number,
    c: Boolean,
  },
  { _id: false }
);

const leaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      index: true, // useful for search later
    },

    mode: {
      type: String,
      enum: ["time", "words"],
      required: true,
      index: true,
    },

    limit: {
      type: Number,
      required: true,
      index: true,
    },

    wpm: {
      type: Number,
      required: true,
      index: true,
    },

    accuracy: {
      type: Number,
      required: true,
      index: true,
    },

    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
      index: true,
    },

    // Only store for actual Top results (not everyone)
    rawLog: {
      type: [keystrokeSchema],
      default: undefined,
    },

  },
  {
    timestamps: true, // replaces manual timestamp
  }
);

/**
 * Ensure ONE PB per user per mode/limit
 */
leaderboardSchema.index(
  { user: 1, mode: 1, limit: 1 },
  { unique: true }
);

/**
 * Fast Top-N queries
 * Sort by WPM first, then accuracy as tiebreaker
 */
leaderboardSchema.index(
  { mode: 1, limit: 1, wpm: -1, accuracy: -1 }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
