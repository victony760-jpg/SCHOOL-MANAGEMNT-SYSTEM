// src/components/common/StatCard.jsx
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  iconPath,
  subtitle
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden bg-blue-950/60 border-blue-900/50 rounded-xl p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 flex-col justify-between group"
    >
      {/* Subtle background glow effect on hover - now emerald */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* TOP ROW: TITLE & ICON */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
          {title}
        </span>

        {iconPath && (
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
            </svg>
          </div>
        )}
      </div>

      {/* MIDDLE ROW: VALUE & BADGE */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          {value}
        </h3>

        {change && (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
          >
            {isPositive ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {change}
          </span>
        )}
      </div>

      {/* BOTTOM ROW: SUBTITLE */}
      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 border-t border-blue-900/50 pt-2.5">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;