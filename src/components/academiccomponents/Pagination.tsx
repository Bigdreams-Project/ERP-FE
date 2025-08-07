import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center mt-6 space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((item, idx) => (
        <button
          key={idx}
          disabled={item === "..."}
          onClick={() => typeof item === "number" && onPageChange(item)}
          className={`px-3 py-1 rounded text-sm ${
            item === currentPage
              ? "bg-indigo-500 text-white"
              : "hover:bg-gray-100 text-gray-800"
          } ${item === "..." ? "cursor-default text-gray-400" : ""}`}
        >
          {item}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;