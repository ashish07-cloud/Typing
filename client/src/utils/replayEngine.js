// captures keystrokes + timestapms for backend 

/**
 * PRODUCTION REPLAY ENGINE
 * Reconstructs a test state based on a raw telemetry log.
 */
export class ReplayEngine {
  constructor(rawLog, onUpdate) {
    this.rawLog = rawLog; // [{k, t, i, c}, ...]
    this.onUpdate = onUpdate;
    this.currentIndex = 0;
    this.playbackSpeed = 1;
    this.virtualInputLog = [];
    this.virtualIndex = 0;
  }

  // Gets the state of the replay at a specific millisecond
  getStateAtTime(timestamp) {
    const relevantEvents = this.rawLog.filter(event => event.t <= timestamp);
    
    // Efficiently reconstruct the log up to this point
    const virtualLog = [];
    let virtualIdx = 0;

    relevantEvents.forEach(event => {
      if (event.k === "bksp") {
        virtualLog.pop();
        virtualIdx = Math.max(0, virtualIdx - 1);
      } else {
        virtualLog.push(event);
        virtualIdx++;
      }
    });

    return {
      inputLog: virtualLog,
      index: virtualIdx
    };
  }
}