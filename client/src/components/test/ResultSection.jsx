import StatsPanel from "../stats/StatsPanel";

export default function ResultsSection({
  wpm,
  accuracy,
  cheatFlags,
}) {
  return (
    <>
      <StatsPanel wpm={wpm} accuracy={accuracy} />

      {cheatFlags.length > 0 && (
        <div className="mt-4 text-xs text-red-600">
          Suspicious activity detected — result not eligible for leaderboard
        </div>
      )}
    </>
  );
}
