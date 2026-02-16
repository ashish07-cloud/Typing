import AchievementBadge from './AchievementBadge';

// In a real project, this would be in src/constants/achievements.js
export const ACHIEVEMENTS_CONFIG = {
  speed_demon: { title: 'speed_demon', description: 'reach 100+ wpm in any test', icon: '⚡' },
  perfectionist: { title: 'perfectionist', description: 'achieve 99%+ accuracy', icon: '🎯' },
  dedicated: { title: 'dedicated', description: 'complete 50+ typing tests', icon: '💪' },
  addicted: { title: 'addicted', description: 'complete 100+ typing tests', icon: '🔥' },
  pro_typer: { title: 'pro_typer', description: 'reach 150+ wpm in any test', icon: '👑' }
};

export default function AchievementsList({ userAchievements = [] }) {
  const allKeys = Object.keys(ACHIEVEMENTS_CONFIG);
  const progress = Math.round((userAchievements.length / allKeys.length) * 100);

  return (
    <div className="space-y-10 font-mono">
      {/* PROGRESS HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h3 className="text-xs font-bold text-[var(--sub-color)] uppercase tracking-[0.3em] mb-4">hall_of_fame</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[var(--text-color)] tracking-tighter">{progress}%</span>
            <span className="text-xs font-bold text-[var(--sub-color)] uppercase tracking-widest">completed</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          {allKeys.map(k => (
            <div 
              key={k} 
              className={`w-8 h-1 rounded-full transition-all duration-1000 ${
                userAchievements.includes(k) ? 'bg-[var(--main-color)]' : 'bg-[var(--sub-color)]/20'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* GRID */}
      {allKeys.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed border-[var(--sub-color)]/10 rounded-[2.5rem]">
          <span className="text-[var(--sub-color)] text-xs uppercase tracking-widest">no_achievements_configured</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allKeys.map((key) => {
            const config = ACHIEVEMENTS_CONFIG[key];
            return (
              <AchievementBadge
                key={key}
                title={config.title}
                description={config.description}
                icon={config.icon}
                unlocked={userAchievements.includes(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}