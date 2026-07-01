import React, { useMemo } from 'react';
import { THREAT_TYPE_CONFIG } from '../utils/helpers';

const THREAT_TYPES = ['SP', 'PH', 'MA', 'IM', 'CL'];

const ThreatSummaryCards = ({ emails }) => {
  const stats = useMemo(() => {
    const total = emails.length;
    return THREAT_TYPES.map((type) => {
      const count = emails.filter((e) => e.threat_type === type).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { type, count, pct, ...THREAT_TYPE_CONFIG[type] };
    });
  }, [emails]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map(({ type, label, bg, border, text, bar, count, pct }) => (
        <div key={type} className={`rounded-lg border ${bg} ${border} p-4`}>
          <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${text} opacity-70`}>
            {label}
          </div>
          <div className={`text-3xl font-bold ${text} mb-1`}>{count}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">{pct}% of total</div>
          <div className="h-1.5 bg-white/50 dark:bg-gray-700/40 rounded-full overflow-hidden">
            <div className={`h-full ${bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreatSummaryCards;
