import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  // Ensure totalPages is always at least 1
  const safeTotalPages = Math.max(1, totalPages);
  const pageNumbers = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  // Always render pagination
  // Show all page numbers - they will wrap if needed
  return (
    <div className="w-full pt-3 pl-2 pr-4 flex justify-between items-center text-sm text-gray-700 min-h-[50px]">
      <div className="flex justify-start items-center space-x-2 flex-wrap gap-1 min-w-0 flex-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md min-w-[40px] flex-shrink-0 ${
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
          disabled={currentPage === safeTotalPages}
          className="px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
