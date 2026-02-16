import { useMemo } from "react";

export default function useTelemetry({ log = [], status }) {
  const safeLog = Array.isArray(log) ? log : [];

  const wpmTimeline = useMemo(() => {
    if (safeLog.length === 0) return [];

    const startTime = safeLog[0]?.t;
    const lastTime = safeLog[safeLog.length - 1]?.t;

    if (!startTime || !lastTime) return [];

    const totalSeconds = Math.floor((lastTime - startTime) / 1000);
    if (totalSeconds <= 1) return [];

    const rawTimeline = [];

    for (let s = 1; s <= totalSeconds; s++) {
      const timeWindow = startTime + s * 1000;

      const correctChars = safeLog.filter(
        (entry) => entry.t <= timeWindow && entry.c === true
      ).length;

      const wpm = Math.round((correctChars / 5) / (s / 60));
      rawTimeline.push(wpm);
    }

    // 🔥 Smooth with 3-point moving average
    const smoothed = rawTimeline.map((_, i, arr) => {
      const prev = arr[i - 1] || arr[i];
      const curr = arr[i];
      const next = arr[i + 1] || arr[i];
      return Math.round((prev + curr + next) / 3);
    });

    return smoothed;
  }, [safeLog, status]);

  return { wpmTimeline };
}
