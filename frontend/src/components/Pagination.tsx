import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (end - start + 1 < maxVisible) {
      if (start === 1) end = Math.min(totalPages, start + maxVisible - 1);
      else start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-[#e2d3c0] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaChevronLeft />
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="px-2 text-gray-400">…</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-xl transition ${
            page === currentPage
              ? 'bg-deep-maroon text-white'
              : 'hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-400">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-[#e2d3c0] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}