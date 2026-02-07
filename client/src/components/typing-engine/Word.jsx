import { memo } from "react";
import Letter from "./Letter";

function Word({
  word,
  typed = "",
  isActive,
  startIndex,
  letterRefs,
}) {
  return (
    <span
      className={`mr-2 relative ${
        isActive
          ? "underline decoration-2 underline-offset-4 decoration-olive-400"
          : ""
      }`}
    >
      {word.split("").map((char, index) => {
        let status = "untyped";

        if (typed[index]) {
          status = typed[index] === char ? "correct" : "incorrect";
        }

        const globalIndex = startIndex + index;

        return (
          <Letter
            key={globalIndex}
            char={char}
            status={status}
            letterRef={(el) => (letterRefs.current[globalIndex] = el)}
          />
        );
      })}
    </span>
  );
}

export default memo(Word);
