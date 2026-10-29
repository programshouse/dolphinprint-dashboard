import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * RowsPerPageSelect - Standalone selector for placement on top of tables and lists.
 */
export function RowsPerPageSelect({
  value = 10,
  onChange,
  options = [5, 10, 20, 50],
  label = "Rows per page:",
  className = "",
}) {
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      <span className="text-gray-500 whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs sm:text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Generates an array of page numbers with ellipsis for pagination navigation.
 * E.g. [1, 2, 3, 4, 5, '...', 10] or [1, '...', 4, 5, 6, '...', 10]
 */
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showInfo = true,
  showRowsPerPage = false, // Placed on top of tables by default, not down
  className = "",
}) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = Math.min(Math.max(1, currentPage || 1), safeTotalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  const pageNumbers = getPageNumbers(safeCurrentPage, safeTotalPages);

  const handlePageClick = (page) => {
    if (page === "..." || page === safeCurrentPage) return;
    if (page < 1 || page > safeTotalPages) return;
    onPageChange?.(page);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-2 select-none text-sm text-gray-700 ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Left side: Information (and optional Rows per page if enabled) */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">


        {showRowsPerPage && onItemsPerPageChange && (
          <RowsPerPageSelect
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            options={itemsPerPageOptions}
          />
        )}
      </div>

      {/* Right side: Page Navigation Controls */}
      {safeTotalPages > 1 && (
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* First page button */}
          <button
            type="button"
            title="First Page"
            aria-label="First Page"
            disabled={safeCurrentPage === 1}
            onClick={() => handlePageClick(1)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          {/* Previous page button */}
          <button
            type="button"
            title="Previous Page"
            aria-label="Previous Page"
            disabled={safeCurrentPage === 1}
            onClick={() => handlePageClick(safeCurrentPage - 1)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {pageNumbers.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-6 sm:h-9 sm:w-7 items-center justify-center text-xs sm:text-sm text-gray-400"
                >
                  …
                </span>
              );
            }

            const isActive = p === safeCurrentPage;
            return (
              <button
                key={p}
                type="button"
                aria-label={`Page ${p}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => handlePageClick(p)}
                className={`flex h-8 min-w-[32px] sm:h-9 sm:min-w-[36px] items-center justify-center rounded-lg px-2 text-xs sm:text-sm font-medium transition ${isActive
                    ? "bg-brand-600 text-white shadow-sm border border-brand-600 hover:bg-brand-700"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {p}
              </button>
            );
          })}

          {/* Next page button */}
          <button
            type="button"
            title="Next Page"
            aria-label="Next Page"
            disabled={safeCurrentPage === safeTotalPages}
            onClick={() => handlePageClick(safeCurrentPage + 1)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last page button */}
          <button
            type="button"
            title="Last Page"
            aria-label="Last Page"
            disabled={safeCurrentPage === safeTotalPages}
            onClick={() => handlePageClick(safeTotalPages)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
