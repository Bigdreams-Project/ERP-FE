"use client";
import LeadModal from "@/components/modals/academic/Lead.modal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { leads } from "@/data/mock/academic.data";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";

type Props = {
  searchQuery: string;
  filterOptions: {
    startDate: string;
    endDate: string;
  };
};

export default function LeadTable({ searchQuery, filterOptions }: Props) {
  const router = useRouter();
  const [data, setData] = useState(leads);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const itemsPerPage = 10;

  useEffect(() => {
    let result = data;
    const { startDate, endDate } = filterOptions;
    const query = searchQuery.toLowerCase();

    const filtered = result.filter((lead) => {
      const matchesSearch =
        lead.inquiryId.toLowerCase().includes(query) ||
        lead.fullName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.courseInquiry.toLowerCase().includes(query);
      return matchesSearch;
    });

    result = filtered;

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      result = result.filter((lead) => {
        const leadDate = new Date(lead.inquiryDate);

        if (start && end) {
          return leadDate >= start && leadDate <= end;
        } else if (start) {
          return leadDate >= start;
        } else if (end) {
          return leadDate <= end;
        }
        return false;
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchQuery, filterOptions, data]);

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

  const handleSave = () => {
    console.log("...");
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
    console.log("...");
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Lead" setIsModalOpen={setIsModalOpen} />
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
                    />
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
                  <tr
                    key={lead.id}
                    onClick={() =>
                      router.push(`/dashboard/academic/leads/${lead.id}`)
                    }
                    className="hover:shadow-md hover:shadow-gray-400 cursor-pointer"
                  >
                    <td className="pt-6 flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-blue-700">
                        {lead.inquiryId}
                      </p>
                    </td>
                    <td className="p-4 font-bold">{lead.fullName}</td>
                    <td className="p-4">{lead.email}</td>
                    <td className="p-4">{lead.phone}</td>
                    <td className="p-4">{lead.inquiryDate}</td>
                    <td className="p-4">{lead.courseInquiry}</td>
                    <td className="p-4">{lead.nextFollowUp}</td>
                    <td className="p-3">
                      <StatusBadge step={lead.status} label={lead.status} />
                    </td>
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

        <LeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          mode="add"
        />
      </div>
    </div>
  );
}
