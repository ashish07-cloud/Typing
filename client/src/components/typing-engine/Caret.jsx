import { memo } from "react";

const Caret = memo(({ status }) => {
  if (status === "finished") return null;

  return (
    <div
      className={`
        absolute
        z-30
     
        w-[0.1em]
        rounded-[var(--roundness, 0.1em)]
        pointer-events-none
        will-change-transform

        transition-transform duration-[100ms] cubic-bezier(0.17, 0.67, 0.83, 0.67)
        ${status === "idle" ? "animate-caret-smooth" : "opacity-100"}
      `}
      style={{
        backgroundColor: "var(--main-color)",
        height: "1.2em", // Matching MonkeyType CSS
        transform: "translate3d(var(--caret-x), var(--caret-y), 0)",
        top: "-0.1em", // Slight offset to center vertically with text
        left: 0,
      }}
    />
  );
});

export default Caret;
