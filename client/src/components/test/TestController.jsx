import { useCallback, useEffect, useState } from "react";
import useTypingEngine from "../../hooks/useTypingEngine";
import useTimer from "../../hooks/useTimer";
import useTelemetry from "../../hooks/useTelemetry";
import useSettingStore from "../../store/settingStore";
import useHistoryStore from "../../store/historyStore";
import useAuthStore from "../../store/authStore";

import TestControls from "./TestControls";
import TestDisplay from "../typing-engine/TestDisplay";
import ResultsSection from "./ResultSection";

export default function TestController() {
  const { mode, activeTime, wordLimit, setMode, setActiveTime, setWordLimit } =
    useSettingStore();

  const user = useAuthStore((s) => s.user);
  const addResult = useHistoryStore((s) => s.addResult);
  const [finalStats, setFinalStats] = useState(null);

  const {
    index,
    status,
    results,
    handleChar,
    handleBackspace,
    resetEngine,
    finishTest,
    words,
    log,
  } = useTypingEngine({
    mode,
    limit: mode === "time" ? activeTime : wordLimit,
    onComplete: (snapshot) => {
      const statsPackage = {
        wpm: snapshot.wpm,
        rawWpm: snapshot.rawWpm,
        accuracy: snapshot.accuracy,
        duration: snapshot.duration,
        correctChars: snapshot.correct,
        totalChars: snapshot.totalTyped,
        mode,
        limit: mode === "time" ? activeTime : wordLimit,
        timestamp: Date.now(),
      };

      setFinalStats(statsPackage);

      addResult(user, {
        id: crypto.randomUUID(),
        ...statsPackage,
        rawLog: snapshot.log,
      }).catch((err) => console.error("Failed to sync result:", err));
    },
  });

  const { timeLeft, start, resetTimer } = useTimer(
    mode === "time" ? activeTime : null,
    finishTest
  );

  const { wpmTimeline } = useTelemetry({ log, status });

  const resetAll = useCallback(() => {
    setFinalStats(null);
    resetEngine();
    resetTimer();
  }, [resetEngine, resetTimer]);

  // GLOBAL TAB KEY RESTART
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent focus switching
        resetAll();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetAll]);

  useEffect(() => {
    if (status === "finished") resetTimer();
  }, [status, resetTimer]);

  useEffect(() => {
    if (status === "running") start();
  }, [status, start]);

  useEffect(() => {
    resetAll();
  }, [mode, activeTime, wordLimit, resetAll]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center px-4 select-none">
      {/* Test Controls (Hides during test for focus) */}
      <div className={`transition-opacity duration-300 ${status === 'running' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <TestControls
          mode={mode}
          setMode={setMode}
          activeTime={activeTime}
          setActiveTime={setActiveTime}
          wordLimit={wordLimit}
          setWordLimit={setWordLimit}
          disabled={status === "running"}
        />
      </div>

      <div className="w-full flex items-center justify-center min-h-[400px]">
        {!finalStats ? (
          <div className="w-full relative py-20">
            {/* Timer / Counter Display */}
            <div className="absolute top-0 left-4 font-mono text-3xl text-[var(--main-color)] transition-opacity">
              {status === "running" && (
                mode === "time" ? timeLeft : `${index}/${words.length}`
              )}
            </div>

            <TestDisplay
              words={words}
              index={index}
              results={results}
              status={status}
              handleChar={handleChar}
              handleBackspace={handleBackspace}
            />
          </div>
        ) : (
          <ResultsSection
            stats={finalStats}
            timeline={wpmTimeline}
            onRestart={resetAll}
          />
        )}
      </div>
    </div>
  );
}