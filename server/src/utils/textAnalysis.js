// utils/textAnalysis.js

import {
  calculateNetWPM,
  calculateRawWPM,
  calculateAccuracy,
} from "./wpmCalculator.js";

export const analyzeTest = ({ rawLog, testText }) => {
  const flags = [];

  if (!Array.isArray(rawLog) || !testText) {
    return { error: "Invalid submission payload" };
  }

  // Chronological check
  for (let i = 1; i < rawLog.length; i++) {
    if (rawLog[i].t <= rawLog[i - 1].t) {
      flags.push("invalid_timestamp_sequence");
      break;
    }
  }

  // Simulate typing
  let index = 0;
  let correct = 0;
  let incorrect = 0;

  rawLog.forEach(entry => {
    if (entry.k === "bksp") {
      if (index > 0) index--;
      return;
    }

    const expectedChar = testText[index];

    if (entry.k === expectedChar) {
      correct++;
    } else {
      incorrect++;
    }

    index++;
  });

  const totalTyped = correct + incorrect;

  const durationSeconds =
    (rawLog[rawLog.length - 1].t - rawLog[0].t) / 1000;

  if (durationSeconds <= 0) flags.push("invalid_duration");

  const netWpm = calculateNetWPM(correct, durationSeconds);
  const rawWpm = calculateRawWPM(totalTyped, durationSeconds);
  const accuracy = calculateAccuracy(correct, totalTyped);

  if (netWpm > 300) flags.push("impossible_wpm");

  return {
    correct,
    incorrect,
    totalTyped,
    durationSeconds,
    netWpm: Math.round(netWpm),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(accuracy),
    flags,
    isValid: flags.length === 0,
  };
};