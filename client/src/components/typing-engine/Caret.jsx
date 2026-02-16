import { memo } from "react";

const Caret = memo(({ status }) => {
  if (status === "finished") return null;

  return (
    <div
      className={`
        absolute
        z-20
        bg-main
        w-[2px]
        transition-transform
        duration-75
        ease-out
        ${status === "idle" ? "animate-pulse" : ""}
      `}
      style={{
        height: "var(--caret-height, 1.5em)",
        transform: "translate3d(var(--caret-x), var(--caret-y), 0)",
        top: 0,
        left: 0,
      }}
    />
  );
});

export default Caret;
