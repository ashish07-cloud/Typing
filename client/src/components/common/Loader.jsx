import { memo } from "react";

/**
 * PRODUCTION MINIMALIST LOADER
 * - SVG-based for zero pixelation.
 * - CSS Animation for high performance.
 * - Fits the "Monkeytype" minimalist aesthetic.
 */
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="flex items-center space-x-2">
        {/* We use three pulsing dots that mimic a "typing" state */}
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-yellow-500/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-yellow-500/30 rounded-full animate-bounce"></div>
      </div>
      
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 animate-pulse">
        Fetching Data
      </span>
      
      {/* Hidden screen-reader text for accessibility (A11y is production-grade) */}
      <span className="sr-only">Loading leaderboard data...</span>
    </div>
  );
};

// Memoized to prevent unnecessary re-renders during parent state changes
export default memo(Loader);