import { memo } from "react";

function Caret({ x, y, height }) {
  return (
    <div
      className="absolute pointer-events-none bg-olive-600 transition-all duration-75"
      style={{
        width: "2px",
        height,
        transform: `translate(${x}px, ${y}px)`,
      }}
    />
  );
}

export default memo(Caret);
