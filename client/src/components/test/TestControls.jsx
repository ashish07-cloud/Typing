import { memo } from "react";

const TestControls = ({ mode, setMode, activeTime, setActiveTime, wordLimit, setWordLimit, disabled }) => {
  return (
    <div className={`mb-12 flex flex-col items-center gap-4 transition-opacity duration-300 ${disabled ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
      <div className="flex bg-dark/5 p-1 rounded-xl border border-sub/10 backdrop-blur-sm">
        {["time", "words"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              mode === m ? "bg-main text-page" : "text-sub hover:text-dark"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-4 font-mono">
        {(mode === "time" ? [15, 30, 60, 120] : [10, 25, 50, 100]).map((val) => (
          <button
            key={val}
            onClick={() => mode === "time" ? setActiveTime(val) : setWordLimit(val)}
            className={`text-sm transition-colors ${
              (mode === "time" ? activeTime : wordLimit) === val 
                ? "text-main font-bold" 
                : "text-sub hover:text-dark"
            }`}
          >
            {val}{mode === "time" && "s"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(TestControls);