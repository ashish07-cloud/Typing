export default function StatsPanel({ wpm, accuracy }) {
  return (
    <div className="mt-10 flex gap-12 text-neutral-300">
      <div>
        <div className="text-xs text-neutral-500">wpm</div>
        <div className="text-4xl font-semibold">{wpm}</div>
      </div>

      <div>
        <div className="text-xs text-neutral-500">accuracy</div>
        <div className="text-4xl font-semibold">{accuracy}%</div>
      </div>
    </div>
  );
}
