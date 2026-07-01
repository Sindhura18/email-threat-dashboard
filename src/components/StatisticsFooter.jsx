import React from 'react';
import { THREAT_TYPE_CONFIG } from '../utils/helpers';

const TYPES = ['SP', 'PH', 'MA', 'IM', 'CL'];

const StatisticsFooter = ({ emails, totalEmails, currentPage, pageSize }) => {
  const start = totalEmails > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalEmails);

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-t-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
      <span className="text-sm text-gray-400">
        Showing{' '}
        <span className="font-semibold text-gray-700">{start}–{end}</span>
        {' '}of{' '}
        <span className="font-semibold text-gray-700">{totalEmails}</span>
        {' '}emails
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        {TYPES.map((type) => {
          const count = emails.filter((e) => e.threat_type === type).length;
          if (count === 0) return null;
          const { label, badge } = THREAT_TYPE_CONFIG[type];
          return (
            <span key={type} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge}`}>
              {label}: {count}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsFooter;
