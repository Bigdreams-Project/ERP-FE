"use client";
import { centers } from "@/data/mock/academic.data";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";

type CenterTableProps = {
  searchQuery: string;
};

export default function CenterTable({ searchQuery }: CenterTableProps) {
  const [data] = useState(centers);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filteredData = data.filter((center) => {
    const query = searchQuery.toLowerCase();
    return (
      center.name.toLowerCase().includes(query) ||
      center.manager.toLowerCase().includes(query) ||
      center.email.toLowerCase().includes(query) ||
      center.phone.toLowerCase().includes(query) ||
      center.address.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const handleCheckboxChange = (id: string) => {
    setSelectedCenters((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((center) => center.id);
    const allSelected = currentPageIds.every((id) =>
      selectedCenters.includes(id)
    );

    if (allSelected) {
      setSelectedCenters((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedCenters((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="min-h-screen font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <table className="min-w-full border-collapse text-[14px] text-gray-700">
          <thead>
            <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
              <th className="p-4 flex items-center">
                <input
                  type="checkbox"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((center) =>
                      selectedCenters.includes(center.id)
                    )
                  }
                  onChange={handleSelectAll}
                  className="mr-2 accent-primary"
                />
                #
              </th>
              <th className="p-4">Center Code</th>
              <th className="p-4">Center Name</th>
              <th className="p-4">Center Manager</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Center Address</th>
              <th className="p-4">Enrolled Students</th>
              <th className="p-4">Leads</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {paginatedData.map((center, index) => (
              <tr key={center.id} className="border-t border-gray-200">
                <td className="p-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCenters.includes(center.id)}
                    onChange={() => handleCheckboxChange(center.id)}
                    className="mr-2 accent-primary"
                  />
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-3">{center.code}</td>
                <td className="p-3">
                  {highlightMatch(center.name, searchQuery)}
                </td>
                <td className="p-3 font-bold">
                  {highlightMatch(center.manager, searchQuery)}
                </td>
                <td className="p-3">
                  {highlightMatch(center.email, searchQuery)}
                </td>
                <td className="p-3">
                  {highlightMatch(center.phone, searchQuery)}
                </td>
                <td className="p-3">
                  {highlightMatch(center.address, searchQuery)}
                </td>
                <td className="p-3">{center.students}</td>
                <td className="p-3">{center.leads}</td>
                <td className="p-3 relative text-right">
                  <button
                    onClick={() => toggleDropdown(center.id)}
                    className="flex items-center justify-between px-3 py-2 text-white bg-primary rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                  >
                    Action
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                  {openDropdown === center.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleView(center.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEmail(center.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(center.id)}
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

        <div className="w-full p-4">
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
