import { memo } from "react";

function Letter({ char, status, letterRef }) {
  return (
    <span
      ref={letterRef}
      className={
        status === "correct"
          ? "text-green-400"
          : status === "incorrect"
          ? "text-red-400"
          : "text-neutral-400"
      }
    >
      {char}
    </span>
  );
}

export default memo(Letter);
