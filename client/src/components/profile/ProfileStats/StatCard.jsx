export default function StatCard({ label, value, icon, highlight = false }) {
  return (
    <div className={`p-8 rounded-[2rem] border transition-all duration-500 group ${
      highlight 
        ? 'bg-[var(--main-color)] border-[var(--main-color)]' 
        : 'bg-[var(--text-color)]/5 border-[var(--sub-color)]/10 hover:border-[var(--sub-color)]/30'
    }`}>
      <div className="flex items-start justify-between mb-6">
        <span className={`text-3xl grayscale group-hover:grayscale-0 transition-all ${highlight ? 'invert brightness-200' : ''}`}>
          {icon}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
          highlight ? 'text-[var(--bg-color)]/60' : 'text-[var(--sub-color)]'
        }`}>
          {label}
        </span>
      </div>
      
      <div className="flex items-baseline">
        <span className={`text-5xl font-black tracking-tighter ${
          highlight ? 'text-[var(--bg-color)]' : 'text-[var(--text-color)]'
        }`}>
          {value}
        </span>
      </div>
    </div>
  );
}