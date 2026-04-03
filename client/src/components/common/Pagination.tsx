import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  maxVisiblePages = 5,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-5">
      {/* INFO */}
      {totalItems && itemsPerPage && (
        <p className="text-xs text-gray-400 mb-2">
          Showing{" "}
          <span className="text-white font-medium">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="text-white font-medium">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of{" "}
          <span className="text-white font-medium">{totalItems}</span> items
        </p>
      )}

      {/* CONTROLS */}
      <div className="flex items-center justify-center gap-2">
        {/* PREVIOUS */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* PAGE NUMBERS */}
        <div className="flex gap-1">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`w-9 h-9 rounded-lg transition-all text-sm font-medium ${
                page === "..."
                  ? "cursor-default text-gray-500"
                  : page === currentPage
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* NEXT */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}