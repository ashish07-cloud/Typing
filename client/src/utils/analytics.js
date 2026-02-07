// logic to calculate raw wpm, consistency and std dev

export function calculateWPM(correctChars, timeInSeconds) {
  if (timeInSeconds === 0) return 0;

  const wordsTyped = correctChars / 5;
  const minutes = timeInSeconds / 60;

  return Math.round(wordsTyped / minutes);
}

export function calculateAccuracy(correctChars, totalTypedChars) {
  if (totalTypedChars === 0) return 100;

  return Math.round((correctChars / totalTypedChars) * 100);
}
