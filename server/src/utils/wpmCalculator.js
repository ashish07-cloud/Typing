// utils/wpmCalculator.js

export const calculateNetWPM = (correctChars, durationSeconds) => {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  return (correctChars / 5) / (durationSeconds / 60);
};

export const calculateRawWPM = (totalTyped, durationSeconds) => {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  return (totalTyped / 5) / (durationSeconds / 60);
};

export const calculateAccuracy = (correctChars, totalTyped) => {
  if (!totalTyped) return 100;
  return (correctChars / totalTyped) * 100;
};
