// src/components/Pagination.jsx
import { useState } from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [page, setPage] = useState(currentPage || 1);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange(newPage);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
}