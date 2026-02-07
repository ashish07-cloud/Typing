export default function TestControls({
  mode,
  setMode,
  activeTime,
  setActiveTime,
  wordLimit,
  setWordLimit,
}) {
  return (
    <div className="mb-10 w-full flex flex-col items-center gap-6">
      {/* MODE SWITCH */}
      <div className="flex gap-2 bg-creamy-100 border border-creamy-300 rounded-lg p-1">
        {["time", "words"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              mode === m
                ? "bg-olive-600 text-creamy-50"
                : "text-olive-700 hover:bg-creamy-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* LIMIT SELECTOR */}
      <div className="flex gap-4 text-sm text-olive-600">
        {mode === "time" &&
          [15, 30, 60, 120].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTime(t)}
              className={`px-3 py-1 rounded transition ${
                t === activeTime
                  ? "bg-olive-100 text-olive-900 font-semibold"
                  : "hover:text-olive-900"
              }`}
            >
              {t}s
            </button>
          ))}

        {mode === "words" &&
          [10, 25, 50, 100].map((w) => (
            <button
              key={w}
              onClick={() => setWordLimit(w)}
              className={`px-3 py-1 rounded transition ${
                w === wordLimit
                  ? "bg-olive-100 text-olive-900 font-semibold"
                  : "hover:text-olive-900"
              }`}
            >
              {w}
            </button>
          ))}
      </div>
    </div>
  );
}
