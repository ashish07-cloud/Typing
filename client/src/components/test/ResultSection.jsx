import WPMGraph from "../results/WPMGraph";
import { ChevronRight, RotateCcw, ShieldAlert, BarChart3, Info } from "lucide-react";

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

  const charStats = `${correctChars} / ${totalChars - correctChars} / 0 / 0`;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 md:gap-12 py-6 md:py-12 px-4 font-mono animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION: Big Stats & Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 md:gap-12">
        
        {/* Left: Hero Metrics (Stacked on mobile, side-by-side on lg) */}
        <div className="flex flex-row lg:flex-col justify-around lg:justify-center gap-4 md:gap-10">
          <div className="flex flex-col items-center lg:items-start transition-transform hover:scale-105">
            <div className="flex items-center gap-2 text-[var(--sub-color)] mb-1">
              <BarChart3 size={16} className="md:w-5 md:h-5" />
              <span className="text-sm md:text-xl uppercase tracking-[0.2em]">wpm</span>
            </div>
            <div className="text-[var(--main-color)] text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter">
              {Math.round(wpm)}
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start transition-transform hover:scale-105">
            <div className="flex items-center gap-2 text-[var(--sub-color)] mb-1">
              <Info size={16} className="md:w-5 md:h-5" />
              <span className="text-sm md:text-xl uppercase tracking-[0.2em]">acc</span>
            </div>
            <div className="text-[var(--main-color)] text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter">
              {Math.round(accuracy)}<span className="text-2xl md:text-4xl ml-1">%</span>
            </div>
          </div>
        </div>

        {/* Right: Graph Container */}
        <div className="relative h-[220px] md:h-[320px] w-full bg-[var(--sub-color)]/5 rounded-2xl p-4 md:p-6 border border-[var(--sub-color)]/10">
           <div className="absolute top-2 left-4 md:top-4 md:left-6 text-[var(--sub-color)] text-[8px] md:text-[10px] uppercase tracking-widest opacity-50">
             Performance Timeline
           </div>
           <WPMGraph timeline={timeline} />
        </div>
      </div>

      {/* MIDDLE SECTION: Detailed Grid */}
      {/* Mobile: 2 columns | Tablet: 3 columns | Desktop: 5 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-8 gap-x-4 border-y border-[var(--sub-color)]/10 py-6 md:py-8">
        <DetailBox label="test type" value={`${mode} ${limit}`} />
        <DetailBox label="raw wpm" value={Math.round(rawWpm)} />
        <DetailBox label="characters" value={charStats} />
        <DetailBox label="consistency" value="84%" /> 
        <DetailBox label="time" value={`${Math.round(duration / 1000)}s`} isLast />
      </div>

      {/* FOOTER SECTION: Controls & Hints */}
      <div className="flex flex-col items-center gap-6 md:gap-8">
        <div className="flex items-center gap-8 md:gap-16">
          <button
            onClick={onRestart}
            className="flex flex-col items-center gap-3 text-[var(--sub-color)] hover:text-[var(--main-color)] transition-all duration-300 group"
          >
            <div className="p-3 md:p-4 rounded-full bg-[var(--sub-color)]/5 group-hover:bg-[var(--main-color)]/10 transition-colors">
              <ChevronRight size={24} className="md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[8px] md:text-xs uppercase tracking-[0.3em] font-bold">Next Test</span>
          </button>

          <button
            onClick={onRestart}
            className="flex flex-col items-center gap-3 text-[var(--sub-color)] hover:text-[var(--error-color)] transition-all duration-300 group"
          >
            <div className="p-3 md:p-4 rounded-full bg-[var(--sub-color)]/5 group-hover:bg-[var(--error-color)]/10 transition-colors">
              <RotateCcw size={24} className="md:w-8 md:h-8 group-hover:rotate-[-90deg] transition-transform" />
            </div>
            <span className="text-[8px] md:text-xs uppercase tracking-[0.3em] font-bold">Restart</span>
          </button>
        </div>

        {/* Keyboard Shortcut Hint - Hidden on touch devices */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[var(--sub-color)]/5 rounded-lg border border-[var(--sub-color)]/10">
          <span className="text-[var(--sub-color)] text-[10px] uppercase tracking-[0.2em]">
            Press <kbd className="bg-[var(--sub-color)] text-[var(--bg-color)] px-1.5 py-0.5 rounded mx-1 font-sans">Tab</kbd> to quickly restart
          </span>
        </div>
      </div>

      {/* Warnings */}
      {cheatFlags.length > 0 && (
        <div className="flex items-center justify-center gap-2 md:gap-3 text-[var(--error-color)] animate-pulse px-4 text-center">
          <ShieldAlert size={14} />
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold">
            Flagged: Inconsistent pace detected.
          </span>
        </div>
      )}
    </div>
  );
}

function DetailBox({ label, value, isLast = false }) {
  return (
    <div className={`flex flex-col items-center px-2 md:px-6 ${!isLast ? 'md:border-r border-[var(--sub-color)]/10' : ''}`}>
      <span className="text-[var(--sub-color)] text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-1 md:mb-2 font-semibold">
        {label}
      </span>
      <span className="text-[var(--text-color)] text-lg md:text-2xl font-bold tracking-tight text-center">
        {value}
      </span>
    </div>
  );
}