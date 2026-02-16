import StatCard from './StatCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProfileStats({ user, wpmHistory = [] }) {
  // 1. DEFENSIVE CHECK: If user is missing, return a skeleton or null
  if (!user) return null;

  const formatTime = (ms = 0) => {
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  // 2. DATA MAPPING (Using the Virtuals and Stats from our new Model)
  const statCards = [
    { 
      label: 'tests_completed', 
      value: user.stats?.testsCompleted || 0, 
      icon: '📊' 
    },
    { 
      label: 'average_speed', 
      value: user.avgWpm || 0, // Using the Mongoose Virtual
      unit: 'WPM', 
      highlight: true, 
      icon: '⚡' 
    },
    { 
      label: 'personal_best', 
      value: user.stats?.bestWpm || 0, 
      unit: 'WPM', 
      icon: '🏆' 
    },
    { 
      label: 'accuracy', 
      value: `${user.avgAccuracy || 0}%`, // Using the Mongoose Virtual
      icon: '🎯' 
    },
    { 
      label: 'time_typing', 
      value: formatTime(user.stats?.totalTimeTyped), 
      icon: '⏱️' 
    },
    { 
      label: 'chars_typed', 
      value: (user.stats?.totalCharacters || 0).toLocaleString(), 
      icon: '⌨️' 
    }
  ];

  return (
    <div className="space-y-10">
      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* RECHART - THEMED & SNAPSHOT-SAFE */}
      {wpmHistory.length > 0 && (
        <div className="bg-[var(--text-color)]/[0.02] border border-[var(--sub-color)]/10 p-10 rounded-[2.5rem] shadow-sm">
          <h3 className="text-[10px] font-bold text-[var(--sub-color)] uppercase tracking-[0.3em] mb-8">
            performance_history
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wpmHistory}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--main-color)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--main-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--sub-color)" opacity={0.1} />
                <XAxis dataKey="label" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-color)', 
                    border: '1px solid var(--sub-color)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: 'var(--text-color)'
                  }}
                  itemStyle={{ color: 'var(--main-color)' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="wpm" 
                  stroke="var(--main-color)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorWpm)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}