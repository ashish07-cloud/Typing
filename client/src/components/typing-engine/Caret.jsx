import { memo } from "react";

const Caret = memo(({ status }) => {
  if (status === "finished") return null;

  const isIdle = status === "idle";

  return (
    <div
      className={`
        absolute
        z-30
        pointer-events-none
        will-change-transform
        rounded-sm

        transition-transform duration-180 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isIdle ? "animate-caret-smooth" : ""}
      `}
      style={{
        width: "2px",
        height: "1.2em",
        backgroundColor: "var(--main-color)",
        transform: "translate3d(var(--caret-x), var(--caret-y), 0)",
        top: "-0.1em",
        left: 0,
      }}
    />
  );
});

export default Caret;
