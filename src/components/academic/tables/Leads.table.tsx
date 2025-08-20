"use client";
import { leads } from "@/data/mock/academic.data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Pagination from "../common/Pagination";
import StudentModal from "@/components/modals/academic/StudentModal";
import NoResultsFound from "@/components/NotFoundComponent";
import NotFoundComponent from "@/components/NotFoundComponent";

type Props = {
  searchQuery: string;
};

export default function LeadTable({ searchQuery }: Props) {
  const [data] = useState(leads);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 10;

  const filteredData = data.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.fullName.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((center) => center.id);
    const allSelected = currentPageIds.every((id) =>
      selectedLeads.includes(id)
    );

    if (allSelected) {
      setSelectedLeads((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedLeads((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleEnroll = (centerId: string) => {
    setOpenDropdown(null);
    setIsModalOpen(true);
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

  const handleStudentSave = () => {
    console.log("I was called");
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 overflow-x-auto">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                  <th className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((lead) =>
                          selectedLeads.includes(lead.id)
                        )
                      }
                      onChange={handleSelectAll}
                      className="mr-2"
                    />{" "}
                    #
                  </th>
                  <th className="p-4">Inquiry ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Inquiry Date</th>
                  <th className="p-4">Course Inquiry</th>
                  <th className="p-4">Next Follow-up</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {paginatedData.map((lead, index) => (
                  <tr key={lead.id} className="border-t border-gray-200">
                    <td className="p-4 flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">{lead.inquiryId}</td>
                    <td className="p-4 font-bold">{lead.fullName}</td>
                    <td className="p-4">{lead.email}</td>
                    <td className="p-4">{lead.phone}</td>
                    <td className="p-4">{lead.inquiryDate}</td>
                    <td className="p-4">{lead.courseInquiry}</td>
                    <td className="p-4">{lead.nextFollowUp}</td>
                    <td className="p-4 relative text-right">
                      <button
                        onClick={() => toggleDropdown(lead.id)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>
                      {openDropdown === lead.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleEnroll(lead.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Enroll
                          </button>
                          <button
                            onClick={() => handleView(lead.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEmail(lead.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Send an Email
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
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
          )}
        </div>

        <div className="sticky bottom-0 bg-white">
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
