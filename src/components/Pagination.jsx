import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, totalCount, onPageChange, onPrevious, onNext }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) startPage = Math.max(1, endPage - maxPagesToShow + 1);

    if (startPage > 1) { pages.push(1); if (startPage > 2) pages.push('...'); }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages) { if (endPage < totalPages - 1) pages.push('...'); pages.push(totalPages); }

    return pages;
  };

  const btnBase = 'w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors';

  return (
    <div className="bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl px-5 py-3 flex items-center justify-between">
      <span className="text-sm text-gray-400 dark:text-gray-500">
        Page{' '}
        <span className="font-semibold text-gray-600 dark:text-gray-300">{currentPage}</span>
        {' '}of{' '}
        <span className="font-semibold text-gray-600 dark:text-gray-300">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`${btnBase} border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed`}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-600 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${btnBase} font-medium ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`${btnBase} border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed`}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
