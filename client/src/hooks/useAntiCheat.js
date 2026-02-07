import { useRef, useState } from "react";

export default function useAntiCheat() {
  const [cheatFlags, setCheatFlags] = useState([]);

  const speedRef = useRef([]);
  const spikeCountRef = useRef(0);
  const startTimeRef = useRef(null);

  const flagCheat = (reason) => {
    setCheatFlags((prev) =>
      prev.includes(reason) ? prev : [...prev, reason]
    );
  };

  // Call this on every keystroke
  const trackSpeed = () => {
    const now = Date.now();

    // initialize start time on first keystroke
    if (!startTimeRef.current) {
      startTimeRef.current = now;
      return;
    }

    // ignore first 1.5s (human acceleration phase)
    if (now - startTimeRef.current < 1500) {
      return;
    }

    // record keystroke
    speedRef.current.push(now);

    // keep last 1 second window
    speedRef.current = speedRef.current.filter(
      (t) => now - t < 1000
    );

    // sustained spike detection
    if (speedRef.current.length > 30) {
      spikeCountRef.current += 1;
    } else {
      // decay instead of reset (human-friendly)
      spikeCountRef.current = Math.max(
        0,
        spikeCountRef.current - 1
      );
    }

    // require repeated spikes to flag
    if (spikeCountRef.current >= 3) {
      flagCheat("speed_spike");
    }
  };

  const resetAntiCheat = () => {
    setCheatFlags([]);
    speedRef.current = [];
    spikeCountRef.current = 0;
    startTimeRef.current = null;
  };

  return {
    cheatFlags,
    trackSpeed,
    resetAntiCheat,
  };
}
