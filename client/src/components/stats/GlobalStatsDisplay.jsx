import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function GlobalStatsDisplay() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosClient.get("/stats/global")
      .then(res => setStats(res.data.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return null;

  return (
    <div className="flex gap-12 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 py-8">
      <div className="flex flex-col">
        <span className="text-neutral-600">tests_taken</span>
        <span className="text-neutral-300 text-sm mt-1">
            {stats.totalTestsCompleted.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-neutral-600">chars_typed</span>
        <span className="text-neutral-300 text-sm mt-1">
            {(stats.totalCharsTyped / 1000000).toFixed(2)}M
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-neutral-600">time_typing</span>
        <span className="text-neutral-300 text-sm mt-1">
            {Math.floor(stats.totalTimeSeconds / 3600)}h
        </span>
      </div>
    </div>
  );
}