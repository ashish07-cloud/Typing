import { memo } from "react";

const Word = memo(
  ({ word, startIndex, index, results = {}, setLetterRef }) => {
    return (
      <div className="flex relative">
        {word.split("").map((char, charIdx) => {
          const globalIdx = startIndex + charIdx;

          const isCurrent = index === globalIdx;
          const hasTyped = Object.prototype.hasOwnProperty.call(
            results,
            globalIdx
          );
          const isCorrect = results[globalIdx];

          let colorClass = "text-sub";

          if (hasTyped) {
            colorClass = isCorrect
              ? "text-dark"
              : "text-error border-b-2 border-error/40";
          }

          if (isCurrent) {
            colorClass =
              "text-main underline decoration-2 underline-offset-4";
          }

          return (
            <span
              key={globalIdx}
              ref={(el) => setLetterRef(globalIdx, el)}
              className="whitespace-pre transition-colors duration-100"
            >
              <span className={colorClass}>{char}</span>
            </span>
          );
        })}
      </div>
    );
  }
);

export default Word;
