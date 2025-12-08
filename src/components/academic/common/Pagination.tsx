import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  // Ensure totalPages is always at least 1
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));

  // Generate smart page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // Show up to 7 page numbers (excluding ellipsis)

    if (safeTotalPages <= maxVisiblePages) {
      // If total pages is small, show all pages
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let start = Math.max(2, safeCurrentPage - 1);
      let end = Math.min(safeTotalPages - 1, safeCurrentPage + 1);

      // Adjust if we're near the beginning
      if (safeCurrentPage <= 4) {
        start = 2;
        end = Math.min(5, safeTotalPages - 1);
      }

      // Adjust if we're near the end
      if (safeCurrentPage >= safeTotalPages - 3) {
        start = Math.max(2, safeTotalPages - 4);
        end = safeTotalPages - 1;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < safeTotalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (safeTotalPages > 1) {
        pages.push(safeTotalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full pt-3 pl-2 pr-4 flex justify-between items-center text-sm text-gray-700 min-h-[50px]">
      <div className="flex justify-start items-center space-x-2 flex-wrap gap-1 min-w-0 flex-1">
        <button
          onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
          disabled={safeCurrentPage === 1}
          className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:bg-gray-200 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-gray-500 flex-shrink-0"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded-md min-w-[40px] flex-shrink-0 transition-colors ${
                safeCurrentPage === pageNum
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={safeCurrentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(safeTotalPages, safeCurrentPage + 1))}
          disabled={safeCurrentPage === safeTotalPages}
          className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:bg-gray-200 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <p className="text-gray-400 self-end flex-shrink-0 ml-4">
        © 2025 TecTerminal ERP. All rights reserved.
      </p>
    </div>
  );
};

export default Pagination;
