// ANTI CHEAT - Re calculates WPM from keystroke timestamps 

export default function validateReplay(req, res, next) {
  const { duration, rawLength, correctChars } = req.body;

  if (
    typeof duration !== "number" ||
    typeof rawLength !== "number" ||
    typeof correctChars !== "number"
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (duration < 10 || duration > 180) {
    return res.status(400).json({ error: "Invalid duration" });
  }

  if (correctChars > rawLength) {
    return res.status(400).json({ error: "Invalid character data" });
  }

  next();
}
