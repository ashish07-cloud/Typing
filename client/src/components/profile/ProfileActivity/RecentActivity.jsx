import { Link } from 'react-router-dom';
import ActivityItem from './ActivityItem';
import ActivityChart from './ActivityChart';

export default function RecentActivity({ activities, wpmHistory }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-[var(--text-color)]/5 border-2 border-dashed border-[var(--sub-color)]/20 rounded-[2.5rem] p-16 text-center">
        <span className="text-5xl block mb-6 grayscale opacity-50">⌨️</span>
        <h3 className="text-2xl font-bold text-[var(--text-color)] tracking-tighter mb-2">The arena is empty.</h3>
        <p className="text-[var(--sub-color)] font-mono text-xs mb-10">NO_ACTIVITY_LOG_FOUND</p>
        <Link 
          to="/"
          className="inline-block px-10 py-4 bg-[var(--main-color)] text-[var(--bg-color)] rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[var(--main-color)]/20"
        >
          enter_test_mode
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Activity Chart - Placed at top for "Dashboard" feel */}
      <ActivityChart wpmHistory={wpmHistory} />

      {/* Activity Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-[var(--sub-color)] uppercase tracking-[0.3em]">
            session_history
          </h3>
          <Link to="/history" className="text-[10px] font-mono text-[var(--main-color)] hover:underline uppercase tracking-widest">
            view_full_log
          </Link>
        </div>
        
        <div className="grid gap-3">
          {activities.slice(0, 10).map((activity, index) => (
            <ActivityItem 
              key={activity.id || index} 
              activity={activity} 
              isLatest={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}