import LeaderboardRow from "./LeaderboardRow";

export default function LeaderboardTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 bg-page/50 rounded-3xl border-2 border-dashed border-sub/20 backdrop-blur-sm">
        <div className="inline-block p-4 mb-4 rounded-full bg-sub/10">
          <span className="text-4xl">🏆</span>
        </div>
        <h3 className="text-dark text-xl font-bold mb-2">No Rankings Yet</h3>
        <p className="text-sub font-mono max-w-md mx-auto">
          Be the first to set a record in this category! Complete a typing test to appear here.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-3 bg-main text-page rounded-xl font-medium hover:bg-main/90 transition-all shadow-lg shadow-main/20"
        >
          Take a Test
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sub/10 bg-page/60 backdrop-blur-sm shadow-xl">
      {/* Table Header with Gradient */}
      <div className="bg-gradient-to-r from-main/10 via-main/5 to-main/10 border-b border-sub/10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark">Top Performers</h2>
              <p className="text-sub text-sm font-mono mt-1">
                Ranked by speed and accuracy
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-sub">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-main"></div>
                <span>WPM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sub"></div>
                <span>Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sub font-mono text-xs uppercase tracking-[0.2em] border-b border-sub/10">
              <th className="px-8 py-5 font-medium text-left">Rank</th>
              <th className="px-8 py-5 font-medium text-left">Typist</th>
              <th className="px-8 py-5 font-medium text-left">Speed</th>
              <th className="px-8 py-5 font-medium text-left">Accuracy</th>
              <th className="px-8 py-5 font-medium text-left">Date</th>
              <th className="px-8 py-5 font-medium text-left">Mode</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <LeaderboardRow key={row._id || index} rank={index + 1} entry={row} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-8 py-4 border-t border-sub/10 bg-page/30">
        <div className="flex justify-between items-center text-sub text-sm font-mono">
          <span>Showing {data.length} results</span>
          <span>Updated in real-time</span>
        </div>
      </div>
    </div>
  );
}