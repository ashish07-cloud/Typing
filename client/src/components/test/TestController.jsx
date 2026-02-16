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
import TestFooter from "./TestFooter";

export default function TestController() {
  const { mode, activeTime, wordLimit, setMode, setActiveTime, setWordLimit } =
    useSettingStore();

  const user = useAuthStore((s) => s.user);
  const addResult = useHistoryStore((s) => s.addResult);

  const [finalStats, setFinalStats] = useState(null);

  const {
    index,
    status,
    correct,
    incorrect,
    totalTyped,
    duration,
    wpm,
    rawWpm,
    accuracy,
    log,
    results,
    handleChar,
    handleBackspace,
    resetEngine,
    finishTest,
    words,
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
      }).catch((err) =>
        console.error("Failed to sync result:", err)
      );
    },
  });

  const { timeLeft, start, resetTimer } = useTimer(
    mode === "time" ? activeTime : null,
    finishTest
  );

  useEffect(() => {
  if (status === "finished") {
    resetTimer();
  }
}, [status, resetTimer]);


  const { wpmTimeline } = useTelemetry({ log, status });

  useEffect(() => {
    if (status === "running") start();
  }, [status, start]);

  const resetAll = useCallback(() => {
    setFinalStats(null);
    resetEngine();
    resetTimer();
  }, [resetEngine, resetTimer]);

  useEffect(() => {
    resetAll();
  }, [mode, activeTime, wordLimit, resetAll]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center py-12 px-4 select-none">
      <TestControls
        mode={mode}
        setMode={setMode}
        activeTime={activeTime}
        setActiveTime={setActiveTime}
        wordLimit={wordLimit}
        setWordLimit={setWordLimit}
        disabled={status === "running"}
      />

      <div className="w-full min-h-[350px] flex items-center justify-center">
        {!finalStats ? (
          <div className="w-full relative animate-in fade-in duration-500">
            <div className="absolute -top-16 left-0 font-mono text-3xl text-main/40">
              {mode === "time"
                ? timeLeft
                : `${index}/${words.length}`}
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

      <TestFooter onRestart={resetAll} />
    </div>
  );
}
