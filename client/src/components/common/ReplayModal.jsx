import { useMemo } from "react";
import useReplay from "../../hooks/useReplay";
import TestDisplay from "../typing-engine/TestDisplay";
import Modal from "./Modal"; // Your existing Modal component

export default function ReplayModal({ isOpen, onClose, testData }) {
  const { rawLog, duration, words } = testData;
  
  const { playbackTime, isPlaying, togglePlay, seek, speed, setSpeed } = useReplay(rawLog, duration);

  // Derive the UI state from the current playback time
  const virtualState = useMemo(() => {
    const log = [];
    let idx = 0;
    
    // Reconstruct the state up to the current playbackTime
    for (const event of rawLog) {
      if (event.t > playbackTime) break;
      if (event.k === "bksp") {
        log.pop();
        idx = Math.max(0, idx - 1);
      } else {
        log.push(event);
        idx++;
      }
    }
    return { log, idx };
  }, [playbackTime, rawLog]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Test Replay">
      <div className="p-8 bg-neutral-900 rounded-3xl border border-white/5 font-mono">
        
        {/* REPLAY DISPLAY */}
        <div className="mb-12 opacity-80 pointer-events-none scale-90">
          <TestDisplay 
            words={words} 
            index={virtualState.idx} 
            inputLog={virtualState.log} 
            status="running" 
          />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-4 bg-black/40 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>{Math.round(playbackTime)}ms</span>
            <span>{Math.round(duration)}ms</span>
          </div>

          {/* Scrub Bar */}
          <input 
            type="range" 
            min="0" 
            max={duration} 
            value={playbackTime} 
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />

          <div className="flex items-center justify-center gap-8 mt-4">
            <button onClick={() => setSpeed(speed === 1 ? 2 : 1)} className="text-xs text-neutral-500 hover:text-white uppercase tracking-widest">
              {speed}x Speed
            </button>
            
            <button 
                onClick={togglePlay} 
                className="w-12 h-12 flex items-center justify-center bg-yellow-500 rounded-full text-black hover:scale-110 transition-transform"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button onClick={() => seek(0)} className="text-xs text-neutral-500 hover:text-white uppercase tracking-widest">
              Restart
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}