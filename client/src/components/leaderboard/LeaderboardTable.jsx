import LeaderboardRow from "./LeaderboardRow";
import React from "react";

export default function LeaderboardTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 bg-page/50 rounded-3xl border-2 border-dashed border-sub/20 backdrop-blur-sm animate-in fade-in zoom-in">
        <div className="inline-block p-4 mb-4 rounded-full bg-sub/10 animate-pulse">
          <span className="text-5xl">🏆</span>
        </div>
        <h3 className="text-dark text-xl font-bold mb-2">No Rankings Yet</h3>
        <p className="text-sub font-mono max-w-md mx-auto">
          Be the first to set a record in this category! Complete a typing test to appear here.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-3 bg-main text-page rounded-xl font-medium hover:bg-main/90 transition-all shadow-lg shadow-main/20 hover:shadow-xl hover:scale-105"
        >
          Take a Test
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sub/10 bg-page/40 backdrop-blur-md shadow-2xl transition-all hover:shadow-main/5">
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-main/5 via-transparent to-sub/5 pointer-events-none" />

      {/* Table Header with minimal design */}
      <div className="relative border-b border-sub/10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <span className="text-2xl">⚡</span> Top Performers
              </h2>
              <p className="text-sub text-sm font-mono mt-1">
                Ranked by speed and accuracy
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-sub">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-main animate-pulse" />
                <span>WPM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sub" />
                <span>Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="w-full">
          <thead>
            <tr className="text-sub font-mono text-xs uppercase tracking-[0.2em] border-b border-sub/10">
              <th className="px-8 py-5 font-medium text-left">Rank</th>
              <th className="px-8 py-5 font-medium text-left">Typist</th>
              <th className="px-8 py-5 font-medium text-left">Speed</th>
              <th className="px-8 py-5 font-medium text-left">Accuracy</th>
              <th className="px-8 py-5 font-medium text-left">Date</th>
              <th className="px-8 py-5 font-medium text-left">Mode</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <LeaderboardRow key={row._id || index} rank={index + 1} entry={row} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-8 py-4 border-t border-sub/10 bg-page/30 text-sub text-sm font-mono flex justify-between items-center">
        <span>Showing {data.length} results</span>
        <span className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-main" />
          </span>
          Live
        </span>
      </div>
    </div>
  );
}

// Skeleton loader – matches table structure for a smooth transition
LeaderboardTable.Skeleton = function Skeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-sub/10 bg-page/40 backdrop-blur-md shadow-2xl">
      <div className="border-b border-sub/10 px-8 py-6">
        <div className="h-6 w-40 bg-sub/20 rounded animate-pulse" />
        <div className="h-4 w-56 bg-sub/10 rounded mt-2 animate-pulse" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sub/10">
              {[...Array(6)].map((_, i) => (
                <th key={i} className="px-8 py-5">
                  <div className="h-4 w-16 bg-sub/10 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-sub/5">
                {[...Array(6)].map((_, colIdx) => (
                  <td key={colIdx} className="px-8 py-5">
                    <div className="h-5 w-full max-w-[100px] bg-sub/10 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-4 border-t border-sub/10">
        <div className="h-4 w-32 bg-sub/10 rounded animate-pulse" />
      </div>
    </div>
  );
};