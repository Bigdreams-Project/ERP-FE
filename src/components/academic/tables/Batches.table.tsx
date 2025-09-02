"use client";
import BatchModal from "@/components/modals/academic/Batch.modal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { batches } from "@/data/mock/academic.data";
import { IBatch } from "@/types/academic/batch.interface";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";

type Props = {
  searchQuery: string;
  filteredData: IBatch[];
};

export default function BatchTable({ searchQuery, filteredData }: Props) {
  const router = useRouter();
  const [data] = useState(batches);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleSave = () => {
    console.log("...");
  };

  const handleActivate = (batchId: string) => {
    setOpenDropdown(null);
  };

  const handleView = (batchId: string) => {
    setOpenDropdown(null);
  };

  const handleEdit = (batchId: string) => {
    setOpenDropdown(null);
  };

  const handleExport = (batchId: string) => {
    setOpenDropdown(null);
  };

  const handleDelete = (batchId: string) => {
    setOpenDropdown(null);
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Batch" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 overflow-x-auto">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                  <th className="p-4 flex items-center">
                    <input type="checkbox" className="mr-2 accent-indigo-600" />{" "}
                    #
                  </th>
                  <th className="p-4">Date Created</th>
                  <th className="p-4">Batch Code</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Faculty</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Enrolled Students</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {paginatedData.map((batch, index) => (
                  <tr
                    key={batch.id}
                    onClick={() =>
                      router.push(`/dashboard/academic/batches/${batch.id}`)
                    }
                    className="hover:shadow-md hover:shadow-gray-400 cursor-pointer"
                  >
                    <td className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 accent-indigo-600"
                      />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">{batch.createdDate}</td>
                    <td className="p-3">{batch.code}</td>
                    <td className="p-3">{batch.course}</td>
                    <td className="p-3">{batch.duration}</td>
                    <td className="p-3">{batch.faculty}</td>
                    <td className="p-3">{batch.schedule.length}</td>
                    <td className="p-3">{batch.students.length}</td>
                    <td className="p-3">{batch.startDate}</td>
                    <td className="p-3">{batch.endDate}</td>
                    <td className="p-3">
                      <StatusBadge step={batch.status} label={batch.status} />
                    </td>
                    <td className="p-3 relative text-right">
                      <button
                        onClick={() => toggleDropdown(batch.id!)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>
                      {openDropdown === batch.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleActivate(batch.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Acivate
                          </button>
                          <button
                            onClick={() => handleView(batch.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(batch.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleExport(batch.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Export
                          </button>
                          <button
                            onClick={() => handleDelete(batch.id!)}
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
        <div className="sticky bottom-0 z-10 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <BatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          mode="add"
        />
      </div>
    </div>
  );
}
