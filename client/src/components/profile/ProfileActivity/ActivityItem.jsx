import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function ActivityItem({ activity, isLatest }) {
  // Use a refined relative time formatter
  const timeAgo = useMemo(() => {
    const diff = Date.now() - new Date(activity.timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  }, [activity.timestamp]);

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border border-[var(--sub-color)]/10 hover:border-[var(--main-color)]/30 hover:bg-[var(--text-color)]/[0.02] transition-all group relative ${isLatest ? 'bg-[var(--main-color)]/5 ring-1 ring-[var(--main-color)]/20' : ''}`}>
      <div className="flex items-center gap-5">
        {/* Mode Visual */}
        <div className="w-12 h-12 rounded-xl bg-[var(--text-color)]/5 flex flex-col items-center justify-center font-mono text-[10px] font-bold">
          <span className="text-[var(--main-color)]">{activity.mode === 'time' ? 'T' : 'W'}</span>
          <span className="text-[var(--sub-color)]">{activity.limit}</span>
        </div>
        
        <div>
          <div className="flex items-center gap-3">
            <span className="font-black text-[var(--text-color)] text-xl tracking-tighter">
              {activity.wpm} <small className="text-[10px] font-normal uppercase text-[var(--sub-color)]">wpm</small>
            </span>
            <div className="h-4 w-[1px] bg-[var(--sub-color)]/20" />
            <span className={`text-sm font-bold font-mono ${activity.accuracy >= 98 ? 'text-[var(--main-color)]' : 'text-[var(--sub-color)]'}`}>
              {activity.accuracy}%
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono uppercase tracking-widest text-[var(--sub-color)]">
             <span>{timeAgo}</span>
             <span>•</span>
             <span className="opacity-60">{activity.rawWpm || activity.wpm} raw</span>
          </div>
        </div>
      </div>
      
      <Link
        to={`/result/${activity.id}`}
        className="p-3 rounded-xl hover:bg-[var(--main-color)] hover:text-[var(--bg-color)] text-[var(--sub-color)] transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}