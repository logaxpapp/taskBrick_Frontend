import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-2 py-1 border rounded ${
            i === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button onClick={handlePrev} disabled={currentPage === 1} className="px-2 py-1 border rounded bg-gray-100">
        Prev
      </button>
      {renderPageNumbers()}
      <button onClick={handleNext} disabled={currentPage === totalPages} className="px-2 py-1 border rounded bg-gray-100">
        Next
      </button>
    </div>
  );
};

export default Pagination;
