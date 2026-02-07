import useAuthStore from "../store/authStore";
import useHistoryStore from "../store/historyStore";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const getHistory = useHistoryStore((s) => s.getHistory);

  // ✅ SAFE: derived outside selector
  const history = getHistory(user) ?? [];

  const validTests = history.filter((t) => !t.cheated);
  const testsTaken = validTests.length;

  const averageWPM =
    testsTaken > 0
      ? Math.round(
          validTests.reduce((sum, t) => sum + t.wpm, 0) /
            testsTaken
        )
      : 0;

  const averageAccuracy =
    testsTaken > 0
      ? Math.round(
          validTests.reduce(
            (sum, t) => sum + t.accuracy,
            0
          ) / testsTaken
        )
      : 100;

  const bestWPM =
    testsTaken > 0
      ? Math.max(...validTests.map((t) => t.wpm))
      : 0;

  const recentTests = validTests.slice(0, 5);

  if (!user) {
    return (
      <div className="min-h-screen bg-creamy-50 flex items-center justify-center text-olive-700">
        Please log in to view your profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creamy-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-600 text-creamy-50 text-xl font-semibold">
            {user.username[0].toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-olive-900">
              {user.username}
            </h1>
            <p className="text-sm text-olive-600">
              Typing profile
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Tests" value={testsTaken} />
          <StatCard label="Avg WPM" value={averageWPM} />
          <StatCard label="Best WPM" value={bestWPM} />
          <StatCard
            label="Accuracy"
            value={`${averageAccuracy}%`}
          />
        </div>

        {/* RECENT TESTS */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-olive-900">
            Recent Tests
          </h2>

          {recentTests.length === 0 ? (
            <p className="text-olive-600">
              No completed tests yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentTests.map((test) => (
                <div
                  key={test.id}
                  className="flex justify-between rounded-lg border border-creamy-300 bg-creamy-100 px-4 py-3 text-sm"
                >
                  <div className="flex gap-4 text-olive-800">
                    <span>
                      {test.mode} · {test.limit}
                      {test.mode === "time"
                        ? "s"
                        : " words"}
                    </span>
                    <span>{test.wpm} wpm</span>
                    <span>{test.accuracy}%</span>
                  </div>

                  <span className="text-olive-500">
                    {new Date(
                      test.timestamp
                    ).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-creamy-300 bg-creamy-100 px-4 py-4 text-center">
      <div className="text-sm text-olive-600">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-olive-900">
        {value}
      </div>
    </div>
  );
}
