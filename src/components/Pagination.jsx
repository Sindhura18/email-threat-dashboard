import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Info */}
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages} ({totalCount} total emails)
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous */}
          <button
            onClick={onPrevious}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 rounded transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white font-medium"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
