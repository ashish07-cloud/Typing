import {
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
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
  const inputRef = useRef(null);
  const letterRefs = useRef({});

  useEffect(() => {
  if (status !== "finished") {
    inputRef.current?.focus();
  }
}, [status]);

  useEffect(() => {
    letterRefs.current = {};
  }, [words]);

  const setLetterRef = useCallback((idx, el) => {
    if (el) letterRefs.current[idx] = el;
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const activeLetter = letterRefs.current[index];

    if (!container || !activeLetter) return;

    const raf = requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const letterRect = activeLetter.getBoundingClientRect();

      container.style.setProperty(
        "--caret-x",
        `${letterRect.left - containerRect.left}px`
      );
      container.style.setProperty(
        "--caret-y",
        `${letterRect.top - containerRect.top}px`
      );
      container.style.setProperty(
        "--caret-height",
        `${letterRect.height}px`
      );
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
        sm:px-6
        lg:px-8
        py-10
        md:py-16
        font-mono
        text-xl
        sm:text-2xl
        md:text-3xl
        leading-relaxed
        tracking-wide
        select-none
        cursor-text
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

      <div className="flex flex-wrap gap-y-3">
        {wordsArray.map((word, wordIdx) => {
          const displayWord =
            wordIdx === wordsArray.length - 1
              ? word
              : word + " ";

          const startIndex = globalIndex;
          globalIndex += displayWord.length;

          return (
            <Word
              key={`${wordIdx}-${startIndex}`}
              word={displayWord}
              startIndex={startIndex}
              index={index}
              results={results}
              setLetterRef={setLetterRef}
            />
          );
        })}
      </div>
    </div>
  );
}
