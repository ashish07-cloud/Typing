export default class TypingEngine {
  constructor(text, mode, limit) {
    this.text = text;
    this.mode = mode;
    this.limit = limit;

    this.reset();
  }

  reset() {
    this.index = 0;
    this.status = "idle";
    this.startTime = null;
    this.endTime = null;

    this.log = [];
    this.results = {}; // ✅ important

    this.correct = 0;
    this.incorrect = 0;
    this.totalTyped = 0; // ✅ important
  }

  processChar(char) {
    if (this.status === "finished") return;

    const now = Date.now();

    if (this.status === "idle") {
      this.status = "running";
      this.startTime = now;
    }

    const expected = this.text[this.index];
    const isCorrect = char === expected;

    // log keystroke
    this.log.push({ k: char, t: now, i: this.index, c: isCorrect });

    // if overwriting existing index
    if (this.results[this.index] !== undefined) {
      if (this.results[this.index]) this.correct--;
      else this.incorrect--;
    }

    this.results[this.index] = isCorrect;

    if (isCorrect) this.correct++;
    else this.incorrect++;

    this.totalTyped++; // ✅ important

    this.index++;

    if (this.index >= this.text.length) {
      this.finish(now);
    }
  }

  processBackspace() {
    if (this.index === 0 || this.status === "finished") return;

    this.index--;

    const previous = this.results[this.index];

    if (previous !== undefined) {
      if (previous) this.correct--;
      else this.incorrect--;
      this.totalTyped--; // ✅ important
    }

    delete this.results[this.index];
    this.log.pop();
  }

  finish(timestamp = Date.now()) {
    if (this.status === "finished") return;

    this.status = "finished";
    this.endTime = timestamp;
  }

  getDuration() {
    if (!this.startTime) return 0;

    const end = this.status === "finished" ? this.endTime : Date.now();

    return end - this.startTime;
  }

  getWPM() {
    const durationMinutes = this.getDuration() / 60000;
    if (durationMinutes <= 0) return 0;

    return Math.round(this.correct / 5 / durationMinutes);
  }

  getRawWPM() {
    const durationMinutes = this.getDuration() / 60000;
    if (durationMinutes <= 0) return 0;

    return Math.round(this.totalTyped / 5 / durationMinutes);
  }

  getAccuracy() {
    if (this.totalTyped === 0) return 100;

    return Math.round((this.correct / this.totalTyped) * 100);
  }

  getSnapshot() {
    return {
      index: this.index,
      status: this.status,
      correct: this.correct,
      incorrect: this.incorrect,
      totalTyped: this.correct + this.incorrect,
      duration: this.getDuration(),
      wpm: this.getWPM(),
      rawWpm: this.getRawWPM(),
      accuracy: this.getAccuracy(),
      log: this.log,
      results: this.results,
    };
  }
}
