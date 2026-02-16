import { memo } from 'react';

const AchievementBadge = ({ title, description, icon, unlocked }) => {
  return (
    <div 
      className={`relative p-5 rounded-[2rem] border transition-all duration-500 overflow-hidden group ${
        unlocked 
          ? 'bg-[var(--main-color)]/10 border-[var(--main-color)]/30' 
          : 'bg-[var(--text-color)]/[0.03] border-[var(--sub-color)]/5 opacity-40 grayscale'
      }`}
    >
      {/* Background Glow for Unlocked */}
      {unlocked && (
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--main-color)]/20 blur-2xl rounded-full group-hover:bg-[var(--main-color)]/40 transition-all" />
      )}

      <div className="flex items-center gap-5 relative z-10">
        {/* Icon Sphere */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 ${
          unlocked ? 'bg-[var(--main-color)] text-[var(--bg-color)]' : 'bg-[var(--sub-color)]/10 text-[var(--sub-color)]'
        }`}>
          {icon}
        </div>

        <div className="flex-1">
          <h4 className={`font-mono text-xs font-black uppercase tracking-[0.2em] ${
            unlocked ? 'text-[var(--text-color)]' : 'text-[var(--sub-color)]'
          }`}>
            {title.replace(' ', '_')}
          </h4>
          <p className="text-[10px] font-medium text-[var(--sub-color)] mt-1 leading-tight">
            {description.toLowerCase()}
          </p>
        </div>

        {!unlocked && (
          <div className="text-[var(--sub-color)] opacity-30">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AchievementBadge);