"use client";
import { centers } from "@/data/mock/academic.data";
import { ChevronDown, Eye, Mail, Trash, User } from "lucide-react";
import { useState } from "react";
import Pagination from "../common/Pagination";

export default function CenterTable() {
  const [data] = useState(centers);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
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

  return (
    <div className="min-h-screen font-inter text-gray-200">
      <div className=" bg-white rounded-lg shadow-xl overflow-hidden">
        <table className="min-w-full border-collapse text-[14px] text-gray-700">
          <thead>
            <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
              <th className="p-4">#</th>
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
          <tbody>
            {paginatedData.map((center, index) => (
              <tr key={center.id} className="border-t border-gray-200">
                <td className="p-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-4">{center.code}</td>
                <td className="p-4">{center.name}</td>
                <td className="p-4 font-bold">{center.manager}</td>
                <td className="p-4">{center.email}</td>
                <td className="p-4">{center.phone}</td>
                <td className="p-4">{center.address}</td>
                <td className="p-4">{center.students}</td>
                <td className="p-4">{center.leads}</td>
                <td className="p-4 relative text-right">
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
