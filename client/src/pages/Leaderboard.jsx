import { useState, useEffect, useCallback } from "react";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import axiosClient from "../api/axiosClient.js";

const MODES = ["time", "words"];
const LIMITS = {
  time: [15, 30, 60],
  words: [10, 25, 50],
};

export default function Leaderboard() {
  const [mode, setMode] = useState("time");
  const [limit, setLimit] = useState(30);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/leaderboard?mode=${mode}&limit=${limit}`);
      setData(response.data.results || []);
    } catch (err) {
      console.error("❌ Leaderboard Fetch Error:", err.response || err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [mode, limit]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 animate-in fade-in duration-700">
      {/* Decorative background blur */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-main/5 rounded-full blur-3xl" />
      </div>

      <header className="mb-16">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-5xl font-bold mb-3 tracking-tight bg-gradient-to-r from-main to-main/60 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-sub font-mono text-sm uppercase tracking-[0.3em]">
            Top Performers • {mode} {limit}
          </p>
        </div>

        {/* Filter Controls - refined glass design */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
          {/* Mode Selection */}
          <div className="flex bg-page/50 backdrop-blur-sm p-1 rounded-2xl border border-sub/10 shadow-lg">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setLimit(LIMITS[m][1]);
                }}
                className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  mode === m
                    ? "bg-main text-page shadow-lg shadow-main/30 scale-105"
                    : "text-sub hover:text-dark hover:bg-dark/5"
                }`}
              >
                {m === "time" ? "⏱️ Time Trials" : "📝 Word Count"}
              </button>
            ))}
          </div>

          {/* Limit Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sub text-sm font-mono uppercase tracking-widest">
              Duration:
            </span>
            <div className="flex bg-page/50 backdrop-blur-sm p-1 rounded-xl border border-sub/10 shadow-md">
              {LIMITS[mode].map((l) => (
                <button
                  key={l}
                  onClick={() => setLimit(l)}
                  className={`px-5 py-2 rounded-lg text-sm transition-all ${
                    limit === l
                      ? "bg-main text-page font-bold shadow-inner"
                      : "text-sub hover:text-dark hover:bg-dark/5"
                  }`}
                >
                  {l}
                  {mode === "time" ? "s" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <LeaderboardTable.Skeleton />
      ) : (
        <LeaderboardTable data={data} />
      )}

      {/* Decorative Elements */}
      <div className="mt-16 pt-8 border-t border-sub/10">
        <div className="text-center text-sub text-sm font-mono">
          <p>Leaderboard updates every 5 minutes • Last updated: Just now</p>
          <p className="mt-2 opacity-70">Compete with typists worldwide in real-time</p>
        </div>
      </div>
    </div>
  );
}