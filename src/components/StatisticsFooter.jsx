import React from 'react';

const StatisticsFooter = ({ totalEmails, currentPage, pageSize }) => {
  const start = totalEmails > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalEmails);

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-xl px-5 py-3">
      <span className="text-sm text-gray-400 dark:text-gray-500">
        Showing{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">{start}–{end}</span>
        {' '}of{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">{totalEmails}</span>
        {' '}emails
      </span>
    </div>
  );
};

export default StatisticsFooter;
