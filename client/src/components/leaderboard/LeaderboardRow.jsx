export default function LeaderboardRow({ rank, entry }) {
  return (
    <div className="grid grid-cols-5 px-4 py-3 text-sm border-t border-creamy-300">
      <span className="text-olive-500">{rank}</span>

      <span className="text-olive-900 font-medium">
        {entry.user?.username || "Guest"}
      </span>

      <span>{entry.wpm}</span>
      <span>{entry.accuracy}%</span>

      <span className="text-olive-500">
        {new Date(entry.createdAt).toLocaleDateString()}
      </span>
    </div>
  );
}
