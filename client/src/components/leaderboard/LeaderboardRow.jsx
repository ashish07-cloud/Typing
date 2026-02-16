import { Link } from "react-router-dom";

export default function LeaderboardRow({ rank, entry }) {
  const isTop3 = rank <= 3;
  
  // Rank styling
  const rankStyles = {
    1: {
      bg: "bg-gradient-to-r from-yellow-500/10 to-orange-500/5",
      border: "border-l-4 border-yellow-500",
      text: "text-yellow-600",
      icon: "👑"
    },
    2: {
      bg: "bg-gradient-to-r from-gray-300/10 to-gray-400/5",
      border: "border-l-4 border-gray-400",
      text: "text-gray-600",
      icon: "🥈"
    },
    3: {
      bg: "bg-gradient-to-r from-orange-500/10 to-orange-600/5",
      border: "border-l-4 border-orange-500",
      text: "text-orange-600",
      icon: "🥉"
    }
  };

  const rankStyle = rankStyles[rank] || {
    bg: "hover:bg-dark/3",
    border: "border-l-4 border-transparent",
    text: "text-sub",
    icon: ""
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <tr className={`group transition-all duration-300 ${rankStyle.bg} ${rankStyle.border}`}>
      {/* Rank */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isTop3 ? 'bg-main/10' : 'bg-sub/10'}`}>
            <span className={`text-lg ${isTop3 ? 'text-main font-bold' : 'text-sub'}`}>
              {rankStyle.icon ? `${rank} ${rankStyle.icon}` : rank}
            </span>
          </div>
        </div>
      </td>
      
      {/* User */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-main/10 flex items-center justify-center text-main font-bold">
            {entry.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <Link
              to={`/profile/${entry.username}`}
              className="text-dark font-semibold group-hover:text-main transition-colors"
            >
              {entry.username || "Anonymous"}
            </Link>
            <div className="text-xs text-sub font-mono mt-1">
              {entry.country || "Global"}
            </div>
          </div>
        </div>
      </td>
      
      {/* WPM */}
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className={`text-2xl font-bold ${isTop3 ? 'text-main' : 'text-dark'}`}>
            {entry.wpm}
            <span className="text-sm text-sub ml-2">WPM</span>
          </span>
          <span className="text-xs text-sub font-mono">
            Raw: {entry.rawWpm || entry.wpm}
          </span>
        </div>
      </td>
      
      {/* Accuracy */}
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className={`text-xl font-bold ${entry.accuracy >= 95 ? 'text-green-600' : entry.accuracy >= 90 ? 'text-main' : 'text-sub'}`}>
              {entry.accuracy}%
            </span>
            <div className="w-24 h-2 bg-sub/20 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${entry.accuracy >= 95 ? 'bg-green-500' : entry.accuracy >= 90 ? 'bg-main' : 'bg-sub'}`}
                style={{ width: `${entry.accuracy}%` }}
              ></div>
            </div>
          </div>
          <span className="text-xs text-sub font-mono mt-1">
            {entry.correctChars || 0}/{entry.totalChars || 0} chars
          </span>
        </div>
      </td>
      
      {/* Date */}
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-dark font-medium">
            {formatDate(entry.timestamp)}
          </span>
          <span className="text-xs text-sub font-mono mt-1">
            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </td>
      
      {/* Mode & Details */}
      <td className="px-8 py-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sub/10 text-sub text-xs font-mono uppercase">
          <span>{entry.mode || 'time'}</span>
          <span>•</span>
          <span>{entry.limit || 30}{entry.mode === 'time' ? 's' : 'w'}</span>
        </div>
      </td>
    </tr>
  );
}