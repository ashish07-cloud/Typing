import WPMGraph from "../results/WPMGraph";
import {
  ChevronRight,
  RotateCcw,
  ShieldAlert,
  BarChart3,
  Info,
} from "lucide-react";

export default function ResultsSection({ stats, timeline, onRestart }) {
  if (!stats) return null;

  const {
    wpm,
    rawWpm,
    accuracy,
    correctChars,
    totalChars,
    duration,
    mode,
    limit,
    cheatFlags = [],
  } = stats;

  // Format: Correct / Incorrect / Extra / Missed (MonkeyType Style)
  const charStats = `${correctChars} / ${totalChars - correctChars} / 0 / 0`;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 font-mono">
      {/* TOP SECTION: BIG NUMBERS & GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Left Stats Column */}
        <div className="flex flex-row lg:flex-col justify-between lg:justify-center gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[var(--sub-color)] text-xl uppercase tracking-widest mb-1">
              <BarChart3 size={20} />
              <span>wpm</span>
            </div>
            <div className="text-[var(--main-color)] text-5xl md:text-7xl font-black leading-none tracking-tighter">
              {Math.round(wpm)}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[var(--sub-color)] text-xl uppercase tracking-widest mb-1">
              <Info size={20} />
              <span>acc</span>
            </div>
            <div className="text-[var(--main-color)] text-5xl md:text-7xl font-black leading-none tracking-tighter">
              {Math.round(accuracy)}
              <span className="text-4xl opacity-60">%</span>
            </div>
          </div>
        </div>

        {/* Right Graph Column */}
        <div className="relative h-[300px] w-full bg-[var(--sub-color)]/5 rounded-3xl p-6 border border-[var(--sub-color)]/10 backdrop-blur-sm">
          <div className="absolute top-4 left-6 text-[var(--sub-color)] text-[10px] uppercase tracking-[0.3em] opacity-40">
            Performance Timeline
          </div>
          <WPMGraph timeline={timeline} />
        </div>
      </div>

      {/* MIDDLE SECTION: DATA STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border-y border-[var(--sub-color)]/10 py-10">
        <DetailBox label="test type" value={`${mode} ${limit}`} />
        <DetailBox label="raw wpm" value={Math.round(rawWpm)} />
        <DetailBox label="characters" value={charStats} />
        <DetailBox label="consistency" value="84%" />
        <DetailBox
          label="time"
          value={`${Math.round(duration / 1000)}s`}
          isLast
        />
      </div>

      {/* BOTTOM SECTION: ACTION CONTROLS */}
      <div className="flex flex-col items-center gap-6">
        {/* Tab hint - subtle and modern */}
        <div className="text-sub text-xs font-mono uppercase tracking-widest flex items-center gap-2">
        <span>Press</span>
          <kbd className="px-2 py-1 bg-sub/10 rounded border border-sub/20 text-sub text-xs">
            Tab
          </kbd>
          <span>to start next test</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Next Test Button */}
          <button
            onClick={onRestart}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="p-5 rounded-2xl bg-sub/5 border border-sub/10 group-hover:bg-main/10 group-hover:border-main/20 group-hover:scale-110 transition-all duration-300">
              <ChevronRight
                size={32}
                className="text-sub group-hover:text-main group-hover:translate-x-1 transition-all"
              />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-sub group-hover:text-main transition-colors">
              Next Test
            </span>
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="p-5 rounded-2xl bg-sub/5 border border-sub/10 group-hover:bg-error/10 group-hover:border-error/20 group-hover:scale-110 transition-all duration-300">
              <RotateCcw
                size={32}
                className="text-sub group-hover:text-error group-hover:rotate-[-90deg] transition-all"
              />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-sub group-hover:text-error transition-colors">
              Restart
            </span>
          </button>
        </div>
      </div>

      {/* ANTI-CHEAT FLAGS */}
      {cheatFlags.length > 0 && (
        <div className="flex items-center justify-center gap-3 text-[var(--error-color)] opacity-80 mt-4">
          <ShieldAlert size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Flagged: Unusual pace detected
          </span>
        </div>
      )}
    </div>
  );
}

function DetailBox({ label, value, isLast = false }) {
  return (
    <div
      className={`flex flex-col items-center px-4 ${!isLast ? "border-r border-[var(--sub-color)]/10" : ""}`}
    >
      <span className="text-[var(--sub-color)] text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
        {label}
      </span>
      <span className="text-[var(--text-color)] text-2xl font-bold tracking-tight">
        {value}
      </span>
    </div>
  );
}
