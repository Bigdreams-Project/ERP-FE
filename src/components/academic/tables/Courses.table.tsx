"use client";
import { courses } from "@/data/mock/academic.data";
import { ChevronDown, Eye, Mail, Trash, User } from "lucide-react";
import { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
type CoursesTableProps = {
  searchQuery: string;
};

export default function CoursesTable({ searchQuery }: CoursesTableProps) {
  const [data] = useState(courses);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Filter across all pages before paginating
  const filteredData = data.filter(course => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query)
    );
  });

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Apply pagination to filtered results
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleEnroll = (centerId: string) => {
    setOpenDropdown(null);
  };

  const handleView = (centerId: string) => {
    setOpenDropdown(null);
  };

  const handleEmail = (centerId: string) => {
    setOpenDropdown(null);
  };

  const handleDelete = (centerId: string) => {
    setOpenDropdown(null);
  };


  // handling sellected rows
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const handleCheckboxChange = (id: string) => {
    setSelectedCenters(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map(center => center.id);
    const allSelected = currentPageIds.every(id => selectedCenters.includes(id));
    if (allSelected) {
      setSelectedCenters(prev =>
        prev.filter(id => !currentPageIds.includes(id))
      );
    } else {
      setSelectedCenters(prev => [
        ...prev,
        ...currentPageIds.filter(id => !prev.includes(id))
      ]);
    }
  };

  function highlightMatch(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className=" text-primary">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  return (
    <div className="min-h-screen font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <table className="min-w-full border-collapse text-[13px] text-gray-700 pb-8">
          <thead className="">
            <tr className=" w-full font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
              <th className="p-4 flex items-center">
                <input
                  type="checkbox"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every(center =>
                      selectedCenters.includes(center.id)
                    )
                  }
                  onChange={handleSelectAll}
                  className="mr-2 accent-primary"
                /> #
              </th>
              <th className="p-4">Code</th>
              <th className="p-4">Title</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Enrolled Students</th>
              <th className="p-4"> Inquires</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {paginatedData.map((couse, index) => (
              <tr key={couse.id} className="border-t border-gray-200">
                <td className="p-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCenters.includes(couse.id)}
                    onChange={() => handleCheckboxChange(couse.id)}
                    className="mr-2 accent-primary"
                  />
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-4">{highlightMatch(couse.code, searchQuery)}</td>
                <td className="p-4 font-bold ">{highlightMatch(couse.title, searchQuery)}</td>
                <td className="p-4">{couse.duration}</td>
                <td className="p-4">{couse.amount}</td>
                <td className="p-4">{couse.enrolledStudents}</td>
                <td className="p-4">{couse.Inquires}</td>
                <td
                  className={`p-4 font-semibold ${couse.status.toLowerCase() === 'active'
                      ? 'text-green-600'
                      : couse.status.toLowerCase() === 'inactive'
                        ? 'text-red-600'
                        : couse.status.toLowerCase() === 'draft'
                          ? 'text-gray-600'
                          : ''
                    }`}
                >
                  {couse.status}
                </td>
                <td className="p-4 relative text-right">
                  <button
                    onClick={() => toggleDropdown(couse.id)}
                    className="flex items-center justify-between px-3 py-2 text-white bg-primary rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                  >
                    Action
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {openDropdown === couse.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleEnroll(couse.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-green-500 hover:bg-gray-100"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleView(couse.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEmail(couse.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleEmail(couse.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Explore
                      </button>
                      <button
                        onClick={() => handleDelete(couse.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
