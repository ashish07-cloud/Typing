import { useEffect, useRef, useState } from "react";

import useTypingEngine from "../../hooks/useTypingEngine";
import useTimer from "../../hooks/useTimer";
import useAntiCheat from "../../hooks/useAntiCheat";
import useTelemetry from "../../hooks/useTelemetry";
import { calculateWPM, calculateAccuracy } from "../../utils/analytics";

import useSettingStore from "../../store/settingStore";
import useHistoryStore from "../../store/historyStore";
import useAuthStore from "../../store/authStore";

import TestControls from "./TestControls";
import TypingSection from "./TypingSection";
import ResultsSection from "./ResultSection";
import TestFooter from "./TestFooter";

export default function TestController() {
  // ── SETTINGS (PERSISTED) ────────────────────
  const { mode, activeTime, wordLimit, setMode, setActiveTime, setWordLimit } =
    useSettingStore();

  const user = useAuthStore((s) => s.user);
  const addResult = useHistoryStore((s) => s.addResult);



  // ── TIME TRACKING ───────────────────────────
  const startTimeRef = useRef(null);
  const hasSavedResultRef = useRef(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // ── TIMER (TIME MODE ONLY) ──────────────────
  const { timeLeft, start, resetTimer } = useTimer(
    mode === "time" ? activeTime : null,
  );

  // ── TYPING ENGINE ───────────────────────────
  const { text, typed, cursor, isCompleted, resetTest } = useTypingEngine({
    mode,
    wordLimit,
    isExternallyFinished: timeLeft === 0,
  });

  // ── ANTI-CHEAT ──────────────────────────────
  const { cheatFlags, trackSpeed, resetAntiCheat } = useAntiCheat();

  // ── TEST STATE ──────────────────────────────
  const isTestFinished = (mode === "time" && timeLeft === 0) || isCompleted;

  // ── HANDLE KEYSTROKES (SINGLE EFFECT) ───────
  useEffect(() => {
    if (!typed.length) return;

    // first keystroke
    if (typed.length === 1) {
      startTimeRef.current = Date.now();
      hasSavedResultRef.current = false;

      if (mode === "time") {
        start();
      }
    }

    trackSpeed();
  }, [typed, start, trackSpeed, mode]);

  // ── STOP TIMER & CALCULATE ELAPSED TIME ─────
  useEffect(() => {
    if (!isTestFinished || !startTimeRef.current) return;

    const endTime = Date.now();
    setElapsedTime((endTime - startTimeRef.current) / 1000);
  }, [isTestFinished]);

  // ── STATS ───────────────────────────────────
  const totalChars = typed.length;
  const correctChars = typed.filter((t) => t.correct).length;

  const rawTimeTaken =
  mode === "time"
    ? activeTime - timeLeft
    : elapsedTime;

// prevent 0 or near-0 time
const timeTaken = Math.max(rawTimeTaken, 0.5);


  const wpm = isTestFinished ? calculateWPM(correctChars, timeTaken) : 0;

  const accuracy = isTestFinished
    ? calculateAccuracy(correctChars, totalChars)
    : 100;

  const { wpmTimeline, resetTelemetry } = useTelemetry({
    isRunning: !isTestFinished && typed.length > 0,
    correctChars,
    startTimeRef,
  });

  // ── RESTART HANDLING ────────────────────────
  useEffect(() => {
    const handleRestart = (e) => {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        resetAll();
      }
    };

    window.addEventListener("keydown", handleRestart);
    return () => window.removeEventListener("keydown", handleRestart);
  }, []);

  // ── RESET ON MODE / LIMIT CHANGE ────────────
  useEffect(() => {
    resetAll();
  }, [mode, activeTime, wordLimit]);

  const resetAll = () => {
    resetTest();
    resetTimer();
    resetAntiCheat();
    startTimeRef.current = null;
    hasSavedResultRef.current = false;
    setElapsedTime(0);
    resetTelemetry();
  };

  // saving the history
  useEffect(() => {
    if (!isTestFinished) return;
    if (!typed.length) return;
    if (hasSavedResultRef.current) return;

    hasSavedResultRef.current = true;

    addResult(user, {
  id: crypto.randomUUID(),
  mode,
  limit: mode === "time" ? activeTime : wordLimit,
  wpm: Math.round(wpm),
  accuracy: Math.round(accuracy),
  correctChars,
  totalChars,
  duration: Math.round(timeTaken),
  timestamp: Date.now(),
  cheated: cheatFlags.length > 0,
  telemetry: {
    wpmTimeline,
    duration: Math.round(timeTaken),
  },
});

  }, [
    isTestFinished,
    typed.length,
    wpm,
    accuracy,
    mode,
    activeTime,
    wordLimit,
    cheatFlags.length,
    timeTaken,
    wpmTimeline,
    addResult,
  ]);


  // for seeing the per second wpm in the console 
  useEffect(() => {
  if (wpmTimeline.length) {
    console.log("WPM Timeline:", wpmTimeline);
  }
}, [wpmTimeline]);


  // ── RENDER ──────────────────────────────────
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      <TestControls
        mode={mode}
        setMode={setMode}
        activeTime={activeTime}
        setActiveTime={setActiveTime}
        wordLimit={wordLimit}
        setWordLimit={setWordLimit}
      />

      {!isTestFinished && (
        <TypingSection
          text={text}
          typed={typed}
          cursor={cursor}
          timeLeft={timeLeft}
          isTestFinished={isTestFinished}
        />
      )}

      {isTestFinished && (
        <ResultsSection wpm={wpm} accuracy={accuracy} cheatFlags={cheatFlags} />
      )}

      <TestFooter />
    </div>
  );
}
