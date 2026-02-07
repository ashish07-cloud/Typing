import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema({
  wpmTimeline: { type: [Number], default: [] },
  duration: { type: Number, default: 0 }
}, { _id: false }); // optional: prevents creating a separate _id for telemetry

const testResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
      index: true,  
    },

    // --- ADDED: Mode Tracking ---
    mode: {
      type: String,
      enum: ["time", "words"],
      required: true,
      default: "time",
    },
    limit: {
      type: Number, 
      required: true,
    },
    // ----------------------------

    duration: {
      type: Number, 
      required: true,
    },

    rawLength: {
      type: Number, 
      required: true,
    },

    correctChars: {
      type: Number, 
      required: true,
    },

    wpm: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,
      required: true,
    },

    flags: {
      type: [String], 
      default: [],
    },

    telemetry: telemetrySchema,

    isValid: {
      type: Boolean,
      default: true,
      index: true, 
    },
  },
  { timestamps: true }
);

testResultSchema.index({ isValid: 1, wpm: -1 });
testResultSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("TestResult", testResultSchema);