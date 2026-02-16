import { useRef, useState, useEffect, useCallback } from "react";
import TypingEngine from "../core/TypingEngine";
import { generateWords } from "../utils/wordGenerator";

export default function useTypingEngine({ mode, limit, onComplete }) {
  const engineRef = useRef(null);
  const wordsRef = useRef([]);
  const onCompleteRef = useRef(onComplete);

  const [snapshot, setSnapshot] = useState({
    index: 0,
    status: "idle",
    correct: 0,
    incorrect: 0,
    totalTyped: 0,
    duration: 0,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    log: [],
    results: {},
  });

  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const generatedWords =
      mode === "words" ? generateWords(limit) : generateWords(100);

    wordsRef.current = generatedWords;

    const text = generatedWords.join(" ");

    engineRef.current = new TypingEngine(text, mode, limit);

    setSnapshot(engineRef.current.getSnapshot());
  }, [mode, limit, resetKey]);

  const updateSnapshot = useCallback(() => {
    if (!engineRef.current) return;

    const snap = engineRef.current.getSnapshot();
    setSnapshot(snap);

    if (snap.status === "finished" && onCompleteRef.current) {
      onCompleteRef.current(snap);
    }
  }, []);

  const handleChar = useCallback(
    (char) => {
      if (!engineRef.current) return;
      engineRef.current.processChar(char);
      updateSnapshot();
    },
    [updateSnapshot]
  );

  const handleBackspace = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.processBackspace();
    updateSnapshot();
  }, [updateSnapshot]);

  const finishTest = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.finish();
    updateSnapshot();
  }, [updateSnapshot]);

  const resetEngine = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  return {
    ...snapshot,
    words: wordsRef.current,
    handleChar,
    handleBackspace,
    finishTest,
    resetEngine,
  };
}
