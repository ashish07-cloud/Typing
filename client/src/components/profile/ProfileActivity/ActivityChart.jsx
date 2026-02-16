import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function ActivityChart({ wpmHistory }) {
  if (!wpmHistory || wpmHistory.length < 2) return null;

  return (
    <div className="bg-[var(--text-color)]/[0.02] border border-[var(--sub-color)]/10 p-8 rounded-[2.5rem] shadow-inner">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-bold text-[var(--sub-color)] uppercase tracking-[0.3em]">performance_trend</h3>
        <div className="flex gap-4 text-[10px] font-mono text-[var(--sub-color)]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--main-color)]"/> wpm</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--sub-color)] opacity-30"/> accuracy</span>
        </div>
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={wpmHistory}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--main-color)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--main-color)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip 
              cursor={{ stroke: 'var(--sub-color)', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ 
                backgroundColor: 'var(--bg-color)',
                border: '1px solid var(--sub-color)',
                borderRadius: '16px',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Area 
              type="stepAfter" 
              dataKey="wpm" 
              stroke="var(--main-color)" 
              strokeWidth={3}
              fill="url(#chartGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}