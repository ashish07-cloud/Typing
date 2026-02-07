import TestResult from "../models/TestResult.js";
import { calculateWPM, calculateAccuracy } from "../utils/wpmCalculator.js";

export const submitTest = async (req, res) => {
  const {
    duration,
    rawLength,
    correctChars,
    flags = [],
  } = req.body;

  const wpm = calculateWPM(correctChars, duration);
  const accuracy = calculateAccuracy(correctChars, rawLength);

  const isValid = flags.length === 0;

  const result = await TestResult.create({
    duration,
    rawLength,
    correctChars,
    wpm,
    accuracy,
    flags,
    isValid,
  });

  res.status(201).json({
    success: true,
    result: {
      wpm,
      accuracy,
      isValid,
    },
  });
};
