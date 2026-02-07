import useAuthStore from "../store/authStore";
import useHistoryStore from "../store/historyStore";
import WPMGraph from "../components/results/WPMGraph";

export default function ResultPage() {
  const user = useAuthStore((s) => s.user);

  const getHistory = useHistoryStore((s) => s.getHistory);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  // ✅ SAFE: derived outside selector
  const history = getHistory(user) ?? [];
  const latest = history[0];

  return (
    <div className="min-h-screen bg-creamy-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-olive-900">
            Test History
          </h1>

          {history.length > 0 && (
            <button
              onClick={() => clearHistory(user)}
              className="text-sm text-olive-600 hover:text-olive-900 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* GRAPH */}
        {latest?.telemetry?.wpmTimeline && (
          <WPMGraph data={latest.telemetry.wpmTimeline} />
        )}

        {/* LIST */}
        {history.length === 0 ? (
          <p className="text-olive-600">
            No tests yet. Start typing 🙂
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex justify-between rounded-lg border border-creamy-300 bg-creamy-100 px-4 py-3 text-sm"
              >
                <div className="flex gap-4 text-olive-800">
                  <span>
                    {item.mode} · {item.limit}
                    {item.mode === "time"
                      ? "s"
                      : " words"}
                  </span>
                  <span>{item.wpm} wpm</span>
                  <span>{item.accuracy}%</span>
                  {item.cheated && (
                    <span className="text-red-600">
                      flagged
                    </span>
                  )}
                </div>

                <span className="text-olive-500">
                  {new Date(
                    item.timestamp
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
