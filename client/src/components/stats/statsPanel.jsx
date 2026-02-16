export default function StatsPanel({ wpm, accuracy }) {
  return (
    <div className="flex gap-16 select-none">
      <div className="flex flex-col">
        <span className="text-neutral-500 font-mono text-sm uppercase tracking-tighter">wpm</span>
        <span className="text-7xl font-bold text-yellow-500 leading-none">
          {wpm}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-neutral-500 font-mono text-sm uppercase tracking-tighter">acc</span>
        <span className="text-7xl font-bold text-neutral-200 leading-none">
          {accuracy}<span className="text-3xl text-neutral-500">%</span>
        </span>
      </div>
    </div>
  );
}