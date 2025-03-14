// File: src/components/admin/TableSearchSortPagination.tsx
import React from 'react';
import { FaChevronLeft, FaChevronRight, FaSync } from 'react-icons/fa';

export type SortDir = 'asc' | 'desc';

interface TableParams {
  search: string;
  page: number;
  pageSize: number;
  sortField: string;
  sortDir: SortDir;
}

interface Props {
  // Current states:
  currentSearch: string;
  currentPage: number;
  pageSize: number;
  sortField: string;
  sortDir: SortDir;
  totalItems: number;  // total after filtering
  // Callbacks:
  onChangeParams: (changes: Partial<TableParams>) => void;
  onRefresh?: () => void; // If you want a "Refresh" button
}

/**
 * A reusable UI bar for search input, pagination, and a single sort toggle.
 * For multi-column sort, you might expand this or handle columns individually.
 */
function TableSearchSortPagination({
  currentSearch,
  currentPage,
  pageSize,
  sortField,
  sortDir,
  totalItems,
  onChangeParams,
  onRefresh,
}: Props) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChangeParams({ search: e.target.value, page: 1 });
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      onChangeParams({ page: currentPage - 1 });
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      onChangeParams({ page: currentPage + 1 });
    }
  }

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChangeParams({ pageSize: Number(e.target.value), page: 1 });
  }

  function toggleSortDirection() {
    onChangeParams({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:justify-between space-y-2 md:space-y-0 mb-2">
      {/* Search box + optional Refresh button */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={currentSearch}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="border p-1 rounded"
        />
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded flex items-center space-x-1"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Pagination + pageSize */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
        >
          <FaChevronLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
        >
          <FaChevronRight />
        </button>

        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border p-1 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Sort Toggle (for single field) */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Sort:</span>
        <button
          onClick={toggleSortDirection}
          className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
        >
          {sortField} ({sortDir})
        </button>
      </div>
    </div>
  );
}

export default TableSearchSortPagination;
