import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: [
        "speed_demon",
        "perfectionist",
        "dedicated",
        "addicted",
        "pro_typer",
      ],
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Invalid email format",
      ],
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },

    country: {
      type: String,
      default: "", // ISO-3166-1 alpha-2 recommended
      uppercase: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      soundEnabled: {
        type: Boolean,
        default: true,
      },
      showWpmGraph: {
        type: Boolean,
        default: true,
      },
      caretStyle: {
        type: String,
        enum: ["line", "block", "underline", "none"],
        default: "line",
      },
      fontSize: {
        type: Number,
        default: 16,
        min: 12,
        max: 42,
      },
    },

    stats: {
      bestWpm: {
        type: Number,
        default: 0,
        index: true,
      },

      testsCompleted: {
        type: Number,
        default: 0,
      },

      totalTimeTyped: {
        type: Number, // milliseconds
        default: 0,
      },

      totalCharacters: {
        type: Number,
        default: 0,
      },

      totalWpmSum: {
        type: Number,
        default: 0,
        select: false,
      },

      totalAccuracySum: {
        type: Number,
        default: 0,
        select: false,
      },
    },

    achievements: {
      type: [achievementSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual Averages
 */
userSchema.virtual("avgWpm").get(function () {
  return this.stats.testsCompleted > 0
    ? Math.round(
        this.stats.totalWpmSum / this.stats.testsCompleted
      )
    : 0;
});

userSchema.virtual("avgAccuracy").get(function () {
  return this.stats.testsCompleted > 0
    ? Math.round(
        this.stats.totalAccuracySum /
          this.stats.testsCompleted
      )
    : 0;
});

/**
 * Prevent duplicate achievements
 */
userSchema.methods.addAchievement = function (name) {
  const exists = this.achievements.some(
    (a) => a.name === name
  );
  if (!exists) {
    this.achievements.push({ name });
  }
};

/**
 * Password Hashing
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
  candidate
) {
  return bcrypt.compare(candidate, this.password);
};

/**
 * Helpful compound index for ranking queries
 */
userSchema.index({ "stats.bestWpm": -1 });

export default mongoose.model("User", userSchema);
