import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";

export default function Leaderboard() {
  const [mode, setMode] = useState("time");
  const [limit, setLimit] = useState(60);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/leaderboard?mode=${mode}&limit=${limit}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [mode, limit]);

  return (
    <div className="min-h-screen bg-creamy-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-2xl font-semibold text-olive-900">
          Leaderboard
        </h1>

        {/* Filters */}
        <div className="flex gap-6 text-sm">
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setLimit(e.target.value === "time" ? 60 : 25);
            }}
            className="bg-creamy-50 border border-olive-200 px-2 py-1 rounded"
          >
            <option value="time">Time</option>
            <option value="words">Words</option>
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-creamy-50 border border-olive-200 px-2 py-1 rounded"
          >
            {mode === "time"
              ? [15, 30, 60, 120].map((t) => (
                  <option key={t} value={t}>
                    {t}s
                  </option>
                ))
              : [10, 25, 50, 100].map((w) => (
                  <option key={w} value={w}>
                    {w} words
                  </option>
                ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-olive-600">Loading…</p>
        ) : (
          <LeaderboardTable data={data} />
        )}
      </div>
    </div>
  );
}
