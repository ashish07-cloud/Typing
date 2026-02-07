import LeaderboardRow from "./LeaderboardRow";

export default function LeaderboardTable({ data }) {
  if (!data.length) {
    return (
      <p className="text-olive-600">
        No results yet for this mode.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-creamy-300 bg-creamy-100">
      <div className="grid grid-cols-5 px-4 py-2 text-sm text-olive-600 font-medium">
        <span>#</span>
        <span>User</span>
        <span>WPM</span>
        <span>Accuracy</span>
        <span>Date</span>
      </div>

      {data.map((entry, index) => (
        <LeaderboardRow
          key={entry._id}
          rank={index + 1}
          entry={entry}
        />
      ))}
    </div>
  );
}
