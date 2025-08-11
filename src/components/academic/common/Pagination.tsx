import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="fixed bottom-0 bg-white pt-6 pb-3 flex justify-between items-center mt-10 space-x-2 text-sm text-gray-700">
      <div className="flex justify-start items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <p className="text-gray-400 self-end">
        © 2025 TecTerminal ERP. All rights reserved.
      </p>
    </div>
  );
};

export default Pagination;
