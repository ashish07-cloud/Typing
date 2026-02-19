export default function StatCard({ label, value, icon, highlight = false }) {
  return (
    <div
      className={`
        relative
        p-8
        rounded-3xl
        transition-all
        duration-500
        backdrop-blur-xl
        border
        overflow-hidden
        group
        ${
          highlight
            ? "bg-[var(--main-color)]/20 border-[var(--main-color)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            : "bg-[var(--bg-color)]/40 border-[var(--sub-color)]/10 hover:border-[var(--sub-color)]/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        }
      `}
    >
      {/* subtle gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-40 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <span
            className={`
              text-3xl transition-all duration-300
              ${highlight ? "opacity-90" : "opacity-60 group-hover:opacity-100"}
            `}
          >
            {icon}
          </span>

          <span
            className={`
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              ${
                highlight
                  ? "text-[var(--text-color)]/80"
                  : "text-[var(--sub-color)]"
              }
            `}
          >
            {label}
          </span>
        </div>

        <div className="flex items-baseline">
          <span
            className={`
              text-4xl md:text-5xl
              font-black
              tracking-tight
              ${
                highlight
                  ? "text-[var(--text-color)]"
                  : "text-[var(--text-color)]"
              }
            `}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
