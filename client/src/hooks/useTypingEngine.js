import { useState, useEffect } from "react";

export default function useTypingEngine({
  mode,
  wordLimit,
  isExternallyFinished,
}) {
  const [text, setText] = useState(
    "the quick brown fox jumps over the lazy dog typing consistently helps improve speed accuracy and muscle memory focus on accuracy before speed and maintain a steady rhythm while typing practice daily to see improvement"
  );

  const [typed, setTyped] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // 🔹 Count completed words
  const completedWords = typed
    .map((t) => t.char)
    .join("")
    .trim()
    .split(" ")
    .filter(Boolean).length;

  // ⌨️ Key handling
  useEffect(() => {
    if (isExternallyFinished || isCompleted) return;

    const handleKeyDown = (e) => {
      if (e.key.length !== 1 && e.key !== "Backspace") return;

      if (e.key === "Backspace") {
        if (cursor === 0) return;
        setTyped((prev) => prev.slice(0, -1));
        setCursor((c) => c - 1);
        return;
      }

      const expectedChar = text[cursor];
      const isCorrect = e.key === expectedChar;

      setTyped((prev) => [...prev, { char: e.key, correct: isCorrect }]);
      setCursor((c) => c + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cursor, text, isExternallyFinished, isCompleted]);

  // 🧠 Completion logic
  useEffect(() => {
    if (mode === "time" && cursor >= text.length) {
      setIsCompleted(true);
    }

    if (mode === "words" && completedWords >= wordLimit) {
      setIsCompleted(true);
    }
  }, [cursor, completedWords, mode, wordLimit, text.length]);

  const resetTest = () => {
    setTyped([]);
    setCursor(0);
    setIsCompleted(false);
  };

  return {
    text,
    typed,
    cursor,
    completedWords,
    isCompleted,
    resetTest,
  };
}
