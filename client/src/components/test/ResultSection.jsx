import StatsPanel from "../stats/StatsPanel";
import WPMGraph from "../results/WPMGraph";

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
    cheatFlags = []
  } = stats;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Primary Stats Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <StatsPanel wpm={wpm} accuracy={accuracy} />

        {/* ACTION BUTTONS (Crucial for Product UX) */}
        <div className="flex gap-4 font-mono text-xs uppercase tracking-[0.2em]">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-[var(--main-color)] text-[var(--bg-color)] rounded-xl font-bold hover:opacity-80 transition-all hover:scale-105 active:scale-95"
          >
            next test
          </button>
          <button
            className="px-8 py-3 border border-[var(--sub-color)] text-[var(--sub-color)] rounded-xl hover:text-[var(--text-color)] transition-colors"
            onClick={() => window.print()}
          >
            screenshot
          </button>
        </div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80">
        <MetricBox label="test type" value={`${mode} ${limit}`} />
        <MetricBox label="raw wpm" value={rawWpm} />
        <MetricBox label="characters" value={`${correctChars}/${totalChars - correctChars}`} />
        <MetricBox label="time" value={`${Math.round(duration / 1000)}s`} />
      </div>

      {/* Main Visual Data */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-b from-[var(--main-color)]/10 to-transparent rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-[var(--bg-color)]/40 backdrop-blur-md rounded-3xl p-8 border border-[var(--sub-color)]/10 shadow-2xl">
          <WPMGraph timeline={timeline} />
        </div>
      </div>

      {/* Keyboard Instruction */}
      <p className="text-center text-[10px] font-mono text-[var(--sub-color)] uppercase tracking-[0.3em]">
        press <span className="text-[var(--text-color)] font-bold">tab</span> to quickly restart
      </p>

      {/* Anti-Cheat Warning */}
      {cheatFlags.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-[var(--error-color)]/5 border border-[var(--error-color)]/10 rounded-2xl self-center">
          <div className="w-2 h-2 rounded-full bg-[var(--error-color)] animate-pulse" />
          <span className="text-[var(--error-color)]/80 font-mono text-[10px] uppercase tracking-widest">
            Inconsistent timing detected — Result not eligible for leaderboard
          </span>
        </div>
      )}
    </div>
  );
}

// Sub-component for clean rendering
function MetricBox({ label, value }) {
  return (
    <div className="flex flex-col border-l border-[var(--sub-color)]/20 pl-4">
      <span className="text-[var(--sub-color)] font-mono text-[10px] uppercase tracking-widest mb-1">
        {label}
      </span>
      <span className="text-[var(--text-color)] font-mono text-xl font-bold">
        {value}
      </span>
    </div>
  );
}