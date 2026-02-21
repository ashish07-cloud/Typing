import { useEffect, useRef, useCallback, useLayoutEffect, useState } from "react";
import Caret from "./Caret";
import Word from "./Word";
import HiddenInput from "./HiddenInput";

export default function TestDisplay({ words, index, results, status, handleChar, handleBackspace }) {
  const containerRef = useRef(null);
  const wordsWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const letterRefs = useRef({});
  const [marginOffset, setMarginOffset] = useState(0);

  useEffect(() => {
    if (status !== "finished") inputRef.current?.focus();
  }, [status]);

  useEffect(() => {
    letterRefs.current = {};
    setMarginOffset(0);
  }, [words]);

  const setLetterRef = useCallback((idx, el) => {
    if (el) letterRefs.current[idx] = el;
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const activeLetter = letterRefs.current[index];

    if (!container || !activeLetter) return;

    const updateCaret = () => {
      const containerRect = container.getBoundingClientRect();
      const letterRect = activeLetter.getBoundingClientRect();

      // Calculate position relative to container
      const x = letterRect.left - containerRect.left;
      const y = letterRect.top - containerRect.top;

      container.style.setProperty("--caret-x", `${x}px`);
      container.style.setProperty("--caret-y", `${y}px`);

      // Line Shifting Logic
      const activeWord = activeLetter.closest(".word-wrapper");
      if (activeWord) {
        const wordTop = activeWord.offsetTop;
        const wordHeight = activeWord.offsetHeight;
        const gap = 12; // gap-y-3
        const lineHeight = wordHeight + gap;

        // MonkeyType behavior: shift when moving to line 3
        if (wordTop > lineHeight) {
          setMarginOffset(-(wordTop - lineHeight));
        } else {
          setMarginOffset(0);
        }
      }
    };

    const raf = requestAnimationFrame(updateCaret);
    return () => cancelAnimationFrame(raf);
  }, [index, words]);

  const wordsArray = Array.isArray(words) ? words : [];
  let globalIndex = 0;

  return (
    <div
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
      className="relative w-full max-w-5xl mx-auto px-4 font-mono text-2xl md:text-3xl leading-relaxed tracking-wide select-none cursor-text overflow-hidden h-[3.8em] md:h-[4.5em]"
      style={{
        "--caret-x": "0px",
        "--caret-y": "0px",
      }}
    >

    
      <HiddenInput
        inputRef={inputRef}
        onChar={handleChar}
        onBackspace={handleBackspace}
        disabled={status === "finished"}
      />

      <Caret status={status} />

      <div
        ref={wordsWrapperRef}
        className="flex flex-wrap gap-x-[0.3em] gap-y-3 test-display-wrapper"
        style={{ transform: `translate3d(0, ${marginOffset}px, 0)` }}
      >
        {wordsArray.map((word, wordIdx) => {
          const displayWord = wordIdx === wordsArray.length - 1 ? word : word + " ";
          const startIndex = globalIndex;
          globalIndex += displayWord.length;

          return (
            <div key={`${wordIdx}-${startIndex}`} className="word-wrapper">
              <Word
                word={displayWord}
                startIndex={startIndex}
                index={index}
                results={results}
                setLetterRef={setLetterRef}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}