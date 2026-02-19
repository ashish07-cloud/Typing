import {
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import Caret from "./Caret";
import Word from "./Word";
import HiddenInput from "./HiddenInput";

export default function TestDisplay({
  words,
  index,
  results,
  status,
  handleChar,
  handleBackspace,
}) {
  const containerRef = useRef(null);
  const wordsWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const letterRefs = useRef({});
  const [marginOffset, setMarginOffset] = useState(0);

  useEffect(() => {
    if (status !== "finished") {
      inputRef.current?.focus();
    }
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

    const raf = requestAnimationFrame(() => {
      // 1. Caret Positioning
      const containerRect = container.getBoundingClientRect();
      const letterRect = activeLetter.getBoundingClientRect();

      container.style.setProperty("--caret-x", `${letterRect.left - containerRect.left}px`);
      container.style.setProperty("--caret-y", `${letterRect.top - containerRect.top}px`);
      container.style.setProperty("--caret-height", `${letterRect.height}px`);

      // 2. Line Shifting Logic
      // We find the parent "Word" div of the current letter
      const activeWord = activeLetter.closest(".word-wrapper");
      if (activeWord) {
        const wordTop = activeWord.offsetTop;
        const wordHeight = activeWord.offsetHeight;
        const gap = 12; // This matches your gap-y-3 (0.75rem / 12px)
        
        // lineHeight is the distance from the top of one line to the top of the next
        const lineHeight = wordHeight + gap;

        // If the current word is on line 2 or further down (wordTop > 0)
        // We shift the wrapper up so the active word is always on the 2nd line.
        // Line 0: top=0, Line 1: top=lineHeight, Line 2: top=lineHeight*2
        if (wordTop > lineHeight) {
          setMarginOffset(-(wordTop - lineHeight));
        } else {
          setMarginOffset(0);
        }
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [index, words]);

  const wordsArray = Array.isArray(words) ? words : [];
  let globalIndex = 0;

  return (
    <div
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
      className="
        relative
        w-full
        max-w-5xl
        mx-auto
        px-4
        font-mono
        text-xl
        sm:text-2xl
        md:text-3xl
        leading-relaxed
        tracking-wide
        select-none
        cursor-text
        overflow-hidden
        /* Height for exactly 3 lines: (line-height * 3) + (gap * 2) */
        /* Adjusted height to be safe: 1.5em * 3 lines + small buffer */
        h-[4.8em]
        sm:h-[5.2em]
        md:h-[5.5em]
      "
      style={{
        "--caret-x": "0px",
        "--caret-y": "0px",
        "--caret-height": "1.5em",
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
        className="flex flex-wrap gap-y-3 transition-transform duration-250 ease-in-out"
        style={{ transform: `translateY(${marginOffset}px)` }}
      >
        {wordsArray.map((word, wordIdx) => {
          const displayWord = wordIdx === wordsArray.length - 1 ? word : word + " ";
          const startIndex = globalIndex;
          globalIndex += displayWord.length;

          return (
            /* We add 'word-wrapper' class here for the scroll logic to find it */
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