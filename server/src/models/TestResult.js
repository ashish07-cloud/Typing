import mongoose from "mongoose";

const keystrokeSchema = new mongoose.Schema(
  {
    k: { type: String },      // key
    t: { type: Number },      // timestamp
    i: { type: Number },      // index
    c: { type: Boolean },     // correctness
  },
  { _id: false }
);

const testResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

    rawWpm: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },

    duration: {
      type: Number, // milliseconds
      required: true,
    },

    correct: {
      type: Number,
      required: true,
    },

    incorrect: {
      type: Number,
      required: true,
    },

    totalTyped: {
      type: Number,
      required: true,
    },

    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
      index: true,
    },

    consistencyScore: {
      type: Number,
      default: null, // future feature
    },

    rawLog: {
      type: [keystrokeSchema],
      default: undefined, // only saved when needed
    },

    isValid: {
      type: Boolean,
      default: true,
      index: true,
    },

    flags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Compound index for leaderboard queries
 * Fast query: top scores per mode + limit
 */
testResultSchema.index({ mode: 1, limit: 1, wpm: -1, accuracy: -1 });

/**
 * Fast personal best lookup
 */
testResultSchema.index({ user: 1, mode: 1, limit: 1, wpm: -1 });

export default mongoose.model("TestResult", testResultSchema);
