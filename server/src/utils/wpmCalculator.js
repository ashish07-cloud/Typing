// server side math to verify client claims 

export const calculateWPM = (correctChars, duration) => {
  if (duration === 0) return 0;
  return Math.round((correctChars / 5) / (duration / 60));
};

export const calculateAccuracy = (correctChars, rawLength) => {
  if (rawLength === 0) return 100;
  return Math.round((correctChars / rawLength) * 100);
};
