import { useEffect, useRef, useState } from "react";
import HiddenInput from "./HiddenInput";
import Word from "./Word";
import Caret from "./Caret";

export default function TestDisplay({
  text,
  typed,
  cursor,
  timeLeft,
  isTimeUp,
}) {
  const inputRef = useRef(null);
  const typedString = typed.map((t) => t.char).join("");
  const words = text.split(" ");

  const letterRefs = useRef([]);
  const containerRef = useRef(null);

  const [caret, setCaret] = useState({
    x: 0,
    y: 0,
    h: 24,
  });

  // 🧠 DOM-BASED CARET POSITION
  useEffect(() => {
    const el = letterRefs.current[cursor];
    const container = containerRef.current;

    if (!el || !container) return;

    const charRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setCaret({
      x: charRect.left - containerRect.left,
      y: charRect.top - containerRect.top,
      h: charRect.height,
    });
  }, [cursor, text]);

  let charIndex = 0;

  return (
    <div className="relative w-full">
      <HiddenInput inputRef={inputRef} />

      {/* Timer */}
      <div className="mb-3 text-xs text-neutral-500">
        {timeLeft}s
      </div>

      {/* Typing Area */}
      <div
        ref={containerRef}
        className="relative font-mono text-4xl leading-snug text-neutral-300 flex flex-wrap gap-x-2 pointer-events-none"

      >
        {!isTimeUp && (
          <Caret
            x={caret.x}
            y={caret.y}
            height={caret.h}
          />
        )}

        {words.map((word, i) => {
          const typedSlice = typedString.slice(
            charIndex,
            charIndex + word.length
          );

          const isActive =
            cursor >= charIndex &&
            cursor <= charIndex + word.length;

          const startIndex = charIndex;
          charIndex += word.length + 1;

          return (
            <Word
              key={i}
              word={word}
              typed={typedSlice}
              isActive={isActive}
              startIndex={startIndex}
              letterRefs={letterRefs}
            />
          );
        })}
      </div>
    </div>
  );
}
