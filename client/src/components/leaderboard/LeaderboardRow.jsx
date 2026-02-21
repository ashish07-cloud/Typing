import { Link } from "react-router-dom";
import React from "react";

const LeaderboardRow = ({ rank, entry }) => {
  const isTop3 = rank <= 3;

  // Rank styling with badges
  const rankStyles = {
    1: {
      badge: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30",
      icon: "👑",
      glow: "animate-pulse",
    },
    2: {
      badge: "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md shadow-gray-400/30",
      icon: "🥈",
      glow: "",
    },
    3: {
      badge: "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md shadow-orange-500/30",
      icon: "🥉",
      glow: "",
    },
  };

  const rankStyle = rankStyles[rank] || {
    badge: "bg-sub/10 text-sub",
    icon: "",
    glow: "",
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <tr
      className={`group transition-all duration-300 hover:bg-dark/5 hover:scale-[1.01] hover:shadow-lg ${
        isTop3 ? "bg-gradient-to-r from-main/5 to-transparent" : ""
      }`}
    >
      {/* Rank */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${rankStyle.badge} ${rankStyle.glow}`}
          >
            {rankStyle.icon ? rankStyle.icon : rank}
          </div>
        </div>
      </td>

      {/* User */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-main/20 flex items-center justify-center text-main font-bold border-2 border-main/30 group-hover:border-main transition-colors">
            {entry.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <Link
              to={`/profile/${entry.username}`}
              className="text-dark font-semibold group-hover:text-main transition-colors"
            >
              {entry.username || "Anonymous"}
            </Link>
            <div className="text-xs text-sub font-mono mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-main/50" />
              {entry.country || "Global"}
            </div>
          </div>
        </div>
      </td>

      {/* WPM */}
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span
            className={`text-2xl font-bold ${
              isTop3 ? "text-main" : "text-dark"
            } flex items-baseline gap-1`}
          >
            {entry.wpm}
            <span className="text-sm text-sub font-mono font-normal">WPM</span>
          </span>
          <span className="text-xs text-sub font-mono">Raw: {entry.rawWpm || entry.wpm}</span>
        </div>
      </td>

      {/* Accuracy */}
      <td className="px-8 py-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span
              className={`text-xl font-bold ${
                entry.accuracy >= 95
                  ? "text-green-500"
                  : entry.accuracy >= 90
                  ? "text-main"
                  : "text-sub"
              }`}
            >
              {entry.accuracy}%
            </span>
            <div className="w-24 h-2 bg-sub/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  entry.accuracy >= 95
                    ? "bg-gradient-to-r from-green-400 to-green-500"
                    : entry.accuracy >= 90
                    ? "bg-gradient-to-r from-main to-main/70"
                    : "bg-sub"
                }`}
                style={{ width: `${entry.accuracy}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-sub font-mono">
            {entry.correctChars || 0}/{entry.totalChars || 0} chars
          </span>
        </div>
      </td>

      {/* Date */}
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-dark font-medium">{formatDate(entry.timestamp)}</span>
          <span className="text-xs text-sub font-mono mt-1">
            {new Date(entry.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </td>

      {/* Mode & Details */}
      <td className="px-8 py-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sub/10 text-sub text-xs font-mono uppercase border border-sub/20">
          <span>{entry.mode || "time"}</span>
          <span>•</span>
          <span>
            {entry.limit || 30}
            {entry.mode === "time" ? "s" : "w"}
          </span>
        </div>
      </td>
    </tr>
  );
};

// Memoize to prevent unnecessary re-renders (performance optimization, no logic change)
export default React.memo(LeaderboardRow);