import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-full" />
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-5/6" />
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-2/3" />
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-3/4" />
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-16" />
            <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-8" />
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700/60 rounded-full w-full" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2.5 min-w-[200px]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-28" />
        <div className="h-6 bg-gray-100 dark:bg-gray-700/60 rounded-full w-36" />
        <div className="h-6 bg-gray-100 dark:bg-gray-700/60 rounded-full w-32" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700/60 rounded w-24 mt-1" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
