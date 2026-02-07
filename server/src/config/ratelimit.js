// prevent API spamming

import rateLimit from "express-rate-limit";

export const testLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many test submissions. Please wait a minute.",
  },
});
