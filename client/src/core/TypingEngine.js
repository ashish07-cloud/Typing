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
    this.results = {};

    this.correct = 0;
    this.incorrect = 0;
    this.totalTyped = 0;

    // 🔥 Competitive Metrics
    this.totalErrors = 0;
    this.correctedErrors = 0;
    this.uncorrectedErrors = 0;
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

    this.log.push({ k: char, t: now, i: this.index, c: isCorrect });

    // overwrite handling
    if (this.results[this.index] !== undefined) {
      if (this.results[this.index]) this.correct--;
      else this.incorrect--;
    }

    this.results[this.index] = isCorrect;

    if (isCorrect) {
      this.correct++;
    } else {
      this.incorrect++;
      this.totalErrors++; // every mistake ever made
    }

    this.totalTyped++;
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
      if (previous) {
        this.correct--;
      } else {
        this.incorrect--;
        this.correctedErrors++; // mistake fixed
      }

      this.totalTyped--;
    }

    delete this.results[this.index];
    this.log.pop();
  }

  finish(timestamp = Date.now()) {
    if (this.status === "finished") return;

    this.status = "finished";
    this.endTime = timestamp;

    // errors remaining at end
    this.uncorrectedErrors = this.incorrect;
  }

  getDuration() {
    if (!this.startTime) return 0;
    const end = this.status === "finished" ? this.endTime : Date.now();
    return end - this.startTime;
  }

  getRawWPM() {
    const minutes = this.getDuration() / 60000;
    if (minutes <= 0) return 0;
    return Math.round((this.totalTyped / 5) / minutes);
  }

  getNetWPM() {
    const minutes = this.getDuration() / 60000;
    if (minutes <= 0) return 0;

    // competitive style → only uncorrected errors penalize
    const penalty = this.uncorrectedErrors / 5;
    return Math.max(
      0,
      Math.round(((this.totalTyped / 5) - penalty) / minutes)
    );
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
      totalTyped: this.totalTyped,
      duration: this.getDuration(),

      rawWpm: this.getRawWPM(),
      wpm: this.getNetWPM(),
      accuracy: this.getAccuracy(),

      totalErrors: this.totalErrors,
      correctedErrors: this.correctedErrors,
      uncorrectedErrors: this.uncorrectedErrors,

      log: this.log,
      results: this.results,
    };
  }
}