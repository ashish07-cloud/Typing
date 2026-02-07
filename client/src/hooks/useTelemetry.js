import { useEffect, useRef, useState } from "react";

/**
 * Frontend telemetry collector
 * - Records per-second WPM snapshots
 * - Safe for React StrictMode
 */
export default function useTelemetry({
  isRunning,
  correctChars,
  startTimeRef,
}) {
  const [wpmTimeline, setWpmTimeline] = useState([]);

  const intervalRef = useRef(null);
  const lastCharCountRef = useRef(0);

  useEffect(() => {
    if (!isRunning || !startTimeRef.current) return;

    // start heartbeat
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - startTimeRef.current) / 1000;

      if (elapsedSeconds <= 0) return;

      const charsTypedThisSecond = correctChars - lastCharCountRef.current;

      lastCharCountRef.current = correctChars;

      const instantWPM = (charsTypedThisSecond / 5) * 60;

      setWpmTimeline((prev) => [...prev, Math.round(instantWPM)]);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      // final snapshot for short tests
      if (correctChars > lastCharCountRef.current && startTimeRef.current) {
        const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;

        if (elapsedSeconds > 0) {
          const finalWPM = (correctChars / 5 / elapsedSeconds) * 60;

          setWpmTimeline((prev) =>
            prev.length === 0 ? [Math.round(finalWPM)] : prev,
          );
        }
      }
    };
  }, [isRunning, correctChars, startTimeRef]);

  const resetTelemetry = () => {
    setWpmTimeline([]);
    lastCharCountRef.current = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  //   console.log("Instant WPM:", instantWPM);

  return {
    wpmTimeline,
    resetTelemetry,
  };
}
