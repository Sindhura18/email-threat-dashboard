import React from 'react';

const StatisticsFooter = ({ totalEmails, currentPage, pageSize }) => {
  const start = totalEmails > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalEmails);

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-t-xl px-5 py-3">
      <span className="text-sm text-gray-400">
        Showing{' '}
        <span className="font-semibold text-gray-700">{start}–{end}</span>
        {' '}of{' '}
        <span className="font-semibold text-gray-700">{totalEmails}</span>
        {' '}emails
      </span>
    </div>
  );
};

export default StatisticsFooter;
