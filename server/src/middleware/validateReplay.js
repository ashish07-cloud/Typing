export default function validateReplay(req, res, next) {
  const { rawLog, duration, words } = req.body;

  if (!rawLog || !Array.isArray(rawLog)) {
    return res.status(400).json({ error: "No telemetry log provided" });
  }

  // 1. Simulate the test
  let correctCount = 0;
  let totalTyped = 0;
  const wordChars = words.split("");

  rawLog.forEach((event) => {
    if (event.k === "bksp") return;
    
    if (event.k === wordChars[event.i]) {
      correctCount++;
    }
    totalTyped++;
  });

  // 2. WPM Calculation: (Correct chars / 5) / (duration in minutes)
  const calculatedWpm = (correctCount / 5) / (duration / 60000);
  
  // 3. Bot Detection: Check for inhumanly consistent typing speeds
  // If the standard deviation of time between keystrokes is near zero, it's a bot.
  const intervals = [];
  for (let i = 1; i < rawLog.length; i++) {
    intervals.push(rawLog[i].t - rawLog[i-1].t);
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;

  if (variance < 2 && calculatedWpm > 100) {
    return res.status(403).json({ error: "Inhuman typing consistency detected." });
  }

  // Attach calculated stats to req for the controller to save
  req.validatedStats = {
    wpm: Math.round(calculatedWpm),
    accuracy: Math.round((correctCount / totalTyped) * 100),
    duration
  };

  next();
}