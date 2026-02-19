// utils/textAnalysis.js

import {
  calculateNetWPM,
  calculateRawWPM,
  calculateAccuracy,
} from "./wpmCalculator.js";

export const analyzeTest = ({ rawLog }) => {
  const flags = [];

  if (!Array.isArray(rawLog) || rawLog.length < 2) {
    return { error: "Invalid log data" };
  }

  // 1️⃣ Validate chronological timestamps
  for (let i = 1; i < rawLog.length; i++) {
    if (rawLog[i].t <= rawLog[i - 1].t) {
      flags.push("invalid_timestamp_sequence");
      break;
    }
  }

  // 2️⃣ Remove impossible keystrokes (<5ms apart)
  const cleaned = [];
  for (let i = 0; i < rawLog.length; i++) {
    if (i === 0) {
      cleaned.push(rawLog[i]);
      continue;
    }

    const delta = rawLog[i].t - rawLog[i - 1].t;

    if (delta >= 5) {
      cleaned.push(rawLog[i]);
    }
  }

  if (cleaned.length < rawLog.length * 0.6) {
    flags.push("suspicious_speed_pattern");
  }

  // 3️⃣ Count characters
  let correct = 0;
  let incorrect = 0;

  cleaned.forEach(entry => {
    if (entry.k !== "bksp") {
      if (entry.c === true) correct++;
      else incorrect++;
    }
  });

  const totalTyped = correct + incorrect;

  // 4️⃣ Server-authoritative duration
  const durationSeconds =
    (cleaned[cleaned.length - 1].t - cleaned[0].t) / 1000;

  if (durationSeconds <= 0) {
    flags.push("invalid_duration");
  }

  // 5️⃣ Detect single key spam
  const keyFrequency = {};
  cleaned.forEach(entry => {
    if (!entry.k) return;
    keyFrequency[entry.k] = (keyFrequency[entry.k] || 0) + 1;
  });

  const mostFrequent = Math.max(...Object.values(keyFrequency));
  if (mostFrequent / cleaned.length > 0.85) {
    flags.push("single_key_spam");
  }

  // 6️⃣ Calculate metrics
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
